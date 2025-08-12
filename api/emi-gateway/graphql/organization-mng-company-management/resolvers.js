const withFilter = require("graphql-subscriptions").withFilter;
const PubSub = require("graphql-subscriptions").PubSub;
const pubsub = new PubSub();
const { of, defer, Subject, from, timer } = require("rxjs");
const { tap, map, mergeMap, catchError, mapTo, delay, concatMap, toArray } = require('rxjs/operators');
let broker = require("../../broker/BrokerFactory")();
broker = broker.secondaryBroker ? broker.secondaryBroker : broker;
const RoleValidator = require('../../tools/RoleValidator');
const { sendToBackEndHandler$ } = require('../../tools/GraphqlResponseTools');
const uuidv4 = require('uuid/v4');
const { Storage } = require('@google-cloud/storage');
const INTERNAL_SERVER_ERROR_CODE = 1;
const PERMISSION_DENIED_ERROR_CODE = 2;
const CONTEXT_NAME = "organization-mng";

const READ_ROLES = ["COMPANY_READ", "GEOFENCE_READ", "USER_READ", "VEHICLE_READ"];
const bucketName = process.env.COMPANY_DOCUMENTS_BUCKET_NAME;
const WRITE_ROLES = ["COMPANY_WRITE"];
// Creates a client
const storage = new Storage();

const requesDownloads = new Subject({});
requesDownloads.pipe(
    mergeMap(request => {
        if (!request.partialBase64Data) {
            return of(undefined);
        }
        return from(request.partialBase64Data).pipe(
            concatMap(partial => {
                return timer(100).pipe(
                    tap(() => {
                        pubsub.publish("OrganizationMngCompanyPartialFileDownloaded",
                            {
                                OrganizationMngCompanyPartialFileDownloaded: {
                                    requestId: request.requestId,
                                    downloadKey: partial.downloadKey,
                                    partialEncode: partial.partialEncode,
                                    totalSections: partial.totalSections,
                                    currentSection: partial.currentSection
                                }
                            });
                    })
                );
            }),
        );
    })
).subscribe();


function uploadFile$(organizationId, companyId, file, fileName) {
    return defer(() => file).pipe(
        mergeMap(({ createReadStream, mimetype }) => {
            return defer(() => {
                const stream = createReadStream();
                return new Promise((resolve, reject) => {
                    const filePath = "comp_" + companyId + "/" + uuidv4();
                    stream.pipe(new Storage()
                        .bucket(bucketName)
                        .file(filePath)
                        .createWriteStream({
                            gzip: true,
                            public: false
                        })
                        .on('error', error => {
                            console.log('error =>', error);
                            reject(error);
                        })
                        .on('finish', () => {
                            const fileUrl = 'https://storage.googleapis.com/' + bucketName + '/' + filePath;
                            resolve(fileUrl);
                        })
                    );
                });
            });
        })
    );
}



