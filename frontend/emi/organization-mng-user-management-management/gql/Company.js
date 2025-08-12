import { gql } from 'apollo-boost';

export const OrganizationMngCompanyListing = (variables) => ({
    query: gql`
            query OrganizationMngCompanyListing($filterInput:OrganizationMngCompanyFilterInput ,$paginationInput:OrganizationMngCompanyPaginationInput,$sortInput:OrganizationMngCompanySortInput){
                OrganizationMngCompanyListing(filterInput:$filterInput,paginationInput:$paginationInput,sortInput:$sortInput){
                    listing{
                       id,name,active
                    },
                    queryTotalResultCount
                }
            }`,
    variables,
    fetchPolicy: 'network-only',
})