const withFilter = require("graphql-subscriptions").withFilter;
const PubSub = require("graphql-subscriptions").PubSub;
const pubsub = new PubSub();
const { sendToBackEndHandler$ } = require('../../tools/GraphqlResponseTools');
let broker = require("../../broker/BrokerFactory")();
broker = broker.secondaryBroker ? broker.secondaryBroker : broker;
const RoleValidator = require('../../tools/RoleValidator');
const { of, defer } = require("rxjs");
const { tap, map, mergeMap, catchError } = require('rxjs/operators');
const { Storage } = require('@google-cloud/storage');
const storage = new Storage();
const profilePictureBucketName = "nebulae-university-organization-users";

const INTERNAL_SERVER_ERROR_CODE = 1;
const PERMISSION_DENIED_ERROR_CODE = 2;
const CONTEXT_NAME = "organization-mng";

const READ_ROLES = ["USER_READ", "VEHICLE_READ"];
const WRITE_ROLES = ["USER_WRITE"];


function uploadFile$(organizationId, userId, file) {
    return defer(() => file).pipe(
        mergeMap(({ createReadStream, mimetype }) => {
            return defer(() => {
                const stream = createReadStream();
                return new Promise((resolve, reject) => {
                    const filePath = "ORG_" + organizationId + "/profile_pic_" + userId;
                    stream.pipe(new Storage()
                        .bucket(profilePictureBucketName)
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
                            const fileUrl = 'https://storage.googleapis.com/' + profilePictureBucketName + '/' + filePath;
                            resolve(fileUrl);
                        })
                    );
                });
            });
        })
    );
}


function getProfilePicture$(userId, organizationId) {

    const filePath = "ORG_" + organizationId + "/profile_pic_" + userId;
    const fileUrl = 'https://storage.googleapis.com/' + profilePictureBucketName + '/' + filePath;
    const validityTS = Date.now() + 10000
    const options = {
        version: 'v2', // defaults to 'v2' if missing.
        action: 'read',
        expires: validityTS, // one hour
    };
    return defer(() => {
        return new Promise((resolve, reject) => {
            storage.
                bucket(profilePictureBucketName)
                .file(filePath)
                .exists()
                .then(function (data) {
                    resolve(data);
                }).catch(function (error) {
                    reject(error);
                });
        });
    }).pipe(
        tap((data) => {
            if (!data[0]) {
                throw { name: 'FileNotFound', code: 60000, msg: `File not found` };
            }
        }),
        mergeMap(() => defer(() => new Promise((resolve, reject) => {
            storage.
                bucket(profilePictureBucketName)
                .file(filePath)
                .getSignedUrl(options)
                .then(function (data) {
                    resolve((data || [])[0]);
                }).catch(error => {
                    reject(error);
                });
        })
        )),
        catchError(err => of(null))
    );
}
module.exports = {

    //// QUERY ///////
    Query: {
        OrganizationMngUserListing(root, args, context) {
            return sendToBackEndHandler$(root, args, context, READ_ROLES, 'query', 'User', 'OrganizationMngUserListing', 2000, CONTEXT_NAME).toPromise();
        },
        OrganizationMngUser(root, args, context) {
            return sendToBackEndHandler$(root, args, context, READ_ROLES, 'query', 'User', 'OrganizationMngUser', 2000, CONTEXT_NAME).pipe(

                mergeMap((data) => getProfilePicture$(data._id, data.organizationId).pipe(
                    map((profilePicture) => ({ ...data, profilePicture }))
                ))
            ).toPromise();
        },
        OrganizationMngRoleListing(root, args, context) {
            return sendToBackEndHandler$(root, args, context, READ_ROLES, 'query', 'User', 'OrganizationMngRoleListing', 2000, CONTEXT_NAME).toPromise();
        }
    },

    //// MUTATIONS ///////
    Mutation: {
        OrganizationMngCreateUser(root, args, context) {
            return sendToBackEndHandler$(root, args, context, WRITE_ROLES, 'mutation', 'User', 'OrganizationMngCreateUser', 2000, CONTEXT_NAME).toPromise();
        },
        OrganizationMngUpdateUser(root, args, context) {
            return sendToBackEndHandler$(root, args, context, WRITE_ROLES, 'mutation', 'User', 'OrganizationMngUpdateUser', 20000, CONTEXT_NAME).toPromise();
        },
        OrganizationMngUpdatePhoto(root, args, context) {
            return of({}).pipe(
                mergeMap(() => {
                    return uploadFile$(context.authToken.organizationId || args.input.organizationId, args.id, args.photo).pipe(
                        map(() => ({ code:200, message: "OK" }))
                    ).toPromise();
                }),
            ).toPromise();
        },
        OrganizationMngDeleteUsers(root, args, context) {
            return sendToBackEndHandler$(root, args, context, WRITE_ROLES, 'mutation', 'User', 'OrganizationMngDeleteUsers', 2000, CONTEXT_NAME).toPromise();
        },


        OrganizationMngCreateUserAuth(root, args, context) {
            return sendToBackEndHandler$(root, args, context, WRITE_ROLES, 'mutation', 'User', 'OrganizationMngCreateUserAuth', 20000, CONTEXT_NAME).toPromise();
        },
        OrganizationMngDeleteUserAuth(root, args, context) {
            return sendToBackEndHandler$(root, args, context, WRITE_ROLES, 'mutation', 'User', 'OrganizationMngDeleteUserAuth', 10000, CONTEXT_NAME).toPromise();
        },
        OrganizationMngUpdateUserAuthPassword(root, args, context) {
            return sendToBackEndHandler$(root, args, context, WRITE_ROLES, 'mutation', 'User', 'OrganizationMngUpdateUserAuthPassword', 10000, CONTEXT_NAME).toPromise();
        },
    },

    //// SUBSCRIPTIONS ///////
    Subscription: {
        OrganizationMngUserModified: {
            subscribe: withFilter(
                (payload, variables, context, info) => {
                    //Checks the roles of the user, if the user does not have at least one of the required roles, an error will be thrown
                    RoleValidator.checkAndThrowError(
                        context.authToken.realm_access.roles,
                        READ_ROLES,
                        "OrganizationMng",
                        "OrganizationMngUserModified",
                        PERMISSION_DENIED_ERROR_CODE,
                        "Permission denied"
                    );
                    return pubsub.asyncIterator("OrganizationMngUserModified");
                },
                (payload, variables, context, info) => {
                    return payload
                        ? (payload.OrganizationMngUserModified.id === variables.id) || (variables.id === "ANY")
                        : false;
                }
            )
        }
    }
};


//// SUBSCRIPTIONS SOURCES ////

const eventDescriptors = [
    {
        backendEventName: "OrganizationMngUserModified",
        gqlSubscriptionName: "OrganizationMngUserModified",
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