module.exports = {

    //// QUERY ///////
    Query: {
        OrganizationMngCompanyListing(root, args, context) {
            return sendToBackEndHandler$(root, args, context, READ_ROLES, 'query', 'Company', 'OrganizationMngCompanyListing', 2000, CONTEXT_NAME).toPromise();
        },
        OrganizationMngAlliesListing (root, args, context) { 
            return sendToBackEndHandler$(root, args, context, READ_ROLES, 'query', 'Company', 'OrganizationMngAlliesListing', 2000, CONTEXT_NAME).toPromise();
        },
        UserMngCompanyListing(root, args, context) {
            return sendToBackEndHandler$(root, args, context, READ_ROLES, 'query', 'Company', 'UserMngCompanyListing', 2000, CONTEXT_NAME).toPromise();
        },
        OrganizationMngCompany(root, args, context) {
            return sendToBackEndHandler$(root, args, context, [...READ_ROLES, "COMPANY_INFO_READ"], 'query', 'Company', 'OrganizationMngCompany', 2000, CONTEXT_NAME).toPromise();
        },
        OrganizationMngParentCompanyVehicleQuota(root, args, context) {
            return sendToBackEndHandler$(root, args, context, WRITE_ROLES, 'query', 'Company', 'OrganizationMngParentCompanyVehicleQuota', 2000, CONTEXT_NAME).toPromise();
        },
        OrganizationMngExternalCompany(root, args, context) {
            return sendToBackEndHandler$(root, args, context, WRITE_ROLES, 'query', 'Company', 'OrganizationMngExternalCompany', 2000, CONTEXT_NAME).toPromise();
        },
        OrganizationMngRequestDownloadCompanyDocument(root, args, context) {
            const filePath = args.fileUrl.replace("https://storage.googleapis.com/nebulae-university-company-documents/", "");
            const validityTS = Date.now() + 10000
            const options = {
                version: 'v2', // defaults to 'v2' if missing.
                action: 'read',
                expires: validityTS, // one hour
            };
            return defer(() => {
                return new Promise((resolve, reject) => {
                    storage.
                        bucket(bucketName)
                        .file(filePath)
                        .getSignedUrl(options)
                        .then(function (data) {
                            resolve({ url: (data || [])[0], validityTS })
                        }).catch(error => {
                            reject(error)
                        })
                });
            }).toPromise();

        },
    },

    //// MUTATIONS ///////
    Mutation: {
        OrganizationMngCreateCompany(root, args, context) {
            return sendToBackEndHandler$(root, args, context, WRITE_ROLES, 'mutation', 'Company', 'OrganizationMngCreateCompany', 2000, CONTEXT_NAME).toPromise();
        },
        OrganizationMngUpdateCompany(root, args, context) {
            return sendToBackEndHandler$(root, args, context, WRITE_ROLES, 'mutation', 'Company', 'OrganizationMngUpdateCompany', 2000, CONTEXT_NAME).toPromise();
        },
        OrganizationMngUpdateAlliesCompany(root, args, context) {
            return sendToBackEndHandler$(root, args, context, WRITE_ROLES, 'mutation', 'Company', 'OrganizationMngUpdateAlliesCompany', 2000, CONTEXT_NAME).toPromise();
        },
        OrganizationMngDeleteCompanies(root, args, context) {
            return sendToBackEndHandler$(root, args, context, WRITE_ROLES, 'mutation', 'Company', 'OrganizationMngDeleteCompanies', 2000, CONTEXT_NAME).toPromise();
        },

        OrganizationMngDeleteCompanyDocumentsByFileUrl(root, args, context) {

            return from(args.fileUrls).pipe(
                mergeMap(fileUrl => {
                    const filePath = fileUrl.replace("https://storage.googleapis.com/nebulae-university-company-documents/", "");
                    return defer(() => {
                        return new Promise((resolve, reject) => {
                            storage.
                                bucket(bucketName)
                                .file(filePath)
                                .delete()
                                .then(function (data) {
                                    resolve('Removed');
                                }).catch(error => reject(error));
                        });
                    });
                }),
                toArray(),
                mergeMap(() => {
                    return sendToBackEndHandler$(root, args, context, WRITE_ROLES, 'mutation', 'Company', 'OrganizationMngDeleteCompanyDocumentsByFileUrl', 2000, CONTEXT_NAME);
                })
            ).toPromise();

        },
        OrganizationMngUploadCompanyDocument(root, args, context) {
            return RoleValidator.checkPermissions$(
                context.authToken.realm_access.roles,
                CONTEXT_NAME,
                "OrganizationMngUploadCompanyDocument",
                PERMISSION_DENIED_ERROR_CODE,
                "Permission denied",
                WRITE_ROLES
            ).pipe(
                mergeMap(() => {
                    return uploadFile$(args.organizationId, args.companyId, args.file, args.fileName);
                }),
                mergeMap(fileUrl => {
                    return sendToBackEndHandler$(root, { ...args, file: undefined, fileUrl }, context, WRITE_ROLES, 'mutation', 'Company', 'OrganizationMngUploadCompanyDocument', 2000, CONTEXT_NAME).toPromise();
                })
            ).toPromise();
        },
    },

    //// SUBSCRIPTIONS ///////
    Subscription: {
        OrganizationMngCompanyModified: {
            subscribe: withFilter(
                (payload, variables, context, info) => {
                    //Checks the roles of the user, if the user does not have at least one of the required roles, an error will be thrown
                    RoleValidator.checkAndThrowError(
                        context.authToken.realm_access.roles,
                        READ_ROLES,
                        "OrganizationMng",
                        "OrganizationMngCompanyModified",
                        PERMISSION_DENIED_ERROR_CODE,
                        "Permission denied"
                    );
                    return pubsub.asyncIterator("OrganizationMngCompanyModified");
                },
                (payload, variables, context, info) => {
                    return payload
                        ? (payload.OrganizationMngCompanyModified.id === variables.id) || (variables.id === "ANY")
                        : false;
                }
            )
        },
        OrganizationMngCompanyPartialFileDownloaded: {
            subscribe: withFilter(
                (payload, variables, context, info) => {
                    return pubsub.asyncIterator("OrganizationMngCompanyPartialFileDownloaded");
                },
                (payload, variables, context, info) => {
                    return payload ?
                        (payload.OrganizationMngCompanyPartialFileDownloaded.requestId === variables.requestId)
                        : false;
                }
            )
        }
    }
};


//// SUBSCRIPTIONS SOURCES ////

const eventDescriptors = [
    {
        backendEventName: "OrganizationMngCompanyModified",
        gqlSubscriptionName: "OrganizationMngCompanyModified",
        dataExtractor: evt => evt.data, // OPTIONAL, only use if needed
        onError: (error, descriptor) =>
            console.log(`Error processing ${descriptor.backendEventName}`), // OPTIONAL, only use if needed
        onEvent: (evt, descriptor) =>
            console.log(`Event of type  ${descriptor.backendEventName} arrived`) // OPTIONAL, only use if needed
    }
];

/**
 * Connects every backend event to the right GQL subscription
 */
eventDescriptors.forEach(descriptor => {
    broker.getMaterializedViewsUpdates$([descriptor.backendEventName]).subscribe(
        evt => {
            if (descriptor.onEvent) {
                descriptor.onEvent(evt, descriptor);
            }
            const payload = {};
            payload[descriptor.gqlSubscriptionName] = descriptor.dataExtractor
                ? descriptor.dataExtractor(evt)
                : evt.data;
            pubsub.publish(descriptor.gqlSubscriptionName, payload);
        },

        error => {
            if (descriptor.onError) {
                descriptor.onError(error, descriptor);
            }
            console.error(`Error listening ${descriptor.gqlSubscriptionName}`, error);
        },

        () => console.log(`${descriptor.gqlSubscriptionName} listener STOPED.`)
    );
});
