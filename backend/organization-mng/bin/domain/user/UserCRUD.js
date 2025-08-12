"use strict";

const uuidv4 = require("uuid/v4");
const { of, forkJoin, from, iif, throwError } = require("rxjs");
const { mergeMap, catchError, map, toArray, tap, concatMap, filter } = require('rxjs/operators');

const Event = require("@nebulae/event-store").Event;
const { CqrsResponseHelper } = require('@nebulae/backend-node-tools').cqrs;
const { ConsoleLogger } = require('@nebulae/backend-node-tools').log;
const { CustomError, INTERNAL_SERVER_ERROR_CODE, PERMISSION_DENIED } = require("@nebulae/backend-node-tools").error;
const { brokerFactory } = require("@nebulae/backend-node-tools").broker;

const broker = brokerFactory();
const eventSourcing = require("../../tools/event-sourcing").eventSourcing;
const { UserDA, KeyCloakDA, CompanyDA, OrganizationDA } = require("./data-access");

const READ_ROLES = ["USER_READ", "VEHICLE_READ"];
const WRITE_ROLES = ["USER_WRITE"];
const REQUIRED_ATTRIBUTES = [];
const MATERIALIZED_VIEW_TOPIC = "emi-gateway-materialized-view-updates";

/**
 * Singleton instance
 * @type { UserCRUD }
 */
let instance;

