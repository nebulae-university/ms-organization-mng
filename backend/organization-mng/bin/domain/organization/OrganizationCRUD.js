"use strict";

const uuidv4 = require("uuid/v4");
const { of, forkJoin, from, Subject, iif, throwError, bindCallback } = require("rxjs");
const { mergeMap, catchError, map, toArray, tap, concatMap, delay } = require('rxjs/operators');
const request = require("request");
const Event = require("@nebulae/event-store").Event;
const { CqrsResponseHelper } = require('@nebulae/backend-node-tools').cqrs;
const { ConsoleLogger } = require('@nebulae/backend-node-tools').log;
const { CustomError, INTERNAL_SERVER_ERROR_CODE, PERMISSION_DENIED } = require("@nebulae/backend-node-tools").error;
const { brokerFactory } = require("@nebulae/backend-node-tools").broker;
const https = require("https");
const http = require("http");
const broker = brokerFactory();
const eventSourcing = require("../../tools/event-sourcing").eventSourcing;
const OrganizationDA = require("./data-access/OrganizationDA");
const { UserDA, KeyCloakDA, PaymentMediumCodeDA } = require("./data-access");
const READ_ROLES = ["ORGANIZATION_READ", "ORGANIZATION_INFO_READ"];
const WRITE_ROLES = ["ORGANIZATION_WRITE"];
const REQUIRED_ATTRIBUTES = [];
const MATERIALIZED_VIEW_TOPIC = "emi-gateway-materialized-view-updates";

/**
 * Singleton instance
 * @type { OrganizationCRUD }
 */
let instance;

