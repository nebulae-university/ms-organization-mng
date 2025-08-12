import { defer } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';

import graphqlService from '../../../../services/graphqlService';
import { OrganizationMngOrganizationListing, OrganizationMngDeleteOrganization } from '../../gql/Organization';

export const SET_ORGANIZATIONS = '[ORGANIZATION_MNG] SET ORGANIZATIONS';
export const SET_ORGANIZATIONS_SEARCH_TEXT = '[ORGANIZATION_MNG] SET ORGANIZATIONS SEARCH TEXT';
export const SET_ORGANIZATIONS_PAGE = '[ORGANIZATION_MNG] SET ORGANIZATIONS PAGE';
export const SET_ORGANIZATIONS_ROWS_PER_PAGE = '[ORGANIZATION_MNG] SET ORGANIZATIONS ROWS PER PAGE';
export const SET_ORGANIZATIONS_ORDER = '[ORGANIZATION_MNG] SET ORGANIZATIONS ORDER';
export const SET_ORGANIZATIONS_FILTERS_ACTIVE = '[COMPANY_MNG] SET ORGANIZATIONS FILTERS ACTIVE';

function getListingQueryArguments({ filters: { active }, searchText, order, page, rowsPerPage }) {
    const args = {
        "filterInput": {},
        "paginationInput": { "page": page, "count": rowsPerPage, "queryTotalResultCount": (page === 0) },
        "sortInput": order.id ? { "field": order.id, "asc": order.direction === "asc" } : undefined
    };
    if (searchText.trim().length > 0) {
        args.filterInput.name = searchText;
    }
    if (active !== null) {
        args.filterInput.active = active;
    }
    return args;
}

export function getOrganizations({ filters, searchText, order, page, rowsPerPage }) {
    const args = getListingQueryArguments({ filters, searchText, order, page, rowsPerPage });
    return (dispatch) => graphqlService.client.query(OrganizationMngOrganizationListing(args)).then(result => {
        return dispatch({
            type: SET_ORGANIZATIONS,
            payload: result.data.OrganizationMngOrganizationListing
        });
    })
}

export function setOrganizationsSearchText(keyword) {
    return {
        type: SET_ORGANIZATIONS_SEARCH_TEXT,
        searchText: keyword
    }
}
export function setOrganizationsPage(page) {
    return {
        type: SET_ORGANIZATIONS_PAGE,
        page
    }
}
export function setOrganizationsRowsPerPage(rowsPerPage) {
    return {
        type: SET_ORGANIZATIONS_ROWS_PER_PAGE,
        rowsPerPage
    }
}
export function setOrganizationsOrder(order) {
    return {
        type: SET_ORGANIZATIONS_ORDER,
        order
    }
}
export function setOrganizationFilterActive(active) {
    return {
        type: SET_ORGANIZATIONS_FILTERS_ACTIVE,
        active
    }
}

export function removeOrganizations(selectedForRemovalIds, { searchText, order, page, rowsPerPage }) {
    const deleteArgs = { ids: selectedForRemovalIds };
    const listingArgs = {
        "filterInput": searchText.trim().length > 0 ? { "name": searchText } : undefined,
        "paginationInput": { "page": page, "count": rowsPerPage, "queryTotalResultCount": (page === 0) },
        "sortInput": order.id ? { "field": order.id, "asc": order.direction === "asc" } : undefined
    };
    return (dispatch) => defer(() => graphqlService.client.mutate(OrganizationMngDeleteOrganization(deleteArgs))).pipe(
        mergeMap(() => defer(() => graphqlService.client.query(OrganizationMngOrganizationListing(listingArgs)))),
        map((result) =>
            dispatch({
                type: SET_ORGANIZATIONS,
                payload: result.data.OrganizationMngOrganizationListing
            })
        )
    ).toPromise();
}

