'use strict'

const { iif, of, defer, throwError, from, forkJoin, EMPTY } = require("rxjs");
const { tap, mergeMap, toArray, catchError, expand, filter } = require('rxjs/operators');
const { ConsoleLogger } = require('@nebulae/backend-node-tools').log;
const eventSourcing = require("../../tools/event-sourcing").eventSourcing;
const PINT = require("../../tools/pint/PINT").singleton();
const Event = require("@nebulae/event-store").Event;

const OrganizationDA = require("./data-access/OrganizationDA");
const PaymentMediumCodeDA = require("./data-access/PaymentMediumCodeDA");
/**
 * Singleton instance
 * @type { OrganizationES }
 */
let instance;

class OrganizationES {

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
            'Organization': {
                "OrganizationModified": { fn: instance.handleOrganizationModified$, instance, processOnlyOnSync: true },
            },
            'CronJob': {
                "PintMasterDataSyncTriggered": { fn: instance.handlePintMasterDataSyncTriggered$, instance },
            }
        }
    };

    /**
     * Using the OrganizationModified events restores the MaterializedView
     * This is just a recovery strategy
     * @param {*} OrganizationModifiedEvent Organization Modified Event
     */
    handleOrganizationModified$({ etv, aid, av, data, user, timestamp }) {
        const aggregateDataMapper = [
            /*etv=0 mapper*/ () => { throw new Error('etv 0 is not an option') },
            /*etv=1 mapper*/ (eventData) => { return { ...eventData, modType: undefined }; }
        ];
        delete aggregateDataMapper.modType;
        const aggregateData = aggregateDataMapper[etv](data);
        return iif(
            () => (data.modType === 'DELETE'),
            OrganizationDA.deleteOrganization$(aid),
            OrganizationDA.updateOrganizationFromRecovery$(aid, aggregateData, av)
        ).pipe(
            tap(() => ConsoleLogger.i(`OrganizationES.handleOrganizationModified: ${data.modType}: aid=${aid}, timestamp=${timestamp}`))
        )
    }

    handlePintMasterDataSyncTriggered$({ etv, aid, av, data, user, timestamp }) {
        const isEnabled = data?.Organization?.enabled || false;
        const count = data?.Organization?.pageSize || 10;
        const inputSettings = data?.pintConfig || {};
        const settings = {
            pintRealmName: inputSettings?.pintRealmName || process.env.PINT_KEYCLOAK_BACKEND_REALM_NAME,
            pintApiUrl: inputSettings?.pintApiUrl || process.env.PINT_API_BASE_URL,
            pintAuthUrl: inputSettings?.pintAuthUrl || process.env.PINT_AUTH_URL,
            pintUser: inputSettings?.pintUser || process.env.PINT_AUTH_USER_NAME,
            pintPsw: inputSettings?.pintPsw || process.env.KEYCLOAK_BACKEND_PASSWORD,
            pintClientId: inputSettings?.pintClientId || process.env.PINT_KEYCLOAK_BACKEND_CLIENT_ID,
        };
        const organizationId = inputSettings?.organizationId
        let page = 0;

        if (!isEnabled) return of({});

        return defer(() => PINT.callRestService$("GET", `/organization/?page=${page}&count=${count}`, 'application/json', null, null, null, organizationId, settings)).pipe(
            expand(organizations => organizations.length > 0
                ? PINT.callRestService$("GET", `/organization/?page=${++page}&count=${count}`, 'application/json', null, null, null, organizationId, settings)
                : EMPTY
            ),
            filter(organizations => organizations != null && organizations.length > 0),
            mergeMap(organizations => {
                const higherPaymentMediumCodeValue = organizations.map(organization => organization.paymentMediumCode).sort((a, b) => b - a)[0]
                const dataToUpdate = organizations.map(organization => {
                    const  {attributes, ...data} = organization;
                    const update = {
                        updateOne: {
                            filter: { _id: organization._id },
                            update: { $set: data, $setOnInsert:attributes },
                            upsert: true
                        }
                    }
                    return update;
                });
                if (dataToUpdate.length > 0) {
                    return OrganizationDA.insertOrganizations$(dataToUpdate).pipe(
                        mergeMap(() => {
                            return forkJoin([
                                from(organizations).pipe(
                                    mergeMap((organization) =>
                                        forkJoin([
                                            eventSourcing.emitEvent$(instance.buildAggregateMofifiedEvent('UPDATE_REPLACE', 'Organization', organization._id, user, organization), { autoAcknowledgeKey: process.env.MICROBACKEND_KEY }),
                                            instance.syncPaymentMediumCode$(higherPaymentMediumCodeValue, "Organization")
                                        ])
                                    )
                                ),
                            ])
                        })
                    );
                } else {
                    return of({});
                }

            }),
            tap(() => { ConsoleLogger.i(`OrganizationES.handlePintMasterDataSyncTriggered: aid=${aid}, timestamp=${timestamp}`) }),
            catchError(err => {
                ConsoleLogger.e(`OrganizationES: Error ========>`, err);
                return throwError(err);
            })
        ).toPromise();
    }

    syncPaymentMediumCode$(pmc, id) {
        return PaymentMediumCodeDA.getPaymentMediumCode$(id).pipe(

            mergeMap(result => {
                const resultPmc = result?.seq || 0;
                if (pmc > resultPmc) {
                    return PaymentMediumCodeDA.syncPaymentMediumCode$(pmc, id);
                } else {
                    return of({})
                }
            })
        )
    }

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
 * @returns {OrganizationES}
 */
module.exports = () => {
    if (!instance) {
        instance = new OrganizationES();
        ConsoleLogger.i(`${instance.constructor.name} Singleton created`);
    }
    return instance;
};