class UserCRUD {
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
      'User': {
        "emigateway.graphql.query.OrganizationMngUserListing": { fn: instance.getOrganizationMngUserListing$, instance, jwtValidation: { roles: READ_ROLES, attributes: REQUIRED_ATTRIBUTES } },
        "emigateway.graphql.query.OrganizationMngUser": { fn: instance.getUser$, instance, jwtValidation: { roles: READ_ROLES, attributes: REQUIRED_ATTRIBUTES } },
        "emigateway.graphql.query.OrganizationMngRoleListing": { fn: instance.getRoleListing$, instance, jwtValidation: { roles: READ_ROLES, attributes: REQUIRED_ATTRIBUTES } },
        "emigateway.graphql.mutation.OrganizationMngCreateUser": { fn: instance.createUser$, instance, jwtValidation: { roles: WRITE_ROLES, attributes: REQUIRED_ATTRIBUTES } },
        "emigateway.graphql.mutation.OrganizationMngUpdateUser": { fn: instance.updateUser$, jwtValidation: { roles: WRITE_ROLES, attributes: REQUIRED_ATTRIBUTES } },
        "emigateway.graphql.mutation.OrganizationMngDeleteUsers": { fn: instance.deleteUsers$, jwtValidation: { roles: WRITE_ROLES, attributes: REQUIRED_ATTRIBUTES } },

        "emigateway.graphql.mutation.OrganizationMngCreateUserAuth": { fn: instance.createUserAuth$, jwtValidation: { roles: WRITE_ROLES, attributes: REQUIRED_ATTRIBUTES } },
        "emigateway.graphql.mutation.OrganizationMngDeleteUserAuth": { fn: instance.deleteUserAuth$, jwtValidation: { roles: WRITE_ROLES, attributes: REQUIRED_ATTRIBUTES } },
        "emigateway.graphql.mutation.OrganizationMngUpdateUserAuthPassword": { fn: instance.resetUserPasswordAuth$, jwtValidation: { roles: WRITE_ROLES, attributes: REQUIRED_ATTRIBUTES } },
      }
    }
  };


  /**  
   * Gets the User list
   *
   * @param {*} args args
   */
  getOrganizationMngUserListing$({ args }, authToken) {
    const { filterInput, paginationInput, sortInput } = args;
    const { queryTotalResultCount = false } = paginationInput || {};
    const isPointOfSaleManager = authToken.role_group.includes("/POINT-OF-SALE-MANAGER");
    if (authToken.organizationId) {
      filterInput.organizationId = authToken.organizationId
    }
    if (isPointOfSaleManager) {
      filterInput.isPointOfSaleManager = authToken.preferred_username;
    }
    const { isAdmin, allowedCompanyIds } = UserCRUD.extractCompanyIdsFromToken(authToken)
    if (allowedCompanyIds) {
      filterInput.companyId = allowedCompanyIds;
    }
    if (!isAdmin && filterInput.company !== "ALL_COMPANIES" && filterInput.company !== "NO_COMPANY" && filterInput.company != null && !allowedCompanyIds.includes(filterInput.company)) {
      return CqrsResponseHelper.handleError$(new CustomError('PermissionDenied', 'CqrsService.verifyRequest$', PERMISSION_DENIED, 'the user does not have the needed roles to execute this command/query'))
    }
    const ignoreProjection = filterInput.extendedData === true;
    return forkJoin([
      UserDA.getUserList$(filterInput, paginationInput, sortInput, ignoreProjection).pipe(
        mergeMap(user => ignoreProjection
          ? this.extendUserWithCompanyObj$(user)
          : of(user)
        ),
        toArray(),
      ),
      queryTotalResultCount ? UserDA.getUserSize$(filterInput) : of(undefined),
    ]).pipe(
      map(([listing, queryTotalResultCount]) => ({ listing, queryTotalResultCount })),
      mergeMap(rawResponse => CqrsResponseHelper.buildSuccessResponse$(rawResponse)),
      catchError(err => iif(() => err.name === 'MongoTimeoutError', throwError(err), CqrsResponseHelper.handleError$(err)))
    );
  }

  /**  
   * Gets the get User by id
   *
   * @param {*} args args
   */
  getUser$({ args }, authToken) {
    let { id, organizationId } = args;
    let companyId;
    if (authToken.companyId) {
      companyId = authToken.companyId;
    }
    if (authToken.organizationId) {
      organizationId = authToken.organizationId
    }
    const { isAdmin, allowedCompanyIds } = UserCRUD.extractCompanyIdsFromToken(authToken)
    if (!isAdmin && allowedCompanyIds.length === 0) {
      return CqrsResponseHelper.handleError$(new CustomError('PermissionDenied', 'CqrsService.verifyRequest$', PERMISSION_DENIED, 'the user does not have the needed roles to execute this command/query'))
    }
    return UserDA.getUser$(id, organizationId, allowedCompanyIds).pipe(
      // mergeMap(user => instance.extendUserWithCompanyObjAtUsers$(user)),
      mergeMap(rawResponse => CqrsResponseHelper.buildSuccessResponse$(rawResponse)),
      catchError(err => iif(() => err.name === 'MongoTimeoutError', throwError(err), CqrsResponseHelper.handleError$(err)))
    );

  }


  /**
  * Create a User
  */
  createUser$({ root, args, jwt }, authToken) {
    const aggregateId = uuidv4();
    const input = {
      active: false,
      ...args.input,
      auth: {},
    };
    if (authToken.organizationId) {
      input.organizationId = authToken.organizationId
    }
    const { isAdmin, allowedCompanyIds } = UserCRUD.extractCompanyIdsFromToken(authToken);

    if (!isAdmin && (input.companyIds || []).some((c) => !allowedCompanyIds.includes(c))) {
      return CqrsResponseHelper.handleError$(new CustomError('PermissionDenied', 'CqrsService.verifyRequest$', PERMISSION_DENIED, 'the user does not have the needed roles to execute this command/query'))
    }
    return UserDA.createUser$(aggregateId, input, authToken.preferred_username).pipe(
      mergeMap(aggregate => forkJoin(
        CqrsResponseHelper.buildSuccessResponse$(aggregate),
        eventSourcing.emitEvent$(instance.buildAggregateMofifiedEvent('CREATE', 'User', aggregateId, authToken, aggregate), { autoAcknowledgeKey: process.env.MICROBACKEND_KEY }),
        broker.send$(MATERIALIZED_VIEW_TOPIC, `OrganizationMngUserModified`, aggregate)
      )),
      map(([sucessResponse]) => sucessResponse),
      catchError(err => {
        if (err.name !== 'MongoTimeoutError') {
          let code
          if (err?.keyPattern?.documentId) {
            code = 11001
          } else {
            code = 11000
          }
          return CqrsResponseHelper.handleError$(new CustomError('InsertionDenied', 'Mongo', code, 'The insertion was denied due to a unique index constraint violation'))
        }
        iif(() => err.name === 'MongoTimeoutError', throwError(err), CqrsResponseHelper.handleError$(err))
      }
      ))
  }

  /**
   * updates an User 
   */
  updateUser$({ root, args, jwt }, authToken) {
    const { id, input, merge } = args;
    let organizationId;
    let companyId;
    let companyIds;
    const isPointOfSaleManager = authToken.role_group.includes("/POINT-OF-SALE-MANAGER");
    if (input.companyIds) {
      companyIds = input.companyIds;
    }

    if (authToken.organizationId) {
      organizationId = authToken.organizationId
    }
    const { isAdmin, allowedCompanyIds } = UserCRUD.extractCompanyIdsFromToken(authToken);
    if (!isAdmin && companyIds!=null && companyIds.some((c) => !allowedCompanyIds.includes(c))) {
      return CqrsResponseHelper.handleError$(new CustomError('PermissionDenied', 'CqrsService.verifyRequest$', PERMISSION_DENIED, 'the user does not have the needed roles to execute this command/query'))
    }

    return (merge ? UserDA.updateUser$ : UserDA.replaceUser$)(id, input, authToken.preferred_username, isPointOfSaleManager, organizationId, companyId).pipe(
      mergeMap(aggregate => {
        if (!aggregate) {
          throw new CustomError(
            'userNotOwner',
            'Organization',
            20010,
            "user Not Owner"
          );
        }
        return of(aggregate);
      }),

      mergeMap(aggregate => forkJoin(
        CqrsResponseHelper.buildSuccessResponse$(aggregate),
        eventSourcing.emitEvent$(instance.buildAggregateMofifiedEvent(merge ? 'UPDATE_MERGE' : 'UPDATE_REPLACE', 'User', id, authToken, aggregate), { autoAcknowledgeKey: process.env.MICROBACKEND_KEY }),
        broker.send$(MATERIALIZED_VIEW_TOPIC, `OrganizationMngUserModified`, aggregate),
        OrganizationDA.getOrganization$(aggregate.organizationId).pipe(
          map(organization => ({ ...aggregate, active: organization.active ? aggregate.active : organization.active })),
          mergeMap((userElem) => instance.syncAuthUser$(userElem))
        ),
      )),
      map(([sucessResponse]) => sucessResponse),
      catchError(err => {
        if (err.name !== 'MongoTimeoutError') {
          let code
          if (err?.keyPattern?.documentId) {
            code = 11001
          } else {
            code = 11000
          }
          return CqrsResponseHelper.handleError$(new CustomError('InsertionDenied', 'Mongo', code, 'The update was denied due to a unique index constraint violation'))
        }
        iif(() => err.name === 'MongoTimeoutError', throwError(err), CqrsResponseHelper.handleError$(err))
      }
      ))
  }

  /**
   * Syncs auth user with db data
   * @param {object} user 
   */
  syncAuthUser$(user) {
    return user.auth.authId !== undefined
      ? forkJoin(
        KeyCloakDA.updateUser$(user.auth.authId, user),
        KeyCloakDA.getUserGroups$().pipe(
          concatMap(group => {
            if (user.roles.includes(group.id)) {
              return KeyCloakDA.addGroup$(user.auth.authId, group.id);
            } else {
              return KeyCloakDA.removeGroup$(user.auth.authId, group.id);
            }
          })
        )
      )
      : of({});
  }


  /**
   * deletes an User
   */
  deleteUsers$({ root, args, jwt }, authToken) {
    const { ids } = args;
    let organizationId;
    let companyId;
    let companyIds;

    if (authToken.companyId) {
      companyId = authToken.companyId;
    }
    if (authToken.organizationId) {
      organizationId = authToken.organizationId
    }
    const { allowedCompanyIds, isAdmin } = UserCRUD.extractCompanyIdsFromToken(authToken)
    if (!isAdmin) {
      companyIds = allowedCompanyIds;
    }

    return from(ids).pipe(
      mergeMap(id => UserDA.getUser$(id, organizationId, companyId)),
      mergeMap(user => forkJoin(
        UserDA.deleteUsers$([user.id], companyIds),
        eventSourcing.emitEvent$(instance.buildAggregateMofifiedEvent('DELETE', 'User', user.id, authToken, {}), { autoAcknowledgeKey: process.env.MICROBACKEND_KEY }),
        (user.auth && user.auth.authId) ? KeyCloakDA.deleteUsers$(user.auth.authId) : of({}),
      )),
      toArray(),
      map(resultArray => resultArray.length === ids.length),
      map(ok => ({ code: ok ? 200 : 400, message: `User with id:s ${JSON.stringify(ids)} ${ok ? "has been deleted" : "not found for deletion"}` })),
      mergeMap((r) => forkJoin(
        CqrsResponseHelper.buildSuccessResponse$(r),
        broker.send$(MATERIALIZED_VIEW_TOPIC, `OrganizationMngUserModified`, { id: 'deleted', name: '', active: false, description: '' })
      )),
      map(([cqrsResponse, brokerRes]) => cqrsResponse),
      catchError(err => iif(() => err.name === 'MongoTimeoutError', throwError(err), CqrsResponseHelper.handleError$(err)))
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



  /*
  ROLES + AUTH
  */

  /**  
   * Gets Roles group list
   */
  getRoleListing$({ root, args, jwt }, authToken) {
    const roleGroupMap = JSON.parse(process.env.ROLEGROUP_VS_ASSOC_ROLEGROUPS_MAP || "{}");
    let roleGroupList = authToken.role_group.reduce((acc, val) => {
      return [...acc, ...(roleGroupMap[val.replace("/", "")] || [])]
    }, []);
    roleGroupList = [...new Set(roleGroupList)];
    return KeyCloakDA.getUserGroups$().pipe(
      filter(group => group.name !== 'PLATFORM-ADMIN'),
      filter(group => group.name !== 'DEVELOPER'),
      filter(group => group.name !== 'END-USER'),
      filter(group => roleGroupList && roleGroupList.length > 0 ? roleGroupList.includes(group.name) : true),
      toArray(),
      mergeMap(rawResponse => CqrsResponseHelper.buildSuccessResponse$(rawResponse)),
      catchError(err => iif(() => err.name === 'MongoTimeoutError', throwError(err), CqrsResponseHelper.handleError$(err)))
    );
  }

  extendUserWithCompanyObj$(user) {

    if (!user.companyId || user.companyId.trim() === '') return of(user);
    const { companyId } = user;
    return CompanyDA.getCompany$(companyId).pipe(
      map(companyObj => {
        return ({ ...user, companyObj })
      })
    );
  }

  extendUserWithCompanyObjAtUsers$(user) {
    if (!user.companyId || user.companyId.trim() === '') return of(user);
    const { companyIds } = user;

    if (!Array.isArray(companyIds) && (companyIds || []).length <= 0) return of(user);

    return CompanyDA.getCompaniesWithAnSpecificProjection$(companyIds, { name: 1, partners: 1, partnerId: 1 }).pipe(
      map(companyObj => {
        const companiesArray = Object.values(companyObj)
        const companiesToshow = companiesArray.map(element => {
          let auxArray = []
          if (!element.partnerId || element.partnerId.length === 0) {
            auxArray.push(element)
          } else {
            let result = element.partnerId.filter(value => !companyIds.includes(value))
            auxArray.push(result)
          }

          return auxArray
        })

        companyObj = { companyObj: [...companiesToshow.flat()] }
        return ({ ...user, ...companyObj })
      })
    );
  }

  /**  
   * Creates a user auth
   */
  createUserAuth$({ root, args: { userId, username }, jwt }, authToken) {
    return UserDA.getUser$(userId).pipe(
      tap(user => { if (!user.id) throw new CustomError(`User not found`) }),
      tap(user => { if (user.auth && user.auth.authId) throw new CustomError(`User already has credentials; authId:${user.auth.authId}`) }),
      mergeMap(user => OrganizationDA.getOrganization$(user.organizationId).pipe(map(organizationData => ({ ...user, active: organizationData.active ? user.active : organizationData.active })))),
      mergeMap(user => KeyCloakDA.createUser$(user, username)),
      tap(([authUser, user]) => { if (!authUser) throw new CustomError(`Error trying to create user on KeyCloak`) }),
      mergeMap(([authUser, user]) => instance.updateUser$({ jwt, args: { id: user.id, merge: true, input: { companyIds: user.companyIds, auth: { authId: authUser.id, username: username } } } }, authToken)),
      //tap(data => console.log(data)),
      tap(({ data, result }) => { if (!data) throw new CustomError("", "", "", result?.error?.msg) }),
      map(() => ({ code: 200, message: `User credential created!` })),
      mergeMap(rawResponse => CqrsResponseHelper.buildSuccessResponse$(rawResponse)),
      catchError(err => iif(() => err.name === 'MongoTimeoutError', throwError(err), CqrsResponseHelper.handleError$(err)))
    )
  }

  /**  
   * Creates a user auth
   */
  deleteUserAuth$({ root, args: { userId }, jwt }, authToken) {
    return UserDA.getUser$(userId).pipe(
      tap(user => { if (!user.id) throw new CustomError(`User not found`) }),
      tap(user => { if (!user.auth || !user.auth.authId) throw new CustomError(`User does not have credentials`) }),
      mergeMap(user => KeyCloakDA.deleteUsers$(user.auth.authId, user)),
      mergeMap(([authUser, user]) => instance.updateUser$({ jwt, args: { id: user.id, merge: true, input: { auth: {} } } }, authToken)),
      tap(({ data, result }) => { if (!data) throw new CustomError(`Could not update user authId/username after deleting credential on keycloak`) }),
      map(() => ({ code: 200, message: `User credential deleted!` })),
      mergeMap(rawResponse => CqrsResponseHelper.buildSuccessResponse$(rawResponse)),
      catchError(err => iif(() => err.name === 'MongoTimeoutError', throwError(err), CqrsResponseHelper.handleError$(err)))
    )
  }

  /**  
   * Creates a user auth
   */
  resetUserPasswordAuth$({ root, args: { userId, password, temporary }, jwt }, authToken) {
    return UserDA.getUser$(userId).pipe(
      tap(user => { if (!user.id) throw new CustomError(`User not found`) }),
      tap(user => { if (!user.auth || !user.auth.authId) throw new CustomError(`User does not have credentials`) }),
      mergeMap(user => KeyCloakDA.resetPassword$(user.auth.authId, password, temporary)),
      map(() => ({ code: 200, message: `User password updated!` })),
      mergeMap(rawResponse => CqrsResponseHelper.buildSuccessResponse$(rawResponse)),
      catchError(err => iif(() => err.name === 'MongoTimeoutError', throwError(err), CqrsResponseHelper.handleError$(err)))
    )
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
 * @returns {UserCRUD}
 */
module.exports = () => {
  if (!instance) {
    instance = new UserCRUD();
    ConsoleLogger.i(`${instance.constructor.name} Singleton created`);
  }
  return instance;
};
