"use strict";

const uuidv4 = require("uuid/v4");
const { of, forkJoin, from, iif, throwError, bindCallback } = require("rxjs");
const { mergeMap, catchError, map, toArray, tap, delay, combineAll, mapTo, reduce } = require('rxjs/operators');
const zlib = require("zlib");
const http = require('http');
const https = require('https');
const Event = require("@nebulae/event-store").Event;
const { CqrsResponseHelper } = require('@nebulae/backend-node-tools').cqrs;
const { ConsoleLogger } = require('@nebulae/backend-node-tools').log;
const { CustomError, INTERNAL_SERVER_ERROR_CODE, PERMISSION_DENIED } = require("@nebulae/backend-node-tools").error;
const { brokerFactory } = require("@nebulae/backend-node-tools").broker;

const broker = brokerFactory();
const eventSourcing = require("../../tools/event-sourcing").eventSourcing;
const { VehicleDA, UserDA, CompanyDA, TemporalToDeletDA } = require("./data-access");
const VehicleHelper = require('./VehicleHelper');

const READ_ROLES = ["VEHICLE_READ"];
const WRITE_ROLES = ["VEHICLE_WRITE"];
const REQUIRED_ATTRIBUTES = [];
const MATERIALIZED_VIEW_TOPIC = "emi-gateway-materialized-view-updates";

/**
 * Singleton instance
 * @type { VehicleCRUD }
 */
let instance;

class VehicleCRUD {
  constructor() {
  }

  /**     
   * Generates and returns an object that defines the CQRS request handlers.
   * 
   * The map is a relationship of: AGGREGATE_TYPE VS { MESSAGE_TYPE VS  { fn: rxjsFunction, instance: invoker_instance } }
   * 
   * ## Example
   *  { "CreateUser" : { "somegateway.someprotocol.mutation.CreateUser" : {fn: createUser$, instance: classInstance } } }
   */
  generateRequestProcessorMap() {
    return {
      'Vehicle': {
        "externalsytem.rest.mutation.PersistVehicle": { fn: instance.persistVehicle$, instance, jwtValidation: { roles: WRITE_ROLES, attributes: REQUIRED_ATTRIBUTES } },
        "externalsytem.rest.pint.mutation.ProcessVehicleBatch": { fn: instance.processVehicleBatch$, instance, jwtValidation: { roles: WRITE_ROLES, attributes: REQUIRED_ATTRIBUTES } },
        "externalsytem.graphql.mutation.PersistVehicle": { fn: instance.persistVehicle$, instance, jwtValidation: { roles: WRITE_ROLES, attributes: REQUIRED_ATTRIBUTES } },

        "externalsytem.rest.mutation.DeleteVehicle": { fn: instance.deleteVehiclesExternalSystem$, instance, jwtValidation: { roles: WRITE_ROLES, attributes: REQUIRED_ATTRIBUTES } },
        "externalsytem.graphql.mutation.DeleteVehicle": { fn: instance.deleteVehiclesExternalSystem$, instance, jwtValidation: { roles: WRITE_ROLES, attributes: REQUIRED_ATTRIBUTES } },

        "emigateway.graphql.query.OrganizationMngVehicleListing": { fn: instance.getOrganizationMngVehicleListing$, instance, jwtValidation: { roles: READ_ROLES, attributes: REQUIRED_ATTRIBUTES } },
        "emigateway.graphql.query.OrganizationMngVehicle": { fn: instance.getVehicle$, instance, jwtValidation: { roles: READ_ROLES, attributes: REQUIRED_ATTRIBUTES } },
        "emigateway.graphql.mutation.OrganizationMngCreateVehicle": { fn: instance.createVehicle$, instance, jwtValidation: { roles: WRITE_ROLES, attributes: REQUIRED_ATTRIBUTES } },
        "emigateway.graphql.mutation.OrganizationMngImportVehicle": { fn: instance.importVehicles$, instance, jwtValidation: { roles: WRITE_ROLES, attributes: REQUIRED_ATTRIBUTES } },
        "emigateway.graphql.mutation.OrganizationMngUpdateVehicle": { fn: instance.updateVehicle$, jwtValidation: { roles: [...WRITE_ROLES, "VEHICLE_RES_ADM"], attributes: REQUIRED_ATTRIBUTES } },
        "emigateway.graphql.mutation.OrganizationMngDeleteVehicles": { fn: instance.deleteVehicles$, jwtValidation: { roles: WRITE_ROLES, attributes: REQUIRED_ATTRIBUTES } },
      }
    }
  };


