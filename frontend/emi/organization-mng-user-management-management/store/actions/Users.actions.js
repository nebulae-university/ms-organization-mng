import { defer } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';

import graphqlService from '../../../../services/graphqlService';
import { OrganizationMngUserListing, OrganizationMngDeleteUser } from '../../gql/User';

export const SET_USERS = '[USER_MNG] SET USERS';
export const SET_USERS_PAGE = '[USER_MNG] SET USERS PAGE';
export const SET_USERS_ROWS_PER_PAGE = '[USER_MNG] SET USERS ROWS PER PAGE';
export const SET_USERS_GET_ERROR = '[USER_MNG] SET USERS GET ERROR';
export const SET_USERS_ORDER = '[USER_MNG] SET USERS ORDER';
export const SET_USERS_FILTERS_ORGANIZATION_ID = '[USER_MNG] SET USERS FILTERS ORGANIZATION_ID';
export const SET_USERS_FILTERS_NAME = '[USER_MNG] SET USERS FILTERS NAME';
export const SET_USERS_FILTERS_ACTIVE = '[USER_MNG] SET USERS FILTERS ACTIVE';
export const SET_USERS_FILTERS_COMPANY = '[USER_MNG] SET USERS FILTERS COMPANY';
export const SET_USERS_FILTERS_ROLE = '[USER_MNG] SET USERS FILTERS ROLE';

function getListingQueryArguments({ filters: { name, organizationId, active, company, role }, order, page, rowsPerPage }) {
    
    const args = {
        "filterInput": { organizationId },
        "paginationInput": { "page": page, "count": rowsPerPage, "queryTotalResultCount": (page === 0) },
        "sortInput": order.id ? { "field": order.id, "asc": order.direction === "asc" } : undefined
    };

    if (name.trim().length > 0) {
        args.filterInput.name = name;
    }
    if (active !== null) {
        args.filterInput.active = active;
    }
    if (company) {
        args.filterInput.company = company.id;
    }
    if(role){
        args.filterInput.roleId = role.id;
    }
    return args;
}

export function getUsers({ filters, order, page, rowsPerPage }) {
    const args = getListingQueryArguments({ filters, order, page, rowsPerPage });    
    return (dispatch) => graphqlService.client.query(OrganizationMngUserListing(args))
    .then(result => {
        return dispatch({
            type: SET_USERS,
            payload: result.data.OrganizationMngUserListing
        });
    })
    .catch(error => {
        return dispatch({
            type: SET_USERS_GET_ERROR, 
            payload: (error.graphQLErrors[0] || {}).message
        });
    });
}

export function removeUsers(selectedForRemovalIds, { filters, order, page, rowsPerPage }) {
    const deleteArgs = { ids: selectedForRemovalIds };
    const listingArgs = getListingQueryArguments({ filters, order, page, rowsPerPage });
    return (dispatch) => defer(() => graphqlService.client.mutate(OrganizationMngDeleteUser(deleteArgs))).pipe(
        mergeMap(() => defer(() => graphqlService.client.query(OrganizationMngUserListing(listingArgs)))),
        map((result) =>
            dispatch({
                type: SET_USERS,
                payload: result.data.OrganizationMngUserListing
            })
        )
    ).toPromise();
}

export function setUsersPage(page) {
    return {
        type: SET_USERS_PAGE,
        page
    }
}
export function setUsersRowsPerPage(rowsPerPage) {
    return {
        type: SET_USERS_ROWS_PER_PAGE,
        rowsPerPage
    }
}
export function setUsersOrder(order) {
    return {
        type: SET_USERS_ORDER,
        order
    }
}

export function setUsersFilterName(name) {    
    return {
        type: SET_USERS_FILTERS_NAME,
        name
    }
}
export function setUsersFilterActive(active) {
    return {
        type: SET_USERS_FILTERS_ACTIVE,
        active
    }
}

export function setUsersFilterCompany1(company) {
    return {
        type: SET_USERS_FILTERS_COMPANY,
        company
    }
}

export function setUsersFilterRole(role){
    return {
        type: SET_USERS_FILTERS_ROLE,
        role
    }
}

export function setUsersFilterOrganizationId(organizationId) {    
    return {
        type: SET_USERS_FILTERS_ORGANIZATION_ID,
        organizationId
    }
}



