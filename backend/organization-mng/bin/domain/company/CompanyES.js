'use strict'

const { iif, of, defer, throwError, from, forkJoin, EMPTY } = require("rxjs");
const { tap, mergeMap, toArray, catchError, expand, filter } = require('rxjs/operators');
const { ConsoleLogger } = require('@nebulae/backend-node-tools').log;
const eventSourcing = require("../../tools/event-sourcing").eventSourcing;
const PINT = require("../../tools/pint/PINT").singleton();
const Event = require("@nebulae/event-store").Event;
const OrganizationDA = require("./data-access/OrganizationDA");
const CompanyDA = require("./data-access/CompanyDA");
const PaymentMediumCodeDA = require("./data-access/PaymentMediumCodeDA");
/**
 * Singleton instance
 * @type { CompanyES }
 */
let instance;

class CompanyES {

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
            'Company': {
                "CompanyModified": { fn: instance.handleCompanyModified$, instance, processOnlyOnSync: true },
            },
            'CronJob': {
                "PintMasterDataSyncTriggered": { fn: instance.handlePintMasterDataSyncTriggered$, instance },
            }
        }
    };

    /**
     * Using the CompanyModified events restores the MaterializedView
     * This is just a recovery strategy
     * @param {*} CompanyModifiedEvent Company Modified Event
     */
    handleCompanyModified$({ etv, aid, av, data, user, timestamp }) {
        const aggregateDataMapper = [
            /*etv=0 mapper*/ () => { throw new Error('etv 0 is not an option') },
            /*etv=1 mapper*/ (eventData) => { return { ...eventData, modType: undefined }; }
        ];
        delete aggregateDataMapper.modType;
        const aggregateData = aggregateDataMapper[etv](data);
        return iif(
            () => (data.modType === 'DELETE'),
            CompanyDA.deleteCompany$(aid),
            CompanyDA.updateCompanyFromRecovery$(aid, aggregateData, av)
        ).pipe(
            tap(() => ConsoleLogger.i(`CompanyES.handleCompanyModified: ${data.modType}: aid=${aid}, timestamp=${timestamp}`))
        )
    }

    handlePintMasterDataSyncTriggered$({ etv, aid, av, data, user, timestamp }) {
        const isEnabled = data?.Company?.enabled || false;
        const count =  data?.Company?.pageSize || 10;
        let page = 0;

        if (!isEnabled) return of({});

        return OrganizationDA.getOrganizationToSync$().pipe(
            mergeMap((organization)=>defer(() => PINT.callRestService$("GET", `/company/?page=${page}&count=${count}`, 'application/json', null, null, null, organization._id, organization.attributes.PINT_CONFIGURATIONS)).pipe(
                tap((companies)=>{ConsoleLogger.i(`CompanyES.handlePintMasterDataSyncTriggered: ${companies.length}`)}),
                expand(companies => companies.length > 0
                    ? PINT.callRestService$("GET", `/company/?page=${++page}&count=${count}`, 'application/json', null, null, null, organization._id, organization.attributes.PINT_CONFIGURATIONS)
                    : EMPTY
                ),
                filter(companies => companies != null && companies.length > 0),
                mergeMap(companies => {
                    const higherPaymentMediumCodeValue = companies.map(company => company.paymentMediumCode).sort((a, b) => b - a)[0]
                    const dataToUpdate = companies.map(company => {
                        const update = {
                            updateOne: {
                                filter: { _id: company._id },
                                update: { $set: company },
                                upsert: true
                            }
                        }
                        return update;
                    });
                    if (dataToUpdate.length > 0) {
                        return CompanyDA.insertCompanies$(dataToUpdate).pipe(
                            mergeMap(() => {
                                return from(companies).pipe(
                                    mergeMap((company) => forkJoin([
                                        eventSourcing.emitEvent$(instance.buildAggregateMofifiedEvent('UPDATE_REPLACE', 'Company', company._id, user, company), { autoAcknowledgeKey: process.env.MICROBACKEND_KEY }),
                                        instance.syncPaymentMediumCode$(higherPaymentMediumCodeValue, "Company")
                                    ]))
                                )
                            })
                        );
                    } else {
                        return of({});
                    }
    
                }),
                
            )),
            toArray(),
            catchError(err => {
                ConsoleLogger.e(`OrganizationDA.insertOrganizations: Error writing bulk data`, err);
                return throwError(err);
            })
        );
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
 * @returns {CompanyES}
 */
module.exports = () => {
    if (!instance) {
        instance = new CompanyES();
        ConsoleLogger.i(`${instance.constructor.name} Singleton created`);
    }
    return instance;
};