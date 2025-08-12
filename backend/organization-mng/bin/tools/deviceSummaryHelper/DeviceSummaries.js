'use strict';

const zlib = require("zlib");
const fs = require("fs");

class DeviceSummaries {

    /**
     * Creates a new empty DeviceSummaries 
     * @param {String} organizationId (optional) The organization ID this summary belongs to
     */
    constructor(organizationId) {
        /**
         * The organization ID this summary belongs to
         */
        this.organizationId = organizationId
        /**
         * Every single param key
         */
        this.paramKeys = []
        /**
         * Every single param value
         */
        this.paramValues = []
        /**
         * DevicesSns included in the parameter cube
         */
        this.inlcludedDevicesSn = [];

        this.deviceParams = [];
    }

    appendDeviceSummary(deviceSummary) {
        const { _id, props = {}, applicationIds, groupId, parameterMapId, timestamp, vehicleId } = deviceSummary;
        const deviceIndex = this.inlcludedDevicesSn.push(_id) - 1;

        if (applicationIds != null && Array.isArray(applicationIds) && applicationIds.length > 0) props.DEV_APPS = applicationIds.join(',');
        if (groupId != null) props.DEV_GROUP = groupId;
        if(parameterMapId != null) props.DEV_PARMAP_ID = parameterMapId;
        if (timestamp != null) props.DEV_PARMAP_TS = timestamp;
        if (vehicleId != null) props.VEH_ID = vehicleId;
        if (_id != null) props._id = _id;

        for (let propKey of Object.keys(props)) {
            let propKeyIndex = this.paramKeys.indexOf(propKey);
            if (propKeyIndex == -1) {
                propKeyIndex = this.paramKeys.push(propKey) - 1;
            }
            let propValueIndex = this.paramValues.indexOf(props[propKey]);
            if (propValueIndex == -1) {
                propValueIndex = this.paramValues.push(props[propKey]) - 1;
            }

            let device = this.deviceParams[deviceIndex] || '';
            this.deviceParams[deviceIndex] = device + `${propKeyIndex}:${propValueIndex},`
        }

        return this;
    }

    getCompressedSummary() {
        const dataStr = JSON.stringify(
            {
                inlcludedDevicesSn: this.inlcludedDevicesSn,
                paramKeys: this.paramKeys,
                paramValues: this.paramValues,
                deviceParams: this.deviceParams
            }
        );
        const dataBuffer = Buffer.from(dataStr);
        const compressedPayload = zlib.deflateSync(dataBuffer, { level: zlib.constants.Z_BEST_COMPRESSION }).toString("base64");

        return {
            organizationId: this.organizationId,
            compressedPayload
        };
    }

    decompressSummary(compressedSummary) {
        this.organizationId = compressedSummary.organizationId;
        const { inlcludedDevicesSn, paramKeys, paramValues, deviceParams } = JSON.parse(
            zlib.inflateSync(
                Buffer.from(compressedSummary.compressedPayload, 'base64')
            )
        );
        this.inlcludedDevicesSn = inlcludedDevicesSn;
        this.paramKeys = paramKeys;
        this.paramValues = paramValues;
        this.deviceParams = deviceParams;
        return this;
    }

    getInlcludedDevicesSns(){
        return this.inlcludedDevicesSn;
    }

    parseDeviceParams(paramValuesAsString){
        return paramValuesAsString
        .split(',')
        .filter(u => u)
        .reduce((acc, keyVal) => {
            const [keyIndex, valIndex] = keyVal.split(':');
            acc[this.paramKeys[keyIndex]] = this.paramValues[valIndex];
            return acc;
        }, {});
    }

    getDeviceSummary(deviceId) {
        const deviceIndex = this.inlcludedDevicesSn.indexOf(deviceId);
        if(deviceIndex === -1) return null;
        return this.parseDeviceParams(this.deviceParams[deviceIndex]);
    }

    getInlcludedVehicleIds(){
        const keyIndex = this.paramKeys.indexOf('VEH_ID');
        if(keyIndex === -1) return [];
        const vehicleIdsMap = this.deviceParams.reduce((acc,params) => {       
            const paramVal = params.split(',').find(paramVal => paramVal.startsWith(keyIndex+':'));
            const vehicleId =  this.paramValues[paramVal.split(':')[1]];
            acc[vehicleId] = true;
            return acc;
        },{});
        return Object.keys(vehicleIdsMap);
    }

    getDeviceSummaryByVehicleId(vehicleId) {
        const keyIndex = this.paramKeys.indexOf('VEH_ID');
        if(keyIndex === -1) return [];
        for(let params of this.deviceParams){
            const parValues = params.split(',');
            for(let parVal of parValues){
                if(parVal.startsWith(keyIndex+':')){
                    const paramVehicleId =  this.paramValues[parVal.split(':')[1]];
                    if(paramVehicleId === vehicleId){
                        return this.parseDeviceParams(params);
                    }
                }
            }
        }
        return null;
    }
}

module.exports = DeviceSummaries;