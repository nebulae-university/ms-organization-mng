'use strict'

const { iif, of, forkJoin, concat } = require("rxjs");
const { tap, mergeMap, toArray, catchError, } = require('rxjs/operators');
const { ConsoleLogger } = require('@nebulae/backend-node-tools').log;

const UserDA = require("./data-access/UserDA");
const CompnanyDA = require("./data-access/CompanyDA");
const KeyCloakDA = require("./data-access/KeyCloakDA");
const { auth } = require("@nebulae/backend-node-tools");
const Event = require("@nebulae/event-store").Event;
const eventSourcing = require("../../tools/event-sourcing").eventSourcing;

/**
 * Singleton instance
 * @type { UserES }
 */
let instance;

class UserES {

    constructor() {
    }

    /**     
     * Generates and returns an object that defines the Event-Sourcing events handlers.
     * 
     * The map is a relationship of: AGGREGATE_TYPE VS { EVENT_TYPE VS  { fn: rxjsFunction, instance: invoker_instance } }
     * 
     * ## Example
     *  { "User" : { "UserAdded" : {fn: handleUserAdded$, instance: classInstance } } }
     */
    generateEventProcessorMap() {
        return {
            'User': {
                "UserModified": { fn: instance.handleUserModified$, instance, processOnlyOnSync: true },
            },
            'Company': {
                "CompanyModified": { fn: instance.handleCompanyModified$, instance },
            },
        }
    }

    /**
     * Using the UserModified events restores the MaterializedView
     * This is just a recovery strategy
     * @param {*} UserModifiedEvent User Modified Event
     */
    handleUserModified$({ etv, aid, av, data, user, timestamp }) {
        const aggregateDataMapper = [
            /*etv=0 mapper*/ () => { throw new Error('etv 0 is not an option') },
            /*etv=1 mapper*/ (eventData) => { return { ...eventData, modType: undefined }; }
        ];
        delete aggregateDataMapper.modType;
        const aggregateData = aggregateDataMapper[etv](data);
        return iif(
            () => (data.modType === 'DELETE'),
            UserDA.deleteUser$(aid),
            UserDA.updateUserFromRecovery$(aid, aggregateData, av)
        ).pipe(
            tap(() => ConsoleLogger.i(`UserES.handleUserModified: ${data.modType}: aid=${aid}, timestamp=${timestamp}`))
        )
    }

    handleCompanyModified$({ data }) {
        // Get the deleted companies from partners
        return CompnanyDA.getCompaniesWithAnSpecificProjection$((data.agregatePartnersToDelete || []), { partnerId: 1 }).pipe(
            mergeMap(companies => {            
                const partnerIds = Object.values(companies)

                // Get the users associated with that companies
                return UserDA.getUsersWithAnSpecificProjectionByCompanyId$(data._id, { companyIds: 1 }).pipe(
                    mergeMap(user => {
                        // Check for each company to be deleted if it has an association with another company linked to the user; if so, it should not be removed from the user
                        const companiesWihtoutDependencies = partnerIds.filter(company => {
                            const hasPartnerId = company?.partnerId?.length;
                            
                            if(!hasPartnerId) return true;
                            
                            const hasAnotherDependency = user?.companyIds.some(companyId => company.partnerId.includes(companyId) && company._id !== companyId);

                            return !hasAnotherDependency;
                        }).map(c => c._id);
                        
                        return of({ user, companiesWihtoutDependencies });                        
                    }),
                    mergeMap(({user, companiesWihtoutDependencies}) =>
                        concat(
                            // Update the available companies for the users
                            data?.agregatePartnersToDelete?.length 
                                ? UserDA.updateUserRemovePartner$(user.id, companiesWihtoutDependencies)
                                    .pipe(
                                        mergeMap(userUpdated =>
                                            eventSourcing.emitEvent$(instance.buildAggregateMofifiedEvent('UPDATE_MERGE', 'User', userUpdated.id, userUpdated), { autoAcknowledgeKey: process.env.MICROBACKEND_KEY })
                                        ),
                                        catchError(error => {
                                            ConsoleLogger.e(`Unable to update user: ${user._id} with company: ${data._id}`, error);
                                            return of({ error: true, message: error?.message })
                                        })
                                    ) 
                                : of({}),
                            (user != null && data.partners != null && data.partners.length > 0) 
                                ? UserDA.updateUserAddPartner$(user._id, data.partners)
                                    .pipe(
                                        mergeMap(user => {
                                            if(user?.auth?.authId) {
                                                return KeyCloakDA.updateUser$(user.auth.authId, user)
                                                    .pipe(
                                                        catchError(error => {
                                                            ConsoleLogger.e(`Unable to update user in keycloack: ${user._id} with company: ${data._id}`, error);
                                                            return of({ error: true, message: error?.errorMessagr })
                                                        })
                                                    )
                                            }

                                            return of({});
                                        })
                                    ) 
                                : of({}),
                        ),
                    ),
                    catchError(err => {
                        ConsoleLogger.e('Error updating users linked to the company', err);
                    })
                )
        }))
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
    buildAggregateMofifiedEvent(modType, aggregateType, aggregateId, data) {        
        return new Event({
        eventType: `${aggregateType}Modified`,
        eventTypeVersion: 1,
        aggregateType: aggregateType,
        aggregateId,
        data: {
            modType,
            ...data
        },
        user: 'SYSTEM'
        })
    }
}

/**
 * @returns {UserES}
 */
module.exports = () => {
    if (!instance) {
        instance = new UserES();
        ConsoleLogger.i(`${instance.constructor.name} Singleton created`);
    }
    return instance;
};