class OrganizationCRUD {
  constructor() {
    this.updateUserFromOrganizationEmitter$ = new Subject();
    this.startOrganizationUpdateUserEmitter();
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
      'Organization': {
        "externalsytem.graphql.query.OrganizationMngOrganization": { fn: instance.getExternalOrganization$, instance, jwtValidation: { roles: READ_ROLES, attributes: REQUIRED_ATTRIBUTES } },
        "externalsytem.rest.query.OrganizationMngOrganization": { fn: instance.getExternalOrganization$, instance, jwtValidation: { roles: READ_ROLES, attributes: REQUIRED_ATTRIBUTES } },
        "externalsytem.rest.query.OrganizationInteroperableProfileMap": { fn: instance.getOrganizationInteroperableProfileMap$, instance, jwtValidation: { roles: READ_ROLES, attributes: REQUIRED_ATTRIBUTES } },
        "externalsytem.rest.pint.query.OrganizationMngOrganizationListing": { fn: instance.getExternalOrganizationMngOrganizationListing$, instance, jwtValidation: { roles: READ_ROLES, attributes: REQUIRED_ATTRIBUTES } },

        "pisgateway.graphql.query.OrganizationMngOrganization": { fn: instance.getOrganization$, instance, jwtValidation: { roles: READ_ROLES, attributes: REQUIRED_ATTRIBUTES } },
        "pisgateway.graphql.query.OrganizationMngOrganizationWithoutAuthListing": { fn: instance.getOrganizationMngOrganizationWithoutListing$, instance, jwtValidation: { roles: READ_ROLES, attributes: REQUIRED_ATTRIBUTES } },
        "pisgateway.graphql.query.OrganizationMngOrganizationListing": { fn: instance.getOrganizationMngOrganizationListing$, instance, jwtValidation: { roles: READ_ROLES, attributes: REQUIRED_ATTRIBUTES } },

        "emigateway.graphql.query.OrganizationMngOrganizationListing": { fn: instance.getOrganizationMngOrganizationListing$, instance, jwtValidation: { roles: READ_ROLES, attributes: REQUIRED_ATTRIBUTES } },
        "emigateway.graphql.query.OrganizationMngOrganization": { fn: instance.getOrganization$, instance, jwtValidation: { roles: READ_ROLES, attributes: REQUIRED_ATTRIBUTES } },
        "emigateway.graphql.query.OrganizationMngParentOrganization": { fn: instance.getParentOrganization$, instance, jwtValidation: { roles: READ_ROLES, attributes: REQUIRED_ATTRIBUTES } },
        "emigateway.graphql.mutation.OrganizationMngCreateOrganization": { fn: instance.createOrganization$, instance, jwtValidation: { roles: WRITE_ROLES, attributes: REQUIRED_ATTRIBUTES } },
        "emigateway.graphql.mutation.OrganizationMngUpdateOrganization": { fn: instance.updateOrganization$, jwtValidation: { roles: WRITE_ROLES, attributes: REQUIRED_ATTRIBUTES } },
        "emigateway.graphql.mutation.OrganizationMngDeleteOrganizations": { fn: instance.deleteOrganizations$, jwtValidation: { roles: WRITE_ROLES, attributes: REQUIRED_ATTRIBUTES } },

        "pisabtgateway.graphql.query.OrganizationMngOrganization": { fn: instance.getOrganization$, instance, jwtValidation: { roles: READ_ROLES, attributes: REQUIRED_ATTRIBUTES } },
        "pisabtgateway.graphql.query.OrganizationMngOrganizationWithoutAuthListing": { fn: instance.getOrganizationMngOrganizationWithoutListing$, instance, jwtValidation: { roles: READ_ROLES, attributes: REQUIRED_ATTRIBUTES } },
        "pisabtgateway.graphql.query.OrganizationMngOrganizationListing": { fn: instance.getOrganizationMngOrganizationListing$, instance, jwtValidation: { roles: READ_ROLES, attributes: REQUIRED_ATTRIBUTES } },
      }
    };
  }
  getExternalOrganizationMngOrganizationListing$({ args }, authToken) {
    const filterInput = {};
    const { count, page } = args;
    const roleGroups = authToken.role_group;
    if (!(roleGroups || []).includes("/PLATFORM-ADMIN")) {
      filterInput.organizationId = authToken.organizationId;
    }

    return OrganizationDA.getExternalOrganizationList$(filterInput, { page, count }).pipe(
      toArray(),
      mergeMap(rawResponse => CqrsResponseHelper.buildSuccessResponse$(rawResponse)),
      catchError(err => iif(() => err.name === 'MongoTimeoutError', throwError(err), CqrsResponseHelper.handleError$(err)))
    );
  }


  startOrganizationUpdateUserEmitter() {
    ConsoleLogger.i('updateUserFromOrganizationEmitter$ _started');
    this.updateUserFromOrganizationEmitter$
      .pipe(
        mergeMap(({ id, input, organizationData }) => input.active !== organizationData.active
          ? UserDA.getUserList$(id).pipe(
            map(user => ({ ...user, active: input.active ? user.active : input.active })),
            mergeMap(user => this.syncAuthUser$(user).pipe(
              delay(50),
              catchError(err => {
                //ConsoleLogger.e("Error updating user", err)
                return of("Error updating user", err);
              }))),
            toArray())
          : of(null))
      ).subscribe(
        (result) => { },
        (err) => {
          ConsoleLogger.e("Error on updateUserFromOrganizationEmitter", err);
          process.exit(1);
        },
        () => {
          ConsoleLogger.i("updateUserFromOrganizationEmitter completed");
          process.exit(0);
        }
      );
  }

  /**
 * Syncs auth user with db data
 * @param {object} user 
 */
  syncAuthUser$(user) {
    return user.auth.authId !== undefined
      ? KeyCloakDA.updateUser$(user.auth.authId, user)
      : of({});
  }

  getOrganizationMngOrganizationWithoutListing$({ args }, authToken) {
    const { filterInput = {}, paginationInput, sortInput } = args;
    const { queryTotalResultCount = false } = paginationInput || {};
    filterInput.enableOrganizationForSIU = true;
    return forkJoin([
      OrganizationDA.getOrganizationList$(filterInput, paginationInput, sortInput).pipe(toArray()),
      queryTotalResultCount ? OrganizationDA.getOrganizationSize$(filterInput) : of(undefined),
    ]).pipe(
      map(([listing, queryTotalResultCount]) => ({ listing, queryTotalResultCount })),
      mergeMap(rawResponse => CqrsResponseHelper.buildSuccessResponse$(rawResponse)),
      catchError(err => {
        if (err.name === 'MongoTimeoutError') {
          throw new Error(err)
        } else {
          (() => { })("ERROR ===> ", err);
          return CqrsResponseHelper.handleError$(err);
        }
      })
    );
  }
  /**  
   * Gets the Organization list
   *
   * @param {*} args args
   */
  getOrganizationMngOrganizationListing$({ args }, authToken) {
    const { filterInput = {}, paginationInput, sortInput } = args;
    const { queryTotalResultCount = false } = paginationInput || {};

    const roleGroups = authToken.role_group;
    if (!(roleGroups || []).includes("/PLATFORM-ADMIN")) {
      filterInput.organizationId = authToken.organizationId;
    }

    return forkJoin(
      OrganizationDA.getOrganizationList$(filterInput, paginationInput, sortInput).pipe(toArray()),
      queryTotalResultCount ? OrganizationDA.getOrganizationSize$(filterInput) : of(undefined),
    ).pipe(
      map(([listing, queryTotalResultCount]) => ({ listing, queryTotalResultCount })),
      mergeMap(rawResponse => CqrsResponseHelper.buildSuccessResponse$(rawResponse)),
      catchError(err => iif(() => err.name === 'MongoTimeoutError', throwError(err), CqrsResponseHelper.handleError$(err)))
    );
  }

  /**  
   * Gets the get Organization by id
   *
   * @param {*} args args
   */
  getOrganization$({ args }, authToken) {
    const { id } = args;
    const isPlatformAdmin = authToken.role_group.includes("/PLATFORM-ADMIN");

    return OrganizationDA.getOrganization$(id).pipe(
      map(org => (!isPlatformAdmin && authToken.organizationId !== id) ? {} : org),
      mergeMap(rawResponse => CqrsResponseHelper.buildSuccessResponse$(rawResponse)),
      catchError(err => iif(() => err.name === 'MongoTimeoutError', throwError(err), CqrsResponseHelper.handleError$(err)))
    );

  }
  getExternalOrganization$({ args }, authToken) {
    const organizationId = authToken.organizationId;
    return OrganizationDA.getOrganization$(organizationId).pipe(
      tap((organization) => {
        if (!organization || !organization.id) throw new CustomError('OrganizationNotFound', 'Organization', 6000, "Organization not found");
        if (!organization.active) throw new CustomError('OrganizationIsNotActive', 'Organization', 6001, "Organization is not active");
      }),
      mergeMap(rawResponse => CqrsResponseHelper.buildSuccessResponse$(rawResponse)),
      catchError(err => iif(() => err.name === 'MongoTimeoutError', throwError(err), CqrsResponseHelper.handleError$(err)))

    );

  }

  getOrganizationInteroperableProfileMap$({ args }, authToken) {
    const organizationId = authToken.organizationId;
    return OrganizationDA.getOrganization$(organizationId).pipe(
      tap((organization) => {
        if (!organization || !organization.id) throw new CustomError('OrganizationNotFound', 'Organization', 70005, "Organization not found");
        if (!organization.active) throw new CustomError('OrganizationIsNotActive', 'Organization', 70005, "Organization is not active");
        if (!organization.interoperableProfileMap) throw new CustomError('OrganizationWithoutInteroperableProfileMap', 'Organization', 70006, "Organization is without interoperableProfileMap");
      }),
      map((organization) => organization.interoperableProfileMap),
      mergeMap(rawResponse => CqrsResponseHelper.buildSuccessResponse$(rawResponse)),
      catchError(err => iif(() => err.name === 'MongoTimeoutError', throwError(err), CqrsResponseHelper.handleError$(err)))

    );

  }

  getParentOrganization$({ args }, authToken) {
    const organizationId = authToken.organizationId || args.organizationId;
    return OrganizationDA.getOrganization$(organizationId).pipe(
      tap(x => (() => { })(x)),
      tap(instance.validateOrganization),
      map(instance.buildRequest),
      mergeMap(({ url, ops }) => bindCallback(instance.request)(url + "/organization", ops)),
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
  validateOrganization(organization) {
    if (!organization || !organization.id) throw new CustomError('OrganizationNotFound', 'Organization', 6000, "Organization not found");
    if (!organization.active) throw new CustomError('OrganizationIsNotActive', 'Organization', 6001, "Organization is not active");
    if (organization && !organization.primaryLink) throw new CustomError('OrganizationDoesNotHavePrimaryLink', 'Organization', 6002, "Organization doesnot have primaryLink");
    if (!organization.primaryLink.url) throw new CustomError('OrganizationDoesNotHaveUrl', 'Organization', 6003, "Organization doesnot have Url");
    if (!organization.primaryLink.username) throw new CustomError('OrganizationDoesnotHaveUsername', 'Organization', 6004, "Organization doesnot have username");
    if (!organization.primaryLink.password) throw new CustomError('OrganizationDoesnotHavePassword', 'Organization', 6005, "Organization doesnot have password");
  }
  validateRequestErrors(error, statusCode, body) {

    if (!statusCode) {
      if (error && error.code) {
        if (error.code === "EAI_AGAIN") return new CustomError('NetworkError', 'Organization', 6006, "Network Error");
        if (error.code === "ENOTFOUND") return new CustomError('CouldGetUrl', 'Organization', 6007, "Could get url");
        if (error.code === "ECONNREFUSED") return new CustomError('ConnectionRefused', 'Organization', 6010, "Connection refused");
      }
    }
    if (statusCode === 401) return new CustomError('InvalidCredentials', 'Organization', 6008, "Invalid Creadentials");
    if (statusCode === 404) return new CustomError('CouldntGetRestResponse', 'Organization', 6009, "Couldnt get rest response");
    if (body === '' || body === "{}") return new CustomError('CouldntGetRestResponse', 'Organization', 6009, "Couldnt get rest response");
    if (statusCode === 500) {
      const bodyJson = JSON.parse(body);
      return new CustomError(bodyJson.name, 'Organization', bodyJson.code, bodyJson.msg);
    }

    return undefined;

  }
  request(url, statusCode, callBack) {
    const req = https.request(url, statusCode, (res) => res.on('data', (data) => callBack({ error: undefined, headers: res.headers, statusCode: res.statusCode, body: data.toString() })));
    req.on('error', (e) => callBack({ error: e, headers: undefined, statusCode: undefined, body: undefined }));
    req.end();
  }

  /**
  * Create a Organization
  */
  createOrganization$({ root, args, jwt }, authToken) {
    const aggregateId = uuidv4();
    const input = {
      active: false,
      ...args.input,
    };

    return OrganizationDA.getOrganizationByNameOrDocument$(input.name, input.document).pipe(
      toArray(),
      tap(res => {
        const dupOrganization = (res[0] || {});
        if (dupOrganization && dupOrganization._id) {
          if (dupOrganization.document === input.document) {
            throw new CustomError('OrganizationDocumentDuplicated', 'Organization', 6018, "Organization document already exists");
          }
          else if (dupOrganization.name === input.name) {
            throw new CustomError('OrganizationNameDuplicated', 'Organization', 6019, "Organization name already exists");
          }
        }
      }),
      mergeMap(() => PaymentMediumCodeDA.incrementAndGet$()),
      mergeMap(result => OrganizationDA.createOrganization$(aggregateId, { ...input, paymentMediumCode: result.seq }, authToken.preferred_username)),
      mergeMap(aggregate => forkJoin([
        CqrsResponseHelper.buildSuccessResponse$(aggregate),
        eventSourcing.emitEvent$(instance.buildAggregateMofifiedEvent('CREATE', 'Organization', aggregateId, authToken, aggregate), { autoAcknowledgeKey: process.env.MICROBACKEND_KEY }),
        broker.send$(MATERIALIZED_VIEW_TOPIC, `OrganizationMngOrganizationModified`, aggregate)
      ])),
      map(([sucessResponse]) => sucessResponse),
      catchError(err => iif(() => err.name === 'MongoTimeoutError', throwError(err), CqrsResponseHelper.handleError$(err)))
    );
  }

  /**
   * updates an Organization 
   */
  updateOrganization$({ root, args, jwt }, authToken) {
    const { id, input, merge } = args;

    return OrganizationDA.getOrganizationByNameOrDocument$(input.name, input.document).pipe(
      toArray(),
      tap(res => {
        const dupOrganization = (res || []).find(org => org._id !== id);
        if (dupOrganization && dupOrganization._id) {
          if (dupOrganization.document === input.document) {
            throw new CustomError('OrganizationDocumentDuplicated', 'Organization', 6018, "Organization document already exists");
          }
          else if (dupOrganization.name === input.name) {
            throw new CustomError('OrganizationNameDuplicated', 'Organization', 6019, "Organization name already exists");
          }
        }
      }),
      mergeMap(() => OrganizationDA.getOrganization$(id)),
      tap((res) => instance.updateUserFromOrganizationEmitter$.next({ id, input, organizationData: res })),
      mergeMap(() => (merge ? OrganizationDA.updateOrganization$ : OrganizationDA.replaceOrganization$)(id, input, authToken.preferred_username)),
      mergeMap(aggregate => forkJoin(
        CqrsResponseHelper.buildSuccessResponse$(aggregate),
        eventSourcing.emitEvent$(instance.buildAggregateMofifiedEvent(merge ? 'UPDATE_MERGE' : 'UPDATE_REPLACE', 'Organization', id, authToken, aggregate), { autoAcknowledgeKey: process.env.MICROBACKEND_KEY }),
        broker.send$(MATERIALIZED_VIEW_TOPIC, `OrganizationMngOrganizationModified`, aggregate)
      )),
      map(([sucessResponse]) => sucessResponse),
      catchError(err => iif(() => err.name === 'MongoTimeoutError', throwError(err), CqrsResponseHelper.handleError$(err)))
    );
  }


  /**
   * deletes an Organization
   */
  deleteOrganizations$({ root, args, jwt }, authToken) {
    const { ids } = args;
    return forkJoin(
      OrganizationDA.deleteOrganizations$(ids),
      from(ids).pipe(
        mergeMap(id => eventSourcing.emitEvent$(instance.buildAggregateMofifiedEvent('DELETE', 'Organization', id, authToken, {})), { autoAcknowledgeKey: process.env.MICROBACKEND_KEY }),
        toArray()
      )
    ).pipe(
      map(([ok, esResps]) => ({ code: ok ? 200 : 400, message: `Organization with id:s ${JSON.stringify(ids)} ${ok ? "has been deleted" : "not found for deletion"}` })),
      mergeMap((r) => forkJoin(
        CqrsResponseHelper.buildSuccessResponse$(r),
        broker.send$(MATERIALIZED_VIEW_TOPIC, `OrganizationMngOrganizationModified`, { id: 'deleted', name: '', active: false, description: '' })
      )),
      map(([cqrsResponse, brokerRes]) => cqrsResponse),
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
}

/**
 * @returns {OrganizationCRUD}
 */
module.exports = () => {
  if (!instance) {
    instance = new OrganizationCRUD();
    ConsoleLogger.i(`${instance.constructor.name} Singleton created`);
  }
  return instance;
};
