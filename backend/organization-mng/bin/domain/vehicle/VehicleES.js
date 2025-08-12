'use strict'

const { iif, of, from, merge, forkJoin, bindCallback } = require("rxjs");
const { tap, map, mergeMap, toArray, catchError, concatMap, groupBy } = require('rxjs/operators');
const { CustomError } = require("@nebulae/backend-node-tools").error;

const http = require('http');
const https = require('https');
const eventSourcing = require("../../tools/event-sourcing").eventSourcing;
const Event = require("@nebulae/event-store").Event;

const { ConsoleLogger } = require('@nebulae/backend-node-tools').log;

const VehicleDA = require("./data-access/VehicleDA");
const CompanyDA = require("./data-access/CompanyDA");
const TemporalToDeletDA = require("./data-access/TemporalToDeletDA");
/**
 * Singleton instance
 * @type { VehicleES }
 */
let instance;

class VehicleES {

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
            'Vehicle': {
                "VehicleModified": { fn: instance.handleVehicleModified$, instance, processOnlyOnSync: true },
                'EventSubmitted': { fn: instance.handleVehicleEventMaintance$, instance }
            },
            'CronJob': {
                'loadVehicleToParentPlatformTaskExecuted': { fn: instance.handleVehicleToParentPlatformTaskExecuted$, instance },
                'deleteVehicleFromParentPlatformTaskExecuted': { fn: instance.handleVehicleFromParentPlatformTaskExecuted$, instance },
            },            
        }
    };

    handleVehicleEventMaintance$({ etv, aid, av, data, user, timestamp }) {
        const aggregateDataMapper = [
            /*etv=0 mapper*/ () => { throw new Error('etv 0 is not an option') },
            /*etv=1 mapper*/ (eventData) => { return { ...eventData, modType: undefined }; }
        ];
        const aggregateData = aggregateDataMapper[etv](data);                
        const maintanceEvents = ['VEHICLE_ENTERS_FOR_MAINTENANCE', 'VEHICLE_LEAVES_FROM_MAINTENANCE'];
        if(!maintanceEvents.includes(aggregateData?.type)) return of({});
        // const vehicleInMaintance = aggregateData.type === 'VEHICLE_ENTERS_FOR_MAINTENANCE';
        const isVehicleInMaintance = aggregateData.type === 'VEHICLE_ENTERS_FOR_MAINTENANCE';
        const vehicleInMaintance = {
            "vehicleInMaintance.isVehicleInMaintance": isVehicleInMaintance,
        }
        
        if(!isVehicleInMaintance) {
            vehicleInMaintance["vehicleInMaintance.finishingTimestamp"] = aggregateData?.finishingTimestamp
        }else {
            vehicleInMaintance["vehicleInMaintance.startingTimestamp"] = aggregateData?.startingTimestamp
        }

        return VehicleDA.updateVehicleInMaintance$(
            aggregateData?.vehicleId,
            aggregateData?.organizationId,
            aggregateData?.companyId,
            vehicleInMaintance
        ).pipe(
            mergeMap(aggregate => 
                eventSourcing.emitEvent$(
                    instance.buildAggregateMofifiedEvent(
                        'UPDATE_MERGE', 'Vehicle',
                        aggregate._id, aggregate
                    ), 
                    { autoAcknowledgeKey: process.env.MICROBACKEND_KEY }
                )
            ),
            catchError(err => {
                ConsoleLogger.e(`VehicleDA: Error updating vehicle`, err);
                return of({});
            })
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

    /**
     * Using the VehicleModified events restores the MaterializedView
     * This is just a recovery strategy
     * @param {*} VehicleModifiedEvent Vehicle Modified Event
     */
    handleVehicleModified$({ etv, aid, av, data, user, timestamp }) {
        const aggregateDataMapper = [
            /*etv=0 mapper*/ () => { throw new Error('etv 0 is not an option') },
            /*etv=1 mapper*/ (eventData) => { return { ...eventData, modType: undefined }; }
        ];
        delete aggregateDataMapper.modType;
        const aggregateData = aggregateDataMapper[etv](data);
        return iif(
            () => (data.modType === 'DELETE'),
            VehicleDA.deleteVehicle$(aid),
            VehicleDA.updateVehicleFromRecovery$(aid, aggregateData, av)
        ).pipe(
            tap(() => ConsoleLogger.i(`VehicleES.handleVehicleModified: ${data.modType}: aid=${aid}, timestamp=${timestamp}`))
        )
    }

    /**
     * vehicles
     */

    handleVehicleToParentPlatformTaskExecuted$({ user }) {
        const companies = [];

        return VehicleDA.getVehiclePendingToReportToParent$().pipe(
            groupBy(vehicle => vehicle.companyId),
            mergeMap(vehicleListByCompany => from(vehicleListByCompany).pipe(
                mergeMap((vehicle) => {
                    const filterCompany = companies.findIndex(company => (company.id || company._id) === vehicle.companyId);
                    if (filterCompany != -1) {
                        return of({ vehicle, company: companies[filterCompany] });
                    } else {
                        return CompanyDA.getCompany$(vehicle.companyId, vehicle.organizationId).pipe(
                            tap(instance.validateCompany),
                            tap((company) => {
                                const filterCompany = companies.findIndex(companie => (companie.id || companie._id) === (company.id || company._id));
                                if (filterCompany === -1) {
                                    companies.push(company)
                                }
                            }),
                            map((company) => ({ vehicle, company }))
                        );
                    }
                }),
                map(({ vehicle, company }) => {
                    delete vehicle.pendingToReportToParent;
                    const vehicleEdit = JSON.stringify({ ...vehicle, companyId: company.primaryLink.companyId, organizationId: company.primaryLink.organizationId, metadata: undefined });

                    const options = {
                        url: company.primaryLink.url,
                        ops: {
                            auth: `${company.primaryLink.username}:${company.primaryLink.password}`,
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'Content-Length': vehicleEdit.length
                            }
                        }
                    }
                    return { vehicleEdit, options, vehicleId: vehicle.id }
                }),
                mergeMap(({ vehicleEdit, options, vehicleId }) => bindCallback(instance.request)(options.url + "/vehicle", options.ops, vehicleEdit).pipe(
                    map(({ error, statusCode, body }) => {
                        const cumstomizedError = instance.validateRequestErrors(error, statusCode, body, vehicleId);
                        if (cumstomizedError) {
                            throw cumstomizedError;
                        } else {
                            return JSON.parse(body);
                        }
                    }),
                )),
                mergeMap((vehicle) => VehicleDA.setPendingToReportToParentFlagOnVehicle$(vehicle.id, vehicle, user, vehicle.organizationId, vehicle.companyId, false)),
                toArray(),
                catchError(err => {
                    if (err.name === 'MongoTimeoutError') {
                        throwError(err)
                    } else {
                        ConsoleLogger.e(`${err.code ? err.code : err} - ${err.code && err.name ? err.name : ''}`);
                        return of(err);
                    }
                }),
            ))
        )
    };

    handleVehicleFromParentPlatformTaskExecuted$() {
        const companies = [];

        return TemporalToDeletDA.getTemporalToDelet$().pipe(
            groupBy(vehicle => vehicle.companyId),
            mergeMap(vehicleListByCompany => from(vehicleListByCompany).pipe(
                tap((vehicle) => {
                    if (!vehicle.ids || vehicle.ids.length <= 0) throw new CustomError('VehiclesInvalid', 'Vehicles', 7000, "Vehicles invalid")
                }),
                mergeMap((vehicle) => {
                    const filterCompany = companies.findIndex(company => (company.id || company._id) === vehicle.companyId);
                    if (filterCompany != -1) {
                        return of({ vehicle, company: companies[filterCompany] });
                    } else {
                        return CompanyDA.getCompany$(vehicle.companyId, vehicle.organizationId).pipe(
                            tap(instance.validateCompany),
                            tap((company) => {
                                const filterCompany = companies.findIndex(companies => (companies.id || companies._id) === (company.id || company._id));
                                if (filterCompany === -1) {
                                    companies.push(company)
                                }
                            }),
                            map((company) => ({ vehicle, company }))
                        );
                    }
                }),
                map(({ vehicle, company }) => {
                    const vehiclesIds = JSON.stringify([...vehicle.ids]);
                    const options = {
                        url: company.primaryLink.url,
                        ops: {
                            auth: `${company.primaryLink.username}:${company.primaryLink.password}`,
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                                'Content-Length': vehiclesIds.length
                            }
                        }
                    }
                    return { vehiclesIds, options, temporalToDeleteId: vehicle._id }
                }),
                mergeMap(({ vehiclesIds, options, temporalToDeleteId }) => bindCallback(instance.request)(options.url + "/del_vehicle", options.ops, vehiclesIds).pipe(
                    map(({ error, statusCode, body }) => {
                        const cumstomizedError = instance.validateRequestErrors(error, statusCode, body, temporalToDeleteId);
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
                        ConsoleLogger.e(`${err.code ? err.code : err} - ${err.code && err.name ? err.name : ''}`);
                        return of(err);
                    }
                }),
            )),
        );
    };

    validateCompany(company) {
        if (!company || !company._id) throw new CustomError('CompanyNotFound', 'Company', 7000, `Company with id ${(company || {})._id} not found`);
        //if (!company.active) throw new CustomError('CompanyIsNotActive', 'Company', 7001, "Company is not active");
        if (!company.primaryLink) throw new CustomError('CompanyDoesNotHavePrimaryLink', 'Company', 7002, `Company with id ${(company || {})._id} does not have primaryLink`);
        if (!company.primaryLink.username) throw new CustomError('CompanyDoesNotHaveUsername', 'Company', 7003, `Company with id ${(company || {})._id} does not have username`);
        if (!company.primaryLink.password) throw new CustomError('CompanyDoesNotHavePassword', 'Company', 7004, `Company with id ${(company || {})._id} does not have password`);
        if (!company.primaryLink.organizationId) throw new CustomError('CompanyDoesNotHaveOrganizationId', 'Company', 7005, `Company with id ${(company || {})._id} does not have organizationId`);
        if (!company.primaryLink.companyId) throw new CustomError('CompanyDoesNotHaveCompanyId', 'Company', 7006, `Company with id ${(company || {})._id} does not have companyId`);
    };

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
    };

    validateRequestErrors(error, statusCode, body, id) {
        if (!statusCode) {
            if (error && error.code) {
                if (error.code === "EAI_AGAIN") return new CustomError('NetworkError', 'Vehicle', 7007, "Id: " + id);
                if (error.code === "ENOTFOUND") return new CustomError('CouldNotGetUrl', 'Vehicle', 7008, "Id: " + id);
            }
        }
        if (statusCode === 401) return new CustomError('InvalidCredentials', 'Vehicle', 7009, "Id: " + id);
        if (statusCode === 404) return new CustomError('CouldNotGetRestResponse', 'Vehicle', 7010, "Id: " + id);
        if (statusCode === 400) return new CustomError('InvalidJsonVehicleInBody', 'Vehicle', 7011, "Id: " + id);
        if (statusCode === 500) return new CustomError('InvalidJsonVehicleInBody', 'Vehicle', 7011, "Id: " + id);
        if (body === '' || body === "[]" || body === "{}") return new CustomError('CouldNotGetRestResponse', 'Company', 7012, "Id: " + id);
        return undefined;
    };
}




/**
 * @returns {VehicleES}
 */
module.exports = () => {
    if (!instance) {
        instance = new VehicleES();
        ConsoleLogger.i(`${instance.constructor.name} Singleton created`);
    }
    return instance;
};