  /**
   * updates an Vehicle 
   */
  processVehicleBatch$({ root, args, jwt }, authToken) {
    return from(args).pipe(
      mergeMap(vehicle => {
        switch (vehicle.modType) {
          case "UPDATE_MERGE":
          case "CREATE":
            delete vehicle.modType;
            return VehicleDA.updatePintVehicle$(vehicle.id, vehicle, vehicle.organizationId, vehicle.companyId).pipe(
              mergeMap(aggregate => {
                return eventSourcing.emitEvent$(instance.buildAggregateMofifiedEvent(vehicle.modType, 'Vehicle', aggregate._id, authToken, aggregate), { autoAcknowledgeKey: process.env.MICROBACKEND_KEY })
              })
            );
          case "DELETE":
            return VehicleDA.deleteVehicle$(vehicle.id).pipe(
              eventSourcing.emitEvent$(instance.buildAggregateMofifiedEvent('DELETE', 'Vehicle', aggregate._id, authToken, aggregate), { autoAcknowledgeKey: process.env.MICROBACKEND_KEY }),
            );
          default:
            ConsoleLogger.w(`processVehicleBatch: Mod type Ignored: ${vehicle.modType}`);
            return of("mod type Ignored")
        }
      }),
      toArray(),
      mapTo({ code: 200, message: "Vehicle batch successfully processed" }),
      mergeMap(test => {
        return CqrsResponseHelper.buildSuccessResponse$(test)
      })
    );
  }

  /**  
   * Gets the Vehicle list.
   *
   * @param {*} args args
   */
  getOrganizationMngVehicleListing$({ args }, authToken) {
    const { filterInput = {}, paginationInput, sortInput } = args;
    const { queryTotalResultCount = false } = paginationInput || {};
    if (authToken.organizationId) {
      filterInput.organizationId = authToken.organizationId
    }
    const roleGroups = authToken.role_group;
    if (!roleGroups.includes("/PLATFORM-ADMIN") && !roleGroups.includes("/ORGANIZATION-ADMIN")) {
      if (roleGroups.includes("/VEHICLE-OWNER")) {
        filterInput.ownerId = authToken._id;
      }
      if (roleGroups.includes("/VEHICLE-ADMINISTRATOR")) {
        filterInput.managerId = authToken._id;
      }
      if (roleGroups.includes("/VEHICLE-DRIVER")) {
        filterInput.driverId = authToken._id;
      }
    }
    const { isAdmin, allowedCompanyIds } = VehicleCRUD.extractCompanyIdsFromToken(authToken)
    if (allowedCompanyIds) {
      filterInput.companyId = allowedCompanyIds;
    }

    if (!isAdmin && filterInput.company !== "ALL_COMPANIES" && filterInput.company !== "NO_COMPANY" && filterInput.company != null && !allowedCompanyIds.includes(filterInput.company)) {
      return CqrsResponseHelper.handleError$(new CustomError('PermissionDenied', 'CqrsService.verifyRequest$', PERMISSION_DENIED, 'the user does not have the needed roles to execute this command/query'))
    }

    const ignoreProjection = (filterInput.extendedData === true);
    return forkJoin([
      VehicleDA.getVehicleList$(filterInput, paginationInput, sortInput, ignoreProjection).pipe(toArray()),
      queryTotalResultCount ? VehicleDA.getVehicleSize$(filterInput) : of(undefined),
    ]).pipe(
      map(([listing, queryTotalResultCount]) => {
        return { listing, queryTotalResultCount };
      }),
      mergeMap(data => {
        const vehiclesWithHumanResources = data.listing.filter(vehicle => vehicle.humanResources);
        if (vehiclesWithHumanResources.length === 0) {
          return of({ listing: data.listing, queryTotalResultCount: data.queryTotalResultCount });
        }
        return instance.extendVehicleWithUserObjList$(vehiclesWithHumanResources).pipe(
          map(extendedVehicles => {
            const updatedListing = data.listing.map(vehicle => {
              const extendedVehicle = extendedVehicles.find(ev => ev._id === vehicle._id);
              return extendedVehicle ? extendedVehicle : vehicle;
            });

            return { listing: updatedListing, queryTotalResultCount: data.queryTotalResultCount };
          })
        );
      }),
      mergeMap(rawResponse => CqrsResponseHelper.buildSuccessResponse$(rawResponse)),
      catchError(err => iif(() => err.name === 'MongoTimeoutError', throwError(err), CqrsResponseHelper.handleError$(err)))
    );

  }

