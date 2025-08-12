const withFilter = require("graphql-subscriptions").withFilter;
const PubSub = require("graphql-subscriptions").PubSub;
const pubsub = new PubSub();
let broker = require("../../broker/BrokerFactory")();
broker = broker.secondaryBroker ? broker.secondaryBroker : broker;
const RoleValidator = require('../../tools/RoleValidator');
const { sendToBackEndHandler$ } = require('../../tools/GraphqlResponseTools');


const PERMISSION_DENIED_ERROR_CODE = 2;
const CONTEXT_NAME = "organization-mng";

const READ_ROLES = ["VEHICLE_READ"];
const WRITE_ROLES = ["VEHICLE_WRITE"];

module.exports = {

    //// QUERY ///////
    Query: {
        OrganizationMngVehicleListing(root, args, context) {
            return sendToBackEndHandler$(root, args, context, READ_ROLES, 'query', 'Vehicle', 'OrganizationMngVehicleListing',2000,CONTEXT_NAME).toPromise();
        },
        OrganizationMngVehicle(root, args, context) {
            return sendToBackEndHandler$(root, args, context, READ_ROLES, 'query', 'Vehicle', 'OrganizationMngVehicle',2000,CONTEXT_NAME).toPromise();
        }
    },

    //// MUTATIONS ///////
    Mutation: {
        OrganizationMngCreateVehicle(root, args, context) {
            return sendToBackEndHandler$(root, args, context, WRITE_ROLES, 'mutation', 'Vehicle', 'OrganizationMngCreateVehicle',10000,CONTEXT_NAME).toPromise();
        },
        OrganizationMngUpdateVehicle(root, args, context) {
            return sendToBackEndHandler$(root, args, context, [...WRITE_ROLES, "VEHICLE_RES_ADM"], 'mutation', 'Vehicle', 'OrganizationMngUpdateVehicle',10000,CONTEXT_NAME).toPromise();
        },
        OrganizationMngDeleteVehicles(root, args, context) {
            return sendToBackEndHandler$(root, args, context, WRITE_ROLES, 'mutation', 'Vehicle', 'OrganizationMngDeleteVehicles',10000,CONTEXT_NAME).toPromise();
        },
        OrganizationMngImportVehicle(root, args, context) {
            return sendToBackEndHandler$(root, args, context, WRITE_ROLES, 'mutation', 'Vehicle', 'OrganizationMngImportVehicle',10000,CONTEXT_NAME).toPromise();
        },
    },

    //// SUBSCRIPTIONS ///////
    Subscription: {
        OrganizationMngVehicleModified: {
            subscribe: withFilter(
                (payload, variables, context, info) => {
                    //Checks the roles of the user, if the user does not have at least one of the required roles, an error will be thrown
                    RoleValidator.checkAndThrowError(
                        context.authToken.realm_access.roles,
                        READ_ROLES,
                        "OrganizationMng",
                        "OrganizationMngVehicleModified",
                        PERMISSION_DENIED_ERROR_CODE,
                        "Permission denied"
                    );
                    return pubsub.asyncIterator("OrganizationMngVehicleModified");
                },
                (payload, variables, context, info) => {
                    return payload
                        ? (payload.OrganizationMngVehicleModified.id === variables.id) || (variables.id === "ANY")
                        : false;
                }
            )
        }
    }
};


//// SUBSCRIPTIONS SOURCES ////

const eventDescriptors = [
    {
        backendEventName: "OrganizationMngVehicleModified",
        gqlSubscriptionName: "OrganizationMngVehicleModified",
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
