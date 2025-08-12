"use strict";
const http = require('http');
const https = require('https');
const keycloakSiitp = require("../keycloakSiitp/Keycloak");
const { mergeMap, tap, catchError } = require("rxjs/operators");
const { of, bindCallback, throwError, iif } = require("rxjs");
const { CustomError } = require("@nebulae/backend-node-tools").error;
const { ConsoleLogger } = require('@nebulae/backend-node-tools').log;
const { CqrsResponseHelper } = require('@nebulae/backend-node-tools').cqrs;
let instance = null;

class PINT {

    callRestService$(methodType, path, contentType, requestBody, jwt, expectedStatusCodes = [200], organizationId, settings) {
        return keycloakSiitp.multiton(organizationId, settings).getToken$().pipe(
            mergeMap(keycloakUser => {
                const createRequestOps = {
                    method: methodType,
                    timeout: 10000,
                    headers: {
                        'Authorization': 'Bearer ' + keycloakUser[1].access_token
                    }
                };
                if (contentType) {
                    createRequestOps.headers["Content-Type"] = contentType;
                }
                if (requestBody) {
                    requestBody = JSON.stringify(requestBody);
                }
                return bindCallback(instance.request)((settings.pintApiUrl || process.env.PINT_API_BASE_URL) + path, createRequestOps, requestBody).pipe(
                    mergeMap(({ error, statusCode, body }) => {
                        switch (statusCode) {
                            case 200:
                                return of(JSON.parse(body));
                            case 400:
                                throw new CustomError(
                                    'PintResponseErrorBadGateway',
                                    'PintResponseErrorBadGateway',
                                    10000,
                                    `The server cannot not process the request`
                                );
                            case 401:
                                throw new CustomError(
                                    'PintResponseErrorUnauthorized',
                                    'PintResponseErrorUnauthorized',
                                    10001,
                                    `Authentication information is missing or invalid`
                                );
                            case 403:
                                throw new CustomError(
                                    'PintResponseErrorForbidden',
                                    'PintResponseErrorForbidden',
                                    10002,
                                    `The server cannot not process the request`
                                );
                            case 500:
                                throw new CustomError(
                                    'PintResponseErrorInternalServer',
                                    'PintResponseErrorInternalServer',
                                    10003,
                                    `RESPONSE NOT COMPLY THE JSON SCHEMA ${JSON.parse(body)}`
                                );
                            default:
                                throw new CustomError(
                                    'PintResponseError',
                                    'PintResponseError',
                                    10004,
                                    `Response Error`
                                );
                        }
                    })
                );
            }),
            catchError(err => {
                ConsoleLogger.e(`PINT: Error in API`, err);
                return of(err);
            })
        );
    }

    request(url, ops, data, callBack) {
        const req = (url.startsWith('https') ? https : http).request(url, ops, (res) => {
            const dataFragments = [];
            res.on('data', (data) => {

                dataFragments.push(data);
            });
            res.on('end', () => {
                callBack({ error: undefined, headers: res.headers, statusCode: parseInt((res || {}).statusCode || 0), body: Buffer.concat(dataFragments).toString() })
            });
        });
        req.on('error', (e) => callBack({ error: e, headers: undefined, statusCode: parseInt((e || {}).statusCode || 0), body: undefined }));
        if (data) {
            req.write(data);
        }
        req.end();
    }
}

/**
 * @returns {PINT}
 */
module.exports = {
    singleton() {
        if (!instance) {
            instance = new PINT();
            ConsoleLogger.i(`PINT instance created.`);
        }
        return instance;
    }
};