  /**  
   * Gets the get Vehicle by id
   *
   * @param {*} args args
   */
  getVehicle$({ args }, authToken) {
    let { id, organizationId } = args;

    let companyId;
    if (authToken.companyId) {
      companyId = authToken.companyId;
    }
    if (authToken.organizationId) {
      organizationId = authToken.organizationId
    }
    const { isAdmin, allowedCompanyIds } = VehicleCRUD.extractCompanyIdsFromToken(authToken)
    if (!isAdmin && allowedCompanyIds.length === 0) {
      return CqrsResponseHelper.handleError$(new CustomError('PermissionDenied', 'CqrsService.verifyRequest$', PERMISSION_DENIED, 'the user does not have the needed roles to execute this command/query'))
    }
    return VehicleDA.getVehicle$(id, organizationId, allowedCompanyIds).pipe(
      map((vehicle) => {
        if (vehicle.humanResources) {
          const { humanResources: { ownerIds, driverIds, managerIds } } = vehicle;
          const vehicleHumanResources = [...ownerIds, ...driverIds, ...managerIds];
          if (!isAdmin && !authToken.role_group.includes("/SERVICE-SUPERVISOR")
            && !authToken.role_group.includes("/COMPANY-VIEWER")
            && !(
              authToken.role_group.includes("/COMPANY-ADMIN") ||
              authToken.role_group.includes("/COMPANY-ADMIN-TPE")
            )
            && vehicleHumanResources.length > 0
            && (!vehicleHumanResources.includes(authToken._id))) {
            return {};
          }
          return vehicle;
        }
        return vehicle;
      }),
      mergeMap(vehicle => instance.extendVehicleWithUserObjList$(vehicle)),
      mergeMap(rawResponse => CqrsResponseHelper.buildSuccessResponse$(rawResponse)),
      catchError(err => iif(() => err.name === 'MongoTimeoutError', throwError(err), CqrsResponseHelper.handleError$(err)))
    );

  }

  extendVehicleWithUserObjList$(vehicles) {
    const isArray = Array.isArray(vehicles);
    const vehiclesArray = isArray ? vehicles : [vehicles];
    return forkJoin(
      vehiclesArray.map(vehicle => {
        if (!vehicle.humanResources) return of(vehicle);
        const { ownerIds = [], managerIds = [], driverIds = [] } = vehicle.humanResources;
        return UserDA.getUserList$([...ownerIds, ...managerIds, ...driverIds]).pipe(
          toArray(),
          map(userObjList => ({ ...vehicle, humanResources: { ...vehicle.humanResources, userObjList } }))
        );
      })
    ).pipe(
      map(extendedVehicles => isArray ? extendedVehicles : extendedVehicles[0])
    );
  }

