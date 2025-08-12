import { gql } from 'apollo-boost';

export const OrganizationMngUserListing = (variables) => ({
    query: gql`
            query OrganizationMngUserListing($filterInput:OrganizationMngUserFilterInput ,$paginationInput:OrganizationMngUserPaginationInput,$sortInput:OrganizationMngUserSortInput){
                OrganizationMngUserListing(filterInput:$filterInput,paginationInput:$paginationInput,sortInput:$sortInput){
                    listing{
                       id,documentId,firstName,lastName,emailAddress, active,auth{username}
                    },
                    queryTotalResultCount
                }
            }`,
    variables,
    fetchPolicy: 'network-only',
})

export const UserMngCompanyListing = (variables) => ({
    query: gql`
            query UserMngCompanyListing($filterInput:UserMngCompanyFilterInput ,$paginationInput:UserMngCompanyPaginationInput,$sortInput:UserMngCompanySortInput){
                UserMngCompanyListing(filterInput:$filterInput,paginationInput:$paginationInput,sortInput:$sortInput){
                    listing{
                       id,name,active,
                    },
                    queryTotalResultCount
                }
            }`,
    variables,
    fetchPolicy: 'network-only',
})