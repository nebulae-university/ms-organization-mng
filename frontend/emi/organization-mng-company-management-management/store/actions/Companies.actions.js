import { defer } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';

import graphqlService from '../../../../services/graphqlService';
import { OrganizationMngCompanyListing, OrganizationMngDeleteCompany } from '../../gql/Company';

export const SET_COMPANYS = '[COMPANY_MNG] SET COMPANIES';
export const SET_COMPANYS_PAGE = '[COMPANY_MNG] SET COMPANIES PAGE';
export const SET_COMPANYS_ROWS_PER_PAGE = '[COMPANY_MNG] SET COMPANIES ROWS PER PAGE';
export const SET_COMPANYS_ORDER = '[COMPANY_MNG] SET COMPANIES ORDER';
export const SET_COMPANYS_FILTERS_ORGANIZATION_ID = '[COMPANY_MNG] SET COMPANIES FILTERS ORGANIZATION_ID';
export const SET_COMPANYS_FILTERS_NAME = '[COMPANY_MNG] SET COMPANIES FILTERS NAME';
export const SET_COMPANYS_FILTERS_ACTIVE = '[COMPANY_MNG] SET COMPANIES FILTERS ACTIVE';


function getListingQueryArguments({ filters: { name, organizationId, active }, order, page, rowsPerPage }) {
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
    return args;
}

export function getCompanies({ filters, order, page, rowsPerPage }) {
    const args = getListingQueryArguments({ filters, order, page, rowsPerPage });    
    return (dispatch) => graphqlService.client.query(OrganizationMngCompanyListing(args)).then(result => {
        return dispatch({
            type: SET_COMPANYS,
            payload: result.data.OrganizationMngCompanyListing
        });
    })
}

export function removeCompanies(selectedForRemovalIds, { filters, order, page, rowsPerPage }) {
    const deleteArgs = { ids: selectedForRemovalIds };
    const listingArgs = getListingQueryArguments({ filters, order, page, rowsPerPage });
    return (dispatch) => defer(() => graphqlService.client.mutate(OrganizationMngDeleteCompany(deleteArgs))).pipe(
        mergeMap(() => defer(() => graphqlService.client.query(OrganizationMngCompanyListing(listingArgs)))),
        map((result) =>
            dispatch({
                type: SET_COMPANYS,
                payload: result.data.OrganizationMngCompanyListing
            })
        )
    ).toPromise();
}

export function setCompaniesPage(page) {
    return {
        type: SET_COMPANYS_PAGE,
        page
    }
}
export function setCompaniesRowsPerPage(rowsPerPage) {
    return {
        type: SET_COMPANYS_ROWS_PER_PAGE,
        rowsPerPage
    }
}
export function setCompaniesOrder(order) {
    return {
        type: SET_COMPANYS_ORDER,
        order
    }
}

export function setCompaniesFilterName(name) {    
    return {
        type: SET_COMPANYS_FILTERS_NAME,
        name
    }
}
export function setCompaniesFilterActive(active) {
    return {
        type: SET_COMPANYS_FILTERS_ACTIVE,
        active
    }
}
export function setCompaniesFilterOrganizationId(organizationId) {    
    return {
        type: SET_COMPANYS_FILTERS_ORGANIZATION_ID,
        organizationId
    }
}