  decompress(compressedServicePlanning) {
    const servicePlanning = JSON.parse(
      zlib.inflateSync(
        Buffer.from(compressedServicePlanning, 'base64')
      )
    );
    return servicePlanning;
  }
  persistVehicleInfo$(vehicle, organizationId, authToken) {
    const { action, data } = vehicle;
    const { _id = uuidv4(), ...properties } = data;
    return (action === "UPDATE" ? VehicleDA.updateVehicleFromImportation$(_id, properties, organizationId, authToken.preferred_username) : VehicleDA.createVehicleFromImportation$(_id, properties, organizationId, authToken.preferred_username)).pipe(
      // mergeMap(vehicle => instance.extendVehicleWithUserObjList$(vehicle)),
      mergeMap(aggregate => aggregate ? forkJoin(
        of(aggregate),
        eventSourcing.emitEvent$(instance.buildAggregateMofifiedEvent('CREATE', 'Vehicle', _id, authToken, { ...aggregate }), { autoAcknowledgeKey: process.env.MICROBACKEND_KEY }),
        broker.send$(MATERIALIZED_VIEW_TOPIC, `OrganizationMngVehicleModified`, aggregate),
        process.env.REACT_APP_PLATFORM_TYPE === "DEPENDENT" ? instance.loadVehicleToParentPlatform$({ _id, ...aggregate }, authToken) : of(null),
      ) : of([undefined])),
      map(([aggregate]) => ({ isValid: true, persisted: aggregate ? true : false, action, reason: aggregate ? null : "NOT_FOUND" })),
      catchError(err => {
        if (err.name === 'MongoTimeoutError') return of({ isValid: true, persisted: false, reason: "MONGO_ERROR" });
        return of({ isValid: true, persisted: false, reason: "PROCESS_ERROR" })
      })
    )
  }
  importVehicles$({ root, args, jwt }, authToken) {
    const { vehicleDataCompress } = args;
    const isPlatformAdmin = authToken.role_group.includes("/PLATFORM-ADMIN");
    const objFile = instance.decompress(vehicleDataCompress);
    const organizationId = isPlatformAdmin ? args.organizationId : authToken.organizationId;
    const startTime = Date.now();
    return VehicleHelper.buildNewStructure$(objFile, organizationId).pipe(
      mergeMap((vehicle) => {
        const isVehicleValid = VehicleHelper.validateFile(vehicle);
        return isVehicleValid ? instance.persistVehicleInfo$(vehicle, organizationId, authToken) : of({ isValid: false, persisted: false, reason: "INVALID_DATA" })
      }),
      reduce((acc, val) => {
        if (val.isValid) acc.validRows++;
        if (val.persisted) acc.persisted++;
        if (val.reason) acc[val.reason]++;
        if (val.action === "INSERT") acc.inserted++;
        if (val.action === "UPDATE") acc.updated++;
        return acc;
      }, { persisted: 0, validRows: 0, inserted: 0, updated: 0, INVALID_DATA: 0, NOT_FOUND: 0, PROCESS_ERROR: 0, MONGO_ERROR: 0 }),
      mergeMap((reportSummary) => CqrsResponseHelper.buildSuccessResponse$(reportSummary)),
      catchError(err => iif(() => err.name === 'MongoTimeoutError', throwError(err), CqrsResponseHelper.handleError$(err)))
    )

  }


  /**
  * Create a Vehicle
  */
  createVehicle$({ root, args, jwt }, authToken) {
    const aggregateId = uuidv4();
    const input = {
      active: false,
      ...args.input,
    };
    if (authToken.organizationId) {
      input.organizationId = authToken.organizationId;
    }
    const { isAdmin, allowedCompanyIds } = VehicleCRUD.extractCompanyIdsFromToken(authToken)
    if (!isAdmin && !allowedCompanyIds.includes(input.companyId)) {
      return CqrsResponseHelper.handleError$(new CustomError('PermissionDenied', 'CqrsService.verifyRequest$', PERMISSION_DENIED, 'the user does not have the needed roles to execute this command/query'))
    }

    return VehicleDA.getVehicleByPlate$(input.plate, input.organizationId).pipe(
      tap((vehicle) => {
        if (vehicle) {
          throw new CustomError('CouldNotPersistAlreadyExist', 'Vehicle', 7012, "Vehicle couldn't be persisted because it already exists");
        }
      }),
      mergeMap(() => VehicleDA.createVehicle$(aggregateId, input, authToken.preferred_username)),
      mergeMap(vehicle => instance.extendVehicleWithUserObjList$(vehicle)),
      mergeMap(aggregate => forkJoin(
        CqrsResponseHelper.buildSuccessResponse$(aggregate),
        eventSourcing.emitEvent$(instance.buildAggregateMofifiedEvent('CREATE', 'Vehicle', aggregateId, authToken, aggregate), { autoAcknowledgeKey: process.env.MICROBACKEND_KEY }),
        broker.send$(MATERIALIZED_VIEW_TOPIC, `OrganizationMngVehicleModified`, aggregate),
        process.env.REACT_APP_PLATFORM_TYPE === "DEPENDENT" ? instance.loadVehicleToParentPlatform$({ _id: aggregateId, ...aggregate }, authToken) : of(null),
      )),
      map(([sucessResponse, evt, subsRest, loadToParent]) => {
        return process.env.REACT_APP_PLATFORM_TYPE === "DEPENDENT"
          ? { ...sucessResponse, data: { ...sucessResponse.data, codeLoadToParent: sucessResponse.result.code === 200 ? loadToParent.code : null } }
          : sucessResponse;
      }),
      catchError(err => iif(() => err.name === 'MongoTimeoutError', throwError(err), CqrsResponseHelper.handleError$(err)))
    );
  }



