"use strict";
const uuidv4 = require("uuid/v4");
const MongoDB = require('../../tools/mongo-db/MongoDB').MongoDB;
const moment = require("moment-timezone");
const { CustomError } = require("@nebulae/backend-node-tools").error;
const _ = require('lodash');
const { of, from } = require("rxjs");
const { mergeMap, map, toArray, filter, reduce, tap } = require('rxjs/operators');
const vehicleMapper = require("./vehicleMapper.json");
const { UserDA, CompanyDA } = require("./data-access");

const dataKeys = {
    "ownership": {
        "Afiliado": "AFFILIATE",
        "Propio": "OWN",
        "Por Acuerdo": "AGREEMENT"
    },
    "fuelType": {
        "Gasolina": "GASOLINE",
        "Gas Natural": "NATURAL_GAS",
        "Hibrido": "HYBRID",
        "Hidrogeno": "HYDROGEN",
        "Electrico": "ELECTRIC",
        "Diesel": "DIESEL"
    },
    "schemaType": {
        "Ninguno": "NONE",
        "Clasico": "CLASSIC",
        "Flor": "FLOWER",
        "Otro": "OTHER"
    },
    "type": {
        "Otro": "OTHER",
        "Bus": "BUS",
        "Buseta": "BUSETA",
        "MicroBus": "MICRO-BUS",
        "Padron": "PADRON",
        "Buseton": "BUSETON",
        "Articulado": "ARTICULADO"
    },
    "colors": {
        "Otro": "OTHER",
        "Aluminio": "ALUMINUM",
        "Beige": "BEIGE",
        "Negro": "BLACK",
        "Azul": "BLUE",
        "Cafe": "BROWN",
        "Bronce": "BRONZE",
        "Claret": "CLARET",
        "Cobre": "COPPER",
        "Crema": "CREAM",
        "Dorado / Oro": "GOLD",
        "Gris": "GRAY",
        "Verde": "GREEN",
        "Marron": "MAROON",
        "Metalico": "METALLIC",
        "Azul Marino": "NAVY",
        "Naranja": "ORANGE",
        "Rosado": "PINK",
        "Purpura": "PURPLE",
        "Rojo": "RED",
        "Rosa": "ROSE",
        "Oxido": "RUST",
        "Plata": "SILVER",
        "Bronceado": "TAN",
        "Turquesa": "TURQUOISE",
        "Blanco": "WHITE",
        "Amarillo": "YELLOW",
        "Vino Tinto": "WINE"
    }
}
class VehicleHelper {
    static validateFile(fileObj) {
        const hasValidFields = Object.keys(fileObj.data).some((key) =>  key === "plate" || key === "companyId");
        if (!hasValidFields) return false;
        return true;
    }
    static buildNewStructure$(fileObj, organizationId) {
        const [headers, ...data] = fileObj["vehicles"] || [];
        const parseInteger = (v) => v ? parseInt(v) : undefined;
        const parseString = (v) => v ? String(v) : undefined;
        const parseBoolean = (v) => v === "SI" ? true : false;
        const parseArray = (v, splitter = ",", internalType) => v != null  ? String(v).split(splitter).map(v => String(v || "").trim()) : [];

        const getDate = (dateStr) => {
            const date = new Date(dateStr);
            return date.getTime();
        };

        const parseToDate = (v) => {
            if (v != null && typeof v === "string") {
                const [day, month, year] = v.split("/");
                const dateResult = new Date(year, month - 1, day).getTime();
                const dateToReturn = !isNaN(dateResult) ? dateResult : getDate(v);
                return dateToReturn;
            } else {
                return Date.now();
            }
        };

        const propertiesToExtend = {
            "humanResources.driverIds": (documentIdList, organizationId) => {
                return documentIdList.length === 0 ? of([]) : UserDA.getUsersByDocumentId$(documentIdList, organizationId).pipe(
                    map((u) => u._id),
                    toArray()
                )
            },
            "humanResources.ownerIds": (documentIdList, organizationId) => {
                return documentIdList.length === 0 ? of([]) : UserDA.getUsersByDocumentId$(documentIdList, organizationId).pipe(
                    map((u) => u._id),
                    toArray()
                )
            },
            "humanResources.managerIds": (documentIdList, organizationId) => {
                return documentIdList.length === 0 ? of([]) : UserDA.getUsersByDocumentId$(documentIdList, organizationId).pipe(
                    map((u) => u._id),
                    toArray()
                )
            },
            "companyId": (companyName, organizationId) => {
                return CompanyDA.getCompanyByName$(companyName, organizationId).pipe(
                    map((c) => c ? c._id : null)
                )
            }

        }
        const newDataFile = data.reduce((acc, curr, index) => {
            let obj = {};
            for (let i = 0; i < headers.length; i++) {
                const element = headers[i];
                const mapper = vehicleMapper[element];


                if (mapper) {
                    let parsedData;
                    switch (mapper.type) {
                        case "String":
                            parsedData = parseString(curr[i])
                            break;
                        case "Int":
                            parsedData = parseInteger(curr[i])
                            break;
                        case "BigInt":
                            parsedData = parseInteger(curr[i])
                            break;
                        case "Date":
                            parsedData = parseToDate(curr[i])
                            break;
                        case "Array":
                            parsedData = parseArray(curr[i], mapper.splitter, mapper.internalType)
                            break;
                        case "Boolean":
                            parsedData = parseBoolean(curr[i])
                            break;
                        default:
                            break;
                    }
                    if (parsedData != null) obj[mapper.name] = parsedData
                }

            }
            acc.push(obj);
            return acc;
        }, []);
        return from(newDataFile).pipe(
            mergeMap((obj) => {
                return from(Object.entries(obj)).pipe(
                    mergeMap(([key, val]) => {
                        const obs$ = propertiesToExtend[key]
                            ? propertiesToExtend[key](val, organizationId)
                            : dataKeys[key]
                                ? of(Array.isArray(val) ? val.map((item) => dataKeys[key][item]) : dataKeys[key][val] || null)
                                : of(val);
                        return obs$.pipe(
                            map((data) => ({ key, data }))
                        )
                    }),

                    reduce((acc, val) => {
                        acc[val.key] = val?.data;
                        return acc;
                    }, {}),
                    map((v) => ({ data: v, action: v._id ? "UPDATE" : "INSERT" })),
                )
            })
        );
    }

}

/**
 * @returns {VehicleCRUD}
 */
module.exports = VehicleHelper;