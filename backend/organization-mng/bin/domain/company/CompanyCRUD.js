"use strict";

const uuidv4 = require("uuid/v4");
const { of, forkJoin, from, iif, throwError, bindCallback } = require("rxjs");
const { mergeMap, catchError, map, toArray, pluck, tap, concatMap, mapTo } = require('rxjs/operators');
const request = require("request");
const https = require("https");
const http = require("http");
const Event = require("@nebulae/event-store").Event;
const { CqrsResponseHelper } = require('@nebulae/backend-node-tools').cqrs;
const { ConsoleLogger } = require('@nebulae/backend-node-tools').log;
const { CustomError, INTERNAL_SERVER_ERROR_CODE, PERMISSION_DENIED } = require("@nebulae/backend-node-tools").error;
const { brokerFactory } = require("@nebulae/backend-node-tools").broker;

const broker = brokerFactory();
const eventSourcing = require("../../tools/event-sourcing").eventSourcing;
const CompanyDA = require("./data-access/CompanyDA");
const { Observable } = require("rxjs");
const PaymentMediumCodeDA = require("./data-access/PaymentMediumCodeDA");

const READ_ROLES = ["COMPANY_READ", "GEOFENCE_READ", "USER_READ", "VEHICLE_READ", "COMPANY_INFO_READ"];
const WRITE_ROLES = ["COMPANY_WRITE"];
const REQUIRED_ATTRIBUTES = [];
const MATERIALIZED_VIEW_TOPIC = "emi-gateway-materialized-view-updates";

/**
 * Singleton instance
 * @type { CompanyCRUD }
 */
let instance;