  /**
   * updates an Route 
   */
  persistVehicle$({ root, args, jwt }, authToken) {
    const { vehicleId, input } = args;
    let companyId = authToken.companyId;
    let organizationId = authToken.organizationId
    return VehicleDA.getExternalVehicle$(vehicleId, organizationId, companyId).pipe(
      tap(() => {
        if (!organizationId) {
          throw new CustomError('CouldntGetOrganizationFromUser', 'Vehicle', 10010, "Vehicle couldn't be persisted because current user doesn't have a organization assigned. Please contact the user's manager");
        }
        if (!companyId) {
          throw new CustomError('CouldntGetCompanyFromUser', 'Vehicle', 10011, "Vehicle couldn't be persisted because current user doesn't have a company assigned. Please contact the user's manager");
        }
      }),
      mergeMap(result => {
        return VehicleDA.persistVehicle$(vehicleId, { ...input, organizationId, companyId }, organizationId, companyId, (result.id === undefined ? authToken.preferred_username : undefined), authToken.preferred_username).pipe(
          mergeMap(aggregate => forkJoin(
            CqrsResponseHelper.buildSuccessResponse$(aggregate),
            eventSourcing.emitEvent$(instance.buildAggregateMofifiedEvent(result._id ? 'UPDATE_MERGE' : 'CREATE', 'Vehicle', aggregate._id, authToken, { ...aggregate, _id: undefined }), { autoAcknowledgeKey: process.env.MICROBACKEND_KEY }),
          )),
          map(([sucessResponse]) => sucessResponse),
        );
      }),
      catchError(err => iif(() => err.name === 'MongoTimeoutError', throwError(err), CqrsResponseHelper.handleError$(err)))
    )
  }

  /**
   * updates an Vehicle 
   */
  updateVehicle$({ root, args, jwt }, authToken) {
    const { id, input, merge } = args;
    let organizationId;
    let companyId;
    if (input.companyId) {
      companyId = input.companyId;
    }
    if (authToken.organizationId) {
      organizationId = authToken.organizationId;
    }
    const { isAdmin, allowedCompanyIds } = VehicleCRUD.extractCompanyIdsFromToken(authToken)
    if (!isAdmin && !allowedCompanyIds.includes(companyId)) {
      return CqrsResponseHelper.handleError$(new CustomError('PermissionDenied', 'CqrsService.verifyRequest$', PERMISSION_DENIED, 'the user does not have the needed roles to execute this command/query'))
    }


    return VehicleDA.getVehicleByPlate$(input.plate, input.organizationId, id).pipe(
      tap((vehicle) => {
        if (vehicle) {
          throw new CustomError('CouldNotPersistAlreadyExist', 'Vehicle', 7012, "Vehicle couldn't be persisted because it already exists");
        }
      }),
      mergeMap(() => (merge ? VehicleDA.updateVehicle$ : VehicleDA.replaceVehicle$)(id, input, authToken.preferred_username, organizationId, companyId)),
      mergeMap(vehicle => instance.extendVehicleWithUserObjList$(vehicle)),
      mergeMap(aggregate => forkJoin(
        CqrsResponseHelper.buildSuccessResponse$(aggregate),
        eventSourcing.emitEvent$(instance.buildAggregateMofifiedEvent(merge ? 'UPDATE_MERGE' : 'UPDATE_REPLACE', 'Vehicle', id, authToken, aggregate), { autoAcknowledgeKey: process.env.MICROBACKEND_KEY }),
        broker.send$(MATERIALIZED_VIEW_TOPIC, `OrganizationMngVehicleModified`, aggregate),
        process.env.REACT_APP_PLATFORM_TYPE === "DEPENDENT" ? instance.loadVehicleToParentPlatform$(aggregate, authToken) : of(null),
      )),
      map(([sucessResponse, evt, subsRest, loadToParent]) => {
        return process.env.REACT_APP_PLATFORM_TYPE === "DEPENDENT"
          ? { ...sucessResponse, data: { ...sucessResponse.data, codeLoadToParent: sucessResponse.result.code === 200 ? loadToParent.code : null } }
          : sucessResponse;
      }),
      catchError(err => iif(() => err.name === 'MongoTimeoutError', throwError(err), CqrsResponseHelper.handleError$(err)))
    );
  }

