"use strict";

const { map, toArray, mergeMap, catchError, tap } = require("rxjs/operators");
const { of, defer, from, throwError } = require("rxjs");
const keycloak = require("../../../tools/keycloak/Keycloak").singleton();
const { CustomError } = require("@nebulae/backend-node-tools").error;

class KeyCloakDA {

    /**
     * Gets the roles that the user can assign to another users.
     * @param {*} userRolesRequester Array of roles of the user that perform the request.
     */
    static getRoles$(userRolesRequester) {
        const USER_ROLES_ALLOW_TO_ASSIGN = JSON.parse(
            process.env.USER_ROLES_ALLOW_TO_ASSIGN
        );
        let userRolesAllowed = [];
        if (userRolesRequester && USER_ROLES_ALLOW_TO_ASSIGN) {
            userRolesRequester.forEach(role => {
                const data = USER_ROLES_ALLOW_TO_ASSIGN[role];

                if (data) {
                    userRolesAllowed = userRolesAllowed.concat(data);
                }
            });
        }
        return of(userRolesAllowed.filter((v, i, s) => s.indexOf(v) === i));
    }

    /**
     * Gets roles from Keycloak according to the roles to filter,
     * if no filter is sent then this method will return all of the roles from Keycloak.
     * @param roles to filter
     *
     */
    static getUserGroups$() {
        return from(keycloak.keycloakClient.groups.find(process.env.KEYCLOAK_BACKEND_REALM_NAME).catch(err => { throw err })).pipe(
            mergeMap(roles => from(roles)),
        );
    }

    /**
     * Creates user credential on keycloak
     * @param {*} user 
     * @param {String} username 
     */
    static createUser$(user, username) {
        const userKeycloak = { username };
        return from(keycloak.keycloakClient.users.create(process.env.KEYCLOAK_BACKEND_REALM_NAME, userKeycloak).catch(err => { throw err })).pipe(
            map(authUser => ([authUser, user])),
            // catchError(error => {
            //     return throwError(error)
            // }),
            catchError(({ statusCode, statusMessage, body }) =>
                throwError(new CustomError(statusMessage, 'KeyCloakDA.createUser$', statusCode, body.errorMessage))
            )

        );
    }

    /**
     * Updates the user
     * @param {*} userId Keyclaok user id
     * @param {*} user user date
     */
    static updateUser$(userId, user) {
        const userKeycloak = this.buildUser(userId, user);
        return from(keycloak.keycloakClient.users.update(process.env.KEYCLOAK_BACKEND_REALM_NAME, userKeycloak).catch(err => { throw err })).pipe(
            map(authUser => ([authUser, user])),
            catchError(({ statusCode, statusMessage, body }) => throwError(
                new CustomError(statusMessage, 'KeyCloakDA.updateUser$', statusCode, body.errorMessage)))
        );
    }

    /**
     * Removes an user from Keycloak.
     */
    static deleteUsers$(userKeycloakId, user) {
        return from(keycloak.keycloakClient.users.remove(process.env.KEYCLOAK_BACKEND_REALM_NAME, userKeycloakId).catch(err => { (() => { })(err); throw err; })).pipe(
            map(authUser => ([authUser, user])),
            catchError(({ statusCode, statusMessage, body }) => throwError(
                new CustomError(statusMessage, 'KeyCloakDA.removeUser$', statusCode, body)))
        );
    }

    /**
     * Resets the user password
     * @param {*} userId
     * @param {*} userPassword
     */
    static resetPassword$(userId, userPassword, temporary) {
        return from(keycloak.keycloakClient.users.resetPassword(process.env.KEYCLOAK_BACKEND_REALM_NAME, userId, { temporary, value: userPassword }).catch(err => { throw err })).pipe(
            catchError((error) => throwError(
                error.statusMessage
                    ? new CustomError(`KeycloakError: ${error.body ? error.body.errorMessage : error.statusMessage}`, 'KeyCloakDA.resetPassword$', 1, `statusCode:${error.statusCode}, statusMessage:${error.statusMessage}, errorMessage:${error.body ? error.body.errorMessage : ""}`)
                    : error
            ))
        )
    }


    /**
     * Add a group to an user
     * @param {String} userId
     * @param {String} groupId
     */
    static addGroup$(userId, groupId) {
        return from(keycloak.keycloakClient.users.addGroup(process.env.KEYCLOAK_BACKEND_REALM_NAME, userId, groupId).catch(err => { throw err })).pipe(
            catchError((error) => throwError(
                error.statusMessage
                    ? new CustomError(`KeycloakError: ${error.body ? error.body.errorMessage : error.statusMessage}`, 'KeyCloakDA.addGroup$', 1, `statusCode:${error.statusCode}, statusMessage:${error.statusMessage}, errorMessage:${error.body ? error.body.errorMessage : ""}`)
                    : error
            ))
        )
    }


    /**
     * removes a group from an user
     * @param {String} userId
     * @param {String} groupId
     */
    static removeGroup$(userId, groupId) {
        return from(keycloak.keycloakClient.users.removeGroup(process.env.KEYCLOAK_BACKEND_REALM_NAME, userId, groupId).catch(err => { throw err })).pipe(
            catchError((error) => throwError(
                error.statusMessage
                    ? new CustomError(`KeycloakError: ${error.body ? error.body.errorMessage : error.statusMessage}`, 'KeyCloakDA.removeGroup$', 1, `statusCode:${error.statusCode}, statusMessage:${error.statusMessage}, errorMessage:${error.body ? error.body.errorMessage : ""}`)
                    : error
            ))
        )
    }

    static buildUser(userId, user, username) {
        const kcUser = {
            id: userId,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.emailAddress,
            attributes: this.buildAttributes(user),
            enabled: user.active,
        };
        if (username) {
            kcUser.username = username;
        }
        return kcUser;
    }

    static buildAttributes(user) {

        const attrs = {
            _id: (user.id || user._id),
            organizationId: user.organizationId,
            pictureUrl: user.pictureUrl,
            locale: (user.preferences || {}).locale,
            timezone: (user.preferences || {}).timezone
        }
        if (user.companyId && user.companyIds.length > 0) {
            attrs.companyId = user.companyId
            attrs.companyIds = user.companyIds
        }
        if (user.routeContractIds && user.routeContractIds.length > 0) {
            attrs.routeContractIds = user.routeContractIds;
        }
        

        return attrs;
    }
}
/**
 * @returns {KeyCloakDA}
 */
module.exports = KeyCloakDA;