class CompanyCRUD {
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
      'Company': {
        "externalsytem.rest.query.OrganizationMngCompany": { fn: instance.getExternalCompany$, instance, jwtValidation: { roles: READ_ROLES, attributes: REQUIRED_ATTRIBUTES } },
        "externalsytem.graphql.query.OrganizationMngCompany": { fn: instance.getExternalCompany$, instance, jwtValidation: { roles: READ_ROLES, attributes: REQUIRED_ATTRIBUTES } },
        "externalsytem.rest.query.VehicleQuota": { fn: instance.getVehicleQuota$, instance, jwtValidation: { roles: READ_ROLES, attributes: REQUIRED_ATTRIBUTES } },
        "externalsytem.graphql.query.VehicleQuota": { fn: instance.getVehicleQuota$, instance, jwtValidation: { roles: READ_ROLES, attributes: REQUIRED_ATTRIBUTES } },
        "externalsytem.rest.pint.query.OrganizationMngCompanyListing": { fn: instance.getOrganizationMngCompanyExternalListing$, instance, jwtValidation: { roles: READ_ROLES, attributes: REQUIRED_ATTRIBUTES } },
        "emigateway.graphql.query.UserMngCompanyListing": { fn: instance.getUserMngCompanyListing$, instance, jwtValidation: { roles: READ_ROLES, attributes: REQUIRED_ATTRIBUTES } },
        "emigateway.graphql.query.OrganizationMngAlliesListing": { fn: instance.getOrganizationMngAlliesListing$, instance, jwtValidation: { roles: READ_ROLES, attributes: REQUIRED_ATTRIBUTES } },
        "emigateway.graphql.query.OrganizationMngExternalCompany": { fn: instance.syncExternalCompany$, instance, jwtValidation: { roles: READ_ROLES, attributes: REQUIRED_ATTRIBUTES } },
        "emigateway.graphql.query.OrganizationMngCompanyListing": { fn: instance.getOrganizationMngCompanyListing$, instance, jwtValidation: { roles: READ_ROLES, attributes: REQUIRED_ATTRIBUTES } },
        "emigateway.graphql.query.OrganizationMngCompany": { fn: instance.getCompany$, instance, jwtValidation: { roles: READ_ROLES, attributes: REQUIRED_ATTRIBUTES } },
        "emigateway.graphql.query.OrganizationMngParentCompanyVehicleQuota": { fn: instance.getParentCompanyVehicleQuota$, instance, jwtValidation: { roles: WRITE_ROLES, attributes: REQUIRED_ATTRIBUTES } },
        "emigateway.graphql.mutation.OrganizationMngUploadCompanyDocument": { fn: instance.uploadCompanyDocument$, instance, jwtValidation: { roles: WRITE_ROLES, attributes: REQUIRED_ATTRIBUTES } },
        "emigateway.graphql.mutation.OrganizationMngDeleteCompanyDocumentsByFileUrl": { fn: instance.deleteCompanyDocuments$, instance, jwtValidation: { roles: WRITE_ROLES, attributes: REQUIRED_ATTRIBUTES } },
        "emigateway.graphql.mutation.OrganizationMngCreateCompany": { fn: instance.createCompany$, instance, jwtValidation: { roles: WRITE_ROLES, attributes: REQUIRED_ATTRIBUTES } },
        "emigateway.graphql.mutation.OrganizationMngUpdateCompany": { fn: instance.updateCompany$, jwtValidation: { roles: WRITE_ROLES, attributes: REQUIRED_ATTRIBUTES } },
        //"emigateway.graphql.mutation.OrganizationMngDeleteCompanies": { fn: instance.deleteCompanies$, jwtValidation: { roles: WRITE_ROLES, attributes: REQUIRED_ATTRIBUTES } },
      }
    };
  }


  /**  
   * Gets the Company list
   *
   * @param {*} args args
   */
  getOrganizationMngCompanyListing$({ args }, authToken) {
    const { filterInput, paginationInput, sortInput } = args;
    const { queryTotalResultCount = false } = paginationInput || {};

    return forkJoin([
      CompanyDA.getCompanyList$(filterInput, paginationInput, sortInput).pipe(toArray()),
      queryTotalResultCount ? CompanyDA.getCompanySize$(filterInput) : of(undefined),
    ]).pipe(
      map(([listing, queryTotalResultCount]) => ({ listing, queryTotalResultCount })),
      concatMap(rawResponse => CqrsResponseHelper.buildSuccessResponse$(rawResponse)),
      catchError(err => iif(() => err.name === 'MongoTimeoutError', throwError(err), CqrsResponseHelper.handleError$(err)))
    );
  }

  getOrganizationMngCompanyExternalListing$({ args }, authToken) {
    const filterInput = {};
    const { count, page } = args;
    const roleGroups = authToken.role_group;
    if (!(roleGroups || []).includes("/PLATFORM-ADMIN")) {
      filterInput.organizationId = authToken.organizationId;
    }

    return CompanyDA.getCompanyExternalList$(filterInput, { page, count }).pipe(
      toArray(),
      concatMap(rawResponse => CqrsResponseHelper.buildSuccessResponse$(rawResponse)),
      catchError(err => iif(() => err.name === 'MongoTimeoutError', throwError(err), CqrsResponseHelper.handleError$(err)))
    );
  }

  /**  
  * Gets the get Company by id.
  *
  * @param {*} args args
  */
  getVehicleQuota$({ args }, authToken) {
    const { companyId, organizationId } = authToken;
    return CompanyDA.getCompany$(companyId, organizationId).pipe(
      map(result => ({ id: result.id, vehicleQuota: result.vehicleQuota, organizationId: result.organizationId })),
      mergeMap(rawResponse => CqrsResponseHelper.buildSuccessResponse$(rawResponse)),
      catchError(err => iif(() => err.name === 'MongoTimeoutError', throwError(err), CqrsResponseHelper.handleError$(err)))
    );
  }

  getParentCompanyVehicleQuota$({ args }, authToken) {
    const companyId = authToken.companyId || args.companyId;
    const organizationId = authToken.organizationId || args.organizationId;
    return CompanyDA.getCompany$(companyId, organizationId).pipe(
      tap(instance.validatecompany),
      map(instance.buildRequest),
      mergeMap(({ url, ops }) => bindCallback(instance.request)(url + "/vehicle-quota", ops)),
      map(({ error, statusCode, body }) => {
        const cumstomizedError = instance.validateRequestErrors(error, statusCode, body);

        if (cumstomizedError) {
          throw cumstomizedError;
        } else {
          return JSON.parse(body);
        }
      }),
      mergeMap(rawResponse => CqrsResponseHelper.buildSuccessResponse$(rawResponse)),
      catchError(err => iif(() => err.name === 'MongoTimeoutError', throwError(err), CqrsResponseHelper.handleError$(err)))
    );
  }

  buildRequest(organization) {
    return ({
      url: organization.primaryLink.url,
      ops: {
        auth: `${organization.primaryLink.username}:${organization.primaryLink.password}`,
        method: 'GET'
      }
    });
  }
  request(url, statusCode, callBack) {
    const req = https.request(url, statusCode, (res) => res.on('data', (data) => callBack({ error: undefined, headers: res.headers, statusCode: res.statusCode, body: data.toString() })));
    req.on('error', (e) => callBack({ error: e, headers: undefined, statusCode: undefined, body: undefined }));
    req.end();
  }

  validatecompany(company) {
    if (!company || !company.id) throw new CustomError('CompanyNotFound', 'Company', 3000, "Company not found");
    if (!company.active) throw new CustomError('CompanyIsNotActive', 'Company', 3001, "Company is not active");
    if (company && !company.primaryLink) throw new CustomError('CompanyDoesNotHavePrimaryLink', 'Company', 3002, "Company doesnot have primaryLink");
    if (!company.primaryLink.url) throw new CustomError('CompanyDoesNotHaveUrl', 'Company', 3003, "Company doesnot have Url");
    if (!company.primaryLink.username) throw new CustomError('CompanyDoesnotHaveUsername', 'Company', 3004, "Company doesnot have username");
    if (!company.primaryLink.password) throw new CustomError('CompanyDoesnotHavePassword', 'Company', 3005, "Company doesnot have password");
  }

  validateRequestErrors(error, statusCode, body) {

    if (!statusCode) {
      if (error && error.code) {
        if (error.code === "EAI_AGAIN") return new CustomError('NetworkError', 'Company', 3006, "Network Error");
        if (error.code === "ENOTFOUND") return new CustomError('CouldGetUrl', 'Company', 3007, "Could get url");
        if (error.code === "ECONNREFUSED") return new CustomError('ConnectionRefused', 'Company', 3010, "Connection refused");
      }
    }
    if (statusCode === 401) return new CustomError('InvalidCredentials', 'Company', 3008, "Invalid Creadentials");
    if (statusCode === 404) return new CustomError('CouldnotGetRestResponse', 'Company', 3009, "Couldnot get rest response");
    if (body === '' || body === "{}" || body.includes('<!DOCTYPE') || body.includes('<html') || body.includes('<HTML')) return new CustomError('CouldnotGetRestResponse', 'Company', 3009, "Couldnot get rest response");
    if (statusCode === 500) {
      const bodyJson = JSON.parse(body);
      return new CustomError(bodyJson.name, 'Company', bodyJson.code, bodyJson.msg);
    }
    return undefined;

  }

  /**  
   * Gets the get Company by id
   *
   * @param {*} args args
   */

  getExternalCompany$({ args }, authToken) {
    const { organizationId, companyId } = authToken;
    return CompanyDA.getCompany$(companyId, organizationId).pipe(
      tap((company) => {
        if (!company || !company.id) throw new CustomError('CompanyNotFound', 'Company', 3000, "Company not found");

        if (company && !company.active) throw new CustomError('CompanyIsNotActive', 'Company', 3001, "Cmpany is not active");
      }),
      mergeMap(rawResponse => CqrsResponseHelper.buildSuccessResponse$(rawResponse)),
      catchError(err => iif(() => err.name === 'MongoTimeoutError', throwError(err), CqrsResponseHelper.handleError$(err)))
    );
  }

  syncExternalCompany$({ args }, authToken) {
    const companyId = authToken.companyId || args.companyId;
    const organizationId = authToken.organizationId || args.organizationId;
    return CompanyDA.getCompany$(companyId, organizationId).pipe(
      tap(instance.validatecompany),
      map(instance.buildRequest),

      mergeMap(({ url, ops }) => bindCallback(instance.request)(url + "/company", ops)),
      map(({ error, statusCode, body }) => {
        const cumstomizedError = instance.validateRequestErrors(error, statusCode, body);
        if (cumstomizedError) {
          throw cumstomizedError;
        } else {
          return JSON.parse(body);
        }
      }),
      map((company) => ({ ...company, companyId: company.id })),
      mergeMap(rawResponse => CqrsResponseHelper.buildSuccessResponse$(rawResponse)),
      catchError(err => iif(() => err.name === 'MongoTimeoutError', throwError(err), CqrsResponseHelper.handleError$(err)))
    );
  }

  getCompany$({ args }, authToken) {
    const { id, organizationId } = args;
    if (authToken.realm_access.roles.includes("COMPANY_READ") || authToken.realm_access.roles.includes("COMPANY_WRITE")) {
      return CompanyDA.getCompany$(id, organizationId).pipe(
        mergeMap(company => instance.extendPartnersDetailsList$(company)),
        mergeMap(rawResponse => CqrsResponseHelper.buildSuccessResponse$(rawResponse)),
        catchError(err => iif(() => err.name === 'MongoTimeoutError', throwError(err), CqrsResponseHelper.handleError$(err)))
      );
    } else {
      return CompanyDA.getCompany$(authToken.companyId, authToken.organizationId).pipe(
        mergeMap(company => instance.extendPartnersDetailsList$(company)),
        mergeMap(rawResponse => CqrsResponseHelper.buildSuccessResponse$(rawResponse)),
        catchError(err => iif(() => err.name === 'MongoTimeoutError', throwError(err), CqrsResponseHelper.handleError$(err)))
      );
    }
  }

  extendPartnersDetailsList$(company) {


    if (!company.partners) return of(company);
    const { partners } = company;



    return CompanyDA.getAlliesSelectingListing$(partners).pipe(
      toArray(),
      map(companyObjList => ({ ...company, partnersDetails: [...companyObjList] })),
    );
  }



  getOrganizationMngAlliesListing$({ args }, authToken) {
    const { alliesSearch, organizationId, companyId } = args;

    return CompanyDA.getAlliesList$(alliesSearch, organizationId, companyId).pipe(
      toArray(),
      mergeMap(rawResponse => CqrsResponseHelper.buildSuccessResponse$({ listing: rawResponse })),
      catchError(err => iif(() => err.name === 'MongoTimeoutError', throwError(err), CqrsResponseHelper.handleError$(err)))
    );
  }

  /**  
   * Gets the Contract list
   *
   * @param {*} args args
   */
  getUserMngCompanyListing$({ args }, authToken) {
    const { filterInput, paginationInput, sortInput } = args;
    const { queryTotalResultCount = false } = paginationInput || {};    
    const { allowedCompanyIds, isAdmin } = CompanyCRUD.extractCompanyIdsFromToken(authToken);
    
    if(!isAdmin)
      filterInput.companyIds = allowedCompanyIds ?? [];
  
    return forkJoin([
      CompanyDA.getCompanyList$(filterInput, paginationInput, sortInput).pipe(toArray()),
      queryTotalResultCount ? CompanyDA.getCompanySize$(filterInput) : of(undefined),
    ]).pipe(
      map(([listing, queryTotalResultCount]) => ({ listing, queryTotalResultCount })),
      concatMap(rawResponse => CqrsResponseHelper.buildSuccessResponse$(rawResponse)),
      catchError(err => iif(() => err.name === 'MongoTimeoutError', throwError(err), CqrsResponseHelper.handleError$(err)))
    );
  }

  /**
  * Create a Company
  */
  createCompany$({ root, args, jwt }, authToken) {
    const aggregateId = uuidv4();
    const organizationId = authToken.organizationId || args.input.organizationId;
    const input = {
      active: false,
      useGeocodeTranslation: false,
      ...args.input,
    };

    return CompanyDA.getCompanyByNameOrDocument$(input.name, input.document, organizationId).pipe(
      toArray(),
      tap(res => {
        const dupCompany = (res[0] || {});
        if (dupCompany && dupCompany._id) {
          if (dupCompany.document === input.document && dupCompany.organizationId === organizationId) {
            throw new CustomError('CompanyDocumentDuplicated', 'Company', 3011, "Company document already exists");
          }
          else if (dupCompany.name === input.name && dupCompany.organizationId === organizationId) {
            throw new CustomError('CompanyNameDuplicated', 'Company', 3012, "Company name already exists");
          }
        }
      }),
      mergeMap(() => PaymentMediumCodeDA.incrementAndGet$()),
      mergeMap(res => CompanyDA.createCompany$(aggregateId, { ...input, paymentMediumCode: res.seq }, authToken.preferred_username)),
      mergeMap(company => instance.extendPartnersDetailsList$(company)),
      //evaluo al momento de la creacion que el atributo partners sea diferente de cero
      mergeMap(company =>
        iif(
          () => company?.partners?.length > 0,
          CompanyDA.agregateNewPropertieForAlliesCompanies$(company),
          of(company)
        ),
      ),
      mergeMap(aggregate => forkJoin([
        CqrsResponseHelper.buildSuccessResponse$(aggregate),
        eventSourcing.emitEvent$(instance.buildAggregateMofifiedEvent('CREATE', 'Company', aggregateId, authToken, aggregate), { autoAcknowledgeKey: process.env.MICROBACKEND_KEY }),
        broker.send$(MATERIALIZED_VIEW_TOPIC, `OrganizationMngCompanyModified`, aggregate)
      ])),
      map(([sucessResponse]) => sucessResponse),
      catchError(err => iif(() => err.name === 'MongoTimeoutError', throwError(err), CqrsResponseHelper.handleError$(err)))
    );
  }

  /**
   * updates an Company 
   */
  updateCompany$({ root, args, jwt }, authToken) {
    const { id, input, merge } = args;
    const organizationId = authToken.organizationId || args.input.organizationId;

    const idsToEliminate = input.agregatePartnersToDelete

    return CompanyDA.getCompanyByNameOrDocument$(input.name, input.document, organizationId).pipe(
      toArray(),
      tap(res => {
        const dupCompany = (res || []).find(comp => comp._id !== id);
        if (dupCompany && dupCompany._id) {
          if (dupCompany.document === input.document && dupCompany.organizationId === organizationId) {
            throw new CustomError('CompanyDocumentDuplicated', 'Company', 3011, "Company document already exists");
          }
          else if (dupCompany.name === input.name && dupCompany.organizationId === organizationId) {
            throw new CustomError('CompanyNameDuplicated', 'Company', 3012, "Company name already exists");
          }
        }
      }),

      mergeMap(() => {
        return (merge ? CompanyDA.updateCompany$ : CompanyDA.replaceCompany$)(id, input, authToken.preferred_username);
      }),
      mergeMap(company => instance.extendPartnersDetailsList$(company)),




      mergeMap(company => {
        if (company?.partners?.length > 0) {
          return CompanyDA.agregateNewPropertieForAlliesCompanies$(company);
        } else {
          return of(company);
        }
      }),



      mergeMap(company => {

        if (idsToEliminate.length > 0) {
          return CompanyDA.deleteNewPropertieForAlliesCompanies$(company, idsToEliminate)
        } else {
          return of(company)
        }
      }),







      mergeMap(aggregate => forkJoin(
        CqrsResponseHelper.buildSuccessResponse$(aggregate),
        eventSourcing.emitEvent$(instance.buildAggregateMofifiedEvent(merge ? 'UPDATE_MERGE' : 'UPDATE_REPLACE', 'Company', id, authToken, { ...aggregate, agregatePartnersToDelete: idsToEliminate }), { autoAcknowledgeKey: process.env.MICROBACKEND_KEY }),
        broker.send$(MATERIALIZED_VIEW_TOPIC, `OrganizationMngCompanyModified`, aggregate)
      )),
      map(([sucessResponse]) => sucessResponse),
      catchError(err => iif(() => err.name === 'MongoTimeoutError', throwError(err), CqrsResponseHelper.handleError$(err)))
    );
  }


  /**
   * deletes an Company
   */
  deleteCompanies$({ root, args, jwt }, authToken) {
    const { ids } = args;

    return of({});

    // return forkJoin(
    //   from(ids).pipe(
    //     merge(id => CompanyDA.deleteCompany$(id)),
    //     mergeMap(id => eventSourcing.emitEvent$(instance.buildAggregateMofifiedEvent('DELETE', 'Company', id, authToken, {})), { autoAcknowledgeKey: process.env.MICROBACKEND_KEY }),
    //     toArray()
    //   )
    // ).pipe(
    //   map(([ok, esResps]) => ({ code: ok ? 200 : 400, message: `Company with id:s ${JSON.stringify(ids)} ${ok ? "has been deleted" : "not found for deletion"}` })),
    //   mergeMap((r) => forkJoin(
    //     CqrsResponseHelper.buildSuccessResponse$(r),
    //     broker.send$(MATERIALIZED_VIEW_TOPIC, `OrganizationMngCompanyModified`, { id: 'deleted', name: '', active: false, description: '' })
    //   )),
    //   map(([cqrsResponse, brokerRes]) => cqrsResponse),
    //   catchError(err => iif(() => err.name === 'MongoTimeoutError', throwError(err), CqrsResponseHelper.handleError$(err)))
    // );
  }

  deleteCompanyDocuments$({ root, args, jwt }, authToken) {
    const { companyId, fileUrls } = args;
    return CompanyDA.removeCompanyDocumentsByFileUrl$(companyId, fileUrls)
      .pipe(
        mergeMap(aggregate => forkJoin(
          CqrsResponseHelper.buildSuccessResponse$(aggregate).pipe(
          ),
          eventSourcing.emitEvent$(instance.buildAggregateMofifiedEvent('UPDATE_MERGE', 'Company', companyId, authToken, aggregate), { autoAcknowledgeKey: process.env.MICROBACKEND_KEY }),
          broker.send$(MATERIALIZED_VIEW_TOPIC, `OrganizationMngCompanyModified`, aggregate).pipe(
          )
        )),
        map(([sucessResponse]) => sucessResponse),
        catchError(err => iif(() => err.name === 'MongoTimeoutError', throwError(err), CqrsResponseHelper.handleError$(err)))
      );
  }


  /**
   * deletes an Company
   */
  uploadCompanyDocument$({ root, args, jwt }, authToken) {
    const { companyId, fileUrl, fileName } = args;
    return CompanyDA.appendCompanyDocument$(companyId, fileName, fileUrl, authToken._id, authToken.name, Date.now())
      .pipe(
        mergeMap(aggregate => forkJoin(
          CqrsResponseHelper.buildSuccessResponse$(aggregate).pipe(
          ),
          eventSourcing.emitEvent$(instance.buildAggregateMofifiedEvent('UPDATE_MERGE', 'Company', companyId, authToken, aggregate), { autoAcknowledgeKey: process.env.MICROBACKEND_KEY }),
          broker.send$(MATERIALIZED_VIEW_TOPIC, `OrganizationMngCompanyModified`, aggregate).pipe(
          )
        )),
        map(([sucessResponse]) => sucessResponse),
        catchError(err => iif(() => err.name === 'MongoTimeoutError', throwError(err), CqrsResponseHelper.handleError$(err)))
      );
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
    });
  }
   /**
   * return an array of all company ids
   * @param {*} authToken 
   */
   static extractCompanyIdsFromToken(authToken) {
    const isAdmin = authToken.role_group.includes("/PLATFORM-ADMIN") ||
      authToken.role_group.includes("/ORGANIZATION-ADMIN") ||
      authToken.role_group.includes("/ORGANIZATION-VIEWER") ||
      authToken.role_group.includes("/IT-SUPPORT");
    const allowedCompanyIds = (authToken.companyIds != null && authToken.companyIds.length > 0)
      ? authToken.companyIds // SOLO TIENE DERECHO A LO QUE INIDIQUE EL TOKEN EN authToken.companyids
      : (authToken.companyId != null && authToken.companyId.trim() !== '')
        ? [authToken.companyId] // SOLO TIENE DERECHO A LO QUE INIDIQUE EL TOKEN EN authToken.companyId
        : (isAdmin)
          ? null // NULL TIENE DERECHO A TODO
          : []; // NO TIENE DERECHA A NADA
      return {isAdmin, allowedCompanyIds};
  }
}

/**
 * @returns {CompanyCRUD}
 */
module.exports = () => {
  if (!instance) {
    instance = new CompanyCRUD();
    ConsoleLogger.i(`${instance.constructor.name} Singleton created`);
  }
  return instance;
};
