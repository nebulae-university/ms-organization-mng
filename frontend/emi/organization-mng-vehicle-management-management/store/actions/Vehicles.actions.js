import { defer } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';

import graphqlService from '../../../../services/graphqlService';
import { OrganizationMngVehicleListing, OrganizationMngDeleteVehicle } from '../../gql/Vehicle';

export const SET_VEHICLES = '[VEHICLE_MNG] SET VEHICLES';
export const SET_VEHICLES_PAGE = '[VEHICLE_MNG] SET VEHICLES PAGE';
export const SET_VEHICLES_ROWS_PER_PAGE = '[VEHICLE_MNG] SET VEHICLES ROWS PER PAGE';
export const SET_VEHICLES_GET_ERROR = '[VEHICLE_MNG] SET VEHICLES GET ERROR';
export const SET_VEHICLES_ORDER = '[VEHICLE_MNG] SET VEHICLES ORDER';
export const SET_VEHICLES_FILTERS_ORGANIZATION_ID = '[VEHICLE_MNG] SET VEHICLES FILTERS ORGANIZATION_ID';
export const SET_VEHICLES_FILTERS_KEYWORD = '[VEHICLE_MNG] SET VEHICLES FILTERS KEYWORD';
export const SET_VEHICLES_FILTERS_ACTIVE = '[VEHICLE_MNG] SET VEHICLES FILTERS ACTIVE';
export const SET_VEHICLE_FILTERS_COMPANY = '[VEHICLE_MNG] SET VEHICLES FILTERS COMPANY';

/**
 * Common function to generate the arguments for the OrganizationMngVehicleListing query based on the user input
 * @param {Object} queryParams 
 */
function getListingQueryArguments({ filters: { keyword, organizationId, active, company }, order, page, rowsPerPage }) {
    const args = {
        "filterInput": { organizationId },
        "paginationInput": { "page": page, "count": rowsPerPage, "queryTotalResultCount": (page === 0) },
        "sortInput": order.id ? { "field": order.id, "asc": order.direction === "asc" } : undefined
    };
    if (keyword.trim().length > 0) {
        args.filterInput.keyword = keyword;
    }
    if (active !== null) {
        args.filterInput.active = active;
    }
    if (company) {
        args.filterInput.company = company.id;
    }
    return args;
}

/**
 * Queries the Vehicle Listing based on selected filters, page and order
 * @param {{ filters, order, page, rowsPerPage }} queryParams
 */
export function getVehicles({ filters, order, page, rowsPerPage }) {
    const args = getListingQueryArguments({ filters, order, page, rowsPerPage });
    return (dispatch) =>{ 
        return graphqlService.client.query(OrganizationMngVehicleListing(args))
        .then(result => {
            return dispatch({
                type: SET_VEHICLES,
                payload: result.data.OrganizationMngVehicleListing
            });
        })
        .catch(error => {
            return dispatch({
                type: SET_VEHICLES_GET_ERROR, 
                payload: (error.graphQLErrors[0] || {}).message
            });
        });
    }    
}

/**
 * Executes the mutation to remove the selected rows
 * @param {*} selectedForRemovalIds 
 * @param {*} param1 
 */
export function removeVehicles(selectedForRemovalIds, { filters, order, page, rowsPerPage, organizationId, companyId }) {
    const deleteArgs = { ids: selectedForRemovalIds, organizationId, companyId };
    const listingArgs = getListingQueryArguments({ filters, order, page, rowsPerPage });
    return (dispatch) => defer(() => graphqlService.client.mutate(OrganizationMngDeleteVehicle(deleteArgs))).pipe(
        mergeMap(() => defer(() => graphqlService.client.query(OrganizationMngVehicleListing(listingArgs)))),
        map((result) =>
            dispatch({
                type: SET_VEHICLES,
                payload: result.data.OrganizationMngVehicleListing
            })
        )
    ).toPromise();
}

/**
 * Set the listing page
 * @param {int} page 
 */
export function setVehiclesPage(page) {
    return {
        type: SET_VEHICLES_PAGE,
        page
    }
}

/**
 * Set the number of rows to see per page
 * @param {*} rowsPerPage 
 */
export function setVehiclesRowsPerPage(rowsPerPage) {
    return {
        type: SET_VEHICLES_ROWS_PER_PAGE,
        rowsPerPage
    }
}

/**
 * Set the table-column order
 * @param {*} order 
 */
export function setVehiclesOrder(order) {
    return {
        type: SET_VEHICLES_ORDER,
        order
    }
}

export function setUsersFilterCompany(company) {
    return {
        type: SET_VEHICLE_FILTERS_COMPANY,
        company
    }
}

/**
 * Set the keyword filter
 * @param {string} keyword 
 */
export function setVehiclesFilterKeyword(keyword) {
    return {
        type: SET_VEHICLES_FILTERS_KEYWORD,
        keyword
    }
}

/**
 * Set the filter active flag on/off/both
 * @param {boolean} active 
 */
export function setVehiclesFilterActive(active) {
    return {
        type: SET_VEHICLES_FILTERS_ACTIVE,
        active
    }
}

/**
 * set the organizationId filter
 * @param {string} organizationId 
 */
export function setVehiclesFilterOrganizationId(organizationId) {
    return {
        type: SET_VEHICLES_FILTERS_ORGANIZATION_ID,
        organizationId
    }
}