  loadVehicleToParentPlatform$(aggregate, authToken) {
    const companyId = aggregate.companyId;
    const organizationId = aggregate.organizationId;


    return CompanyDA.getCompany$(companyId, organizationId).pipe(
      tap(instance.validateCompany),
      map((company) => {
        const vehicleEdit = JSON.stringify({ ...aggregate, companyId: company.primaryLink.companyId, organizationId: company.primaryLink.organizationId, humanResources: undefined, metadata: undefined, id: aggregate.externalSystemId || aggregate._id });
        const options = {
          url: company.primaryLink.url,
          ops: {
            auth: `${company.primaryLink.username}:${company.primaryLink.password}`,
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              "Content-Length": Buffer.byteLength(vehicleEdit, 'utf8')
            }
          }
        }
        return { vehicleEdit, options }
      }),
      mergeMap(({ vehicleEdit, options }) => bindCallback(instance.request)(options.url + "/vehicle", options.ops, vehicleEdit).pipe(
        map(({ error, statusCode, body }) => {
          const cumstomizedError = instance.validateRequestErrors(error, statusCode, body);
          if (cumstomizedError) {
            throw cumstomizedError;
          } else {
            return JSON.parse(body);
          }
        }),
      )),
      map((sucessResponse) => sucessResponse),
      catchError(err => {
        if (err.name === 'MongoTimeoutError') {
          throwError(err)
        } else {
          ConsoleLogger.e(`${err.code ? err.code : err} - ${err.code && err.name ? err.name : ''}: VehicleId - ${err.code ? aggregate._id : ''}`);
          return VehicleDA.setPendingToReportToParentFlagOnVehicle$(aggregate._id, aggregate, authToken.preferred_username, organizationId, companyId, true).pipe(
            mapTo(err)
            //mergeMap(()=>throwError(err))
          );
        }
      })
    )
  }

  validateCompany(company) {
    if (!company || !company._id) throw new CustomError('CompanyNotFound', 'Company', 7000, "Company not found");
    //if (!company.active) throw new CustomError('CompanyIsNotActive', 'Company', 7001, "Company is not active");
    if (!company.primaryLink) throw new CustomError('CompanyDoesNotHavePrimaryLink', 'Company', 7002, "Company does not have primaryLink");
    if (!company.primaryLink.username) throw new CustomError('CompanyDoesNotHaveUsername', 'Company', 7003, "Company does not have username");
    if (!company.primaryLink.password) throw new CustomError('CompanyDoesNotHavePassword', 'Company', 7004, "Company does not have password");
    if (!company.primaryLink.organizationId) throw new CustomError('CompanyDoesNotHaveOrganizationId', 'Company', 7005, "Company does not have organizationId");
    if (!company.primaryLink.companyId) throw new CustomError('CompanyDoesNotHaveCompanyId', 'Company', 7006, "Company does not have companyId");
  }

  request(url, ops, data, callBack) {
    const req = https.request(url, ops, (res) => {
      const dataFragments = [];
      res.on('data', (data) => {
        dataFragments.push(data);
      });
      res.on('end', () => {
        callBack({ error: undefined, headers: res.headers, statusCode: res.statusCode, body: Buffer.concat(dataFragments).toString() })
      });
    });
    req.on('error', (e) => callBack({ error: e, headers: undefined, statusCode: undefined, body: undefined }));
    if (data) {
      req.write(data)
    }
    req.end();
  }

  validateRequestErrors(error, statusCode, body) {
    if (!statusCode) {
      if (error && error.code) {
        if (error.code === "EAI_AGAIN") return new CustomError('NetworkError', 'Vehicle', 7007, "Network Error");
        if (error.code === "ENOTFOUND") return new CustomError('CouldNotGetUrl', 'Vehicle', 7008, "Could not get url");
      }
    }
    if (statusCode === 401) return new CustomError('InvalidCredentials', 'Vehicle', 7009, "Invalid Creadentials");
    if (statusCode === 404) return new CustomError('CouldNotGetRestResponse', 'Vehicle', 7010, "Could not get rest response");
    if (statusCode === 400) return new CustomError('InvalidJsonVehicleInBody', 'Vehicle', 7011, "Invalid body vehicle");
    if (statusCode === 500) return new CustomError('InvalidJsonVehicleInBody', 'Vehicle', 7011, "Invalid body vehicle");
    if (body === '' || body === "[]" || body === "{}") return new CustomError('CouldNotGetRestResponse', 'Vehicle', 7010, "Could not get rest response");
    return undefined;

  }

  /**
   * deletes an Vehicle
   */
  deleteVehicles$({ root, args, jwt }, authToken) {
    const { ids } = args;
    const aggregateId = uuidv4();
    const organizationId = authToken.organizationId || args.organizationId;
    const companyId = authToken.companyId || args.companyId
    let companyIds;

    const { allowedCompanyIds, isAdmin } = VehicleCRUD.extractCompanyIdsFromToken(authToken)
    if (!isAdmin) {
      companyIds = allowedCompanyIds;
    }

    return forkJoin([
      VehicleDA.deleteVehicles$(ids, organizationId, companyIds),
      from(ids).pipe(
        mergeMap(id => eventSourcing.emitEvent$(instance.buildAggregateMofifiedEvent('DELETE', 'Vehicle', id, authToken, {})), { autoAcknowledgeKey: process.env.MICROBACKEND_KEY }),
        toArray(),
      ),
      process.env.REACT_APP_PLATFORM_TYPE === "DEPENDENT" ? TemporalToDeletDA.createTemporalToDelet$(aggregateId, ids, authToken.preferred_username, organizationId, companyId) : of(null),
    ]).pipe(
      map(([ok, esResps]) => { return { code: ok ? 200 : 400, message: `Vehicle with ids: ${JSON.stringify(ids)} ${ok ? "has been deleted" : "not found for deletion"}` } }),
      mergeMap((r) => forkJoin([
        CqrsResponseHelper.buildSuccessResponse$(r),
        broker.send$(MATERIALIZED_VIEW_TOPIC, `OrganizationMngVehicleModified`, { id: 'deleted', name: '', active: false, description: '', organizationId: "deleted", plate: "deleted" }),
        process.env.REACT_APP_PLATFORM_TYPE === "DEPENDENT" ? instance.deleteVehicleFromParentPlatform$(ids, authToken, organizationId, companyId) : of(null)
      ])),
      map(([cqrsResponse, brokerRes]) => cqrsResponse),
      catchError(err => iif(() => err.name === 'MongoTimeoutError', throwError(err), CqrsResponseHelper.handleError$(err))),
    );
  }

  deleteVehiclesExternalSystem$({ root, args, jwt }, authToken) {
    const { ids } = args;
    const organizationId = authToken.organizationId || args.organizationId;
    const companyId = authToken.companyId || args.companyId

    return forkJoin([
      VehicleDA.deleteVehicleExternalSystemIds$(ids, organizationId, companyId),
      from(ids).pipe(
        mergeMap(id => eventSourcing.emitEvent$(instance.buildAggregateMofifiedEvent('DELETE', 'Vehicle', id, authToken, {})), { autoAcknowledgeKey: process.env.MICROBACKEND_KEY }),
        toArray(),
      ),
    ]).pipe(
      map(([ok, esResps]) => { return { code: ok ? 200 : 400, message: `Vehicle with ids: ${JSON.stringify(ids)} ${ok ? "has been deleted" : "not found for deletion"}` } }),
      mergeMap((r) => forkJoin([
        CqrsResponseHelper.buildSuccessResponse$(r),
        broker.send$(MATERIALIZED_VIEW_TOPIC, `OrganizationMngVehicleModified`, { id: 'deleted', name: '', active: false, description: '', organizationId: "deleted", plate: "deleted" })
      ])),
      map(([cqrsResponse, brokerRes]) => cqrsResponse),
      catchError(err => {
        if (err.name === 'MongoTimeoutError') {
          throwError(err)
        } else {
          ConsoleLogger.e(`${err.code ? err.code : err} - ${err.code && err.name ? err.name : ''}: VehicleId - ${err.code ? aggregate._id : ''}`);
        }
      }),
    );
  }

  deleteVehicleFromParentPlatform$(ids, authToken, organizationId, companyId) {
    return CompanyDA.getCompany$(companyId, organizationId).pipe(
      tap(instance.validateCompany),
      map((company) => {
        const vehicleIds = JSON.stringify(ids);
        const options = {
          url: company.primaryLink.url,
          ops: {
            auth: `${company.primaryLink.username}:${company.primaryLink.password}`,
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              "Content-Length": Buffer.byteLength(vehicleIds, 'utf8')
            }
          }
        }
        return { vehicleIds, options }
      }),
      mergeMap(({ vehicleIds, options }) => bindCallback(instance.request)(options.url + "/del_vehicle", options.ops, vehicleIds).pipe(
        map(({ error, statusCode, body }) => {
          const cumstomizedError = instance.validateRequestErrors(error, statusCode, body);
          if (cumstomizedError) {
            throw cumstomizedError;
          } else {
            return JSON.parse(body);
          }
        }),
      )),
      map((sucessResponse) => sucessResponse),
      catchError(err => {
        if (err.name === 'MongoTimeoutError') {
          throwError(err)
        } else {
          ConsoleLogger.e(`${err.code ? err.code : err} - ${err.code && err.name ? err.name : ''}: ids - ${err.code ? ids : ''}`);
          return of(err);
        }
      })
    )
  }


  /**
   * Generate an Modified event 
   * @param {string} modType 'CREATE' | 'UPDATE' | 'DELETE'
   * @param {*} aggregateType 
   * @param {*} aggregateId 
   * @param {*} authToken 
   * @param {*} data 
   * @returns {Event}
   */
  buildAggregateMofifiedEvent(modType, aggregateType, aggregateId, authToken, data) {
    if (data._id) delete data._id;
    return new Event({
      eventType: `${aggregateType}Modified`,
      eventTypeVersion: 1,
      aggregateType: aggregateType,
      aggregateId,
      data: {
        modType,
        ...data
      },
      user: authToken.preferred_username
    })
  }
  /**
   * return an array object with  company ids and  is Admin
   * @param {*} authToken 
   */
  static extractCompanyIdsFromToken(authToken) {
    const isAdmin = authToken.role_group.includes("/PLATFORM-ADMIN") ||
      authToken.role_group.includes("/ORGANIZATION-ADMIN") ||
      authToken.role_group.includes("/ORGANIZATION-VIEWER") ||
      authToken.role_group.includes("/IT-SUPPORT");
    authToken.role_group.includes("/PLATFORM-ADMIN") ||
      // authToken.role_group.includes("/COMPANY-ADMIN") ||
      // authToken.role_group.includes("/COMPANY-ADMIN-TPE") ||
      authToken.role_group.find(rgn => rgn.includes("/COMPANY-VIEWER")) != null ||
      authToken.role_group.includes("/SERVICE-SUPERVISOR")

    const allowedCompanyIds = (authToken.companyIds != null && authToken.companyIds.length > 0)
      ? authToken.companyIds // SOLO TIENE DERECHO A LO QUE INIDIQUE EL TOKEN EN authToken.companyids
      : (authToken.companyId != null && authToken.companyId.trim() !== '')
        ? [authToken.companyId] // SOLO TIENE DERECHO A LO QUE INIDIQUE EL TOKEN EN authToken.companyId
        : (isAdmin)
          ? null // NULL TIENE DERECHO A TODO
          : []; // NO TIENE DERECHA A NADA
    return { isAdmin, allowedCompanyIds };
  }
}

/**
 * @returns {VehicleCRUD}
 */
module.exports = () => {
  if (!instance) {
    instance = new VehicleCRUD();
    ConsoleLogger.i(`${instance.constructor.name} Singleton created`);
  }
  return instance;
};
