import { gql } from 'apollo-boost';

export const OrganizationMngOrganizationListing = (variables) => ({
    query: gql`
            query OrganizationMngOrganizationListing($filterInput:OrganizationMngOrganizationFilterInput ,$paginationInput:OrganizationMngOrganizationPaginationInput,$sortInput:OrganizationMngOrganizationSortInput){
                OrganizationMngOrganizationListing(filterInput:$filterInput,paginationInput:$paginationInput,sortInput:$sortInput){
                    listing{
                       id,name,active,document,contactInformation { 
                        emailAddress,
                        phoneNumber,
                        mobilePhoneNumber,
                        address,
                        daneLocation {
                            stateCode,
                            stateName,
                            cityName,
                            cityCode,
                            countryCode,
                            countryName,
                            countryIdentificationCode
                        }}
                    },
                    queryTotalResultCount
                }
            }`,
    variables,
    fetchPolicy: 'network-only',
})

export const OrganizationMngParentOrganization = (variables) => ({
    query: gql`
            query  OrganizationMngParentOrganization($organizationId: ID){
                OrganizationMngParentOrganization(organizationId: $organizationId ){
                    id,
                }
            }`,
    variables,
    fetchPolicy: 'network-only',
})


export const OrganizationMngOrganization = (variables) => ({
    query: gql`
            query OrganizationMngOrganization($id: ID!){
                OrganizationMngOrganization(id:$id){
                    id,name,description,type,active,logoUrl,
                    document,
                    documentType,   
                    attributes,
                    interoperableProfileMap,                 
                    contactInformation { 
                        emailAddress, 
                        phoneNumber,
                        address, 
                        mobilePhoneNumber,
                        daneLocation {
                            stateCode,
                            stateName,
                            cityName,
                            cityCode,
                            countryCode,
                            countryName,
                            countryIdentificationCode
                        },
                        }
                    metadata{
                        createdBy, createdAt, updatedBy, updatedAt
                    },
                    primaryLink{
                        url, username, password,organizationId
                    }
                }
            }`,
    variables,
    fetchPolicy: 'network-only',
})


export const OrganizationMngCreateOrganization = (variables) => ({
    mutation: gql`
            mutation  OrganizationMngCreateOrganization($input: OrganizationMngOrganizationInput!){
                OrganizationMngCreateOrganization(input: $input){
                    id,name,description,type,active,logoUrl,
                    document,
                    documentType,
                    attributes,
                    interoperableProfileMap,
                    contactInformation { 
                        emailAddress, 
                        phoneNumber,
                        address, 
                        mobilePhoneNumber,
                        daneLocation {
                            stateCode,
                            stateName,
                            cityName,
                            cityCode,
                            countryCode,
                            countryName,
                            countryIdentificationCode
                        },
                        }
                    primaryLink{
                    url, username, password,organizationId
                }
                }                
            }`,
    variables
})

export const OrganizationMngDeleteOrganization = (variables) => ({
    mutation: gql`
            mutation OrganizationMngOrganizationListing($ids: [ID]!){
                OrganizationMngDeleteOrganizations(ids: $ids){
                    code,message
                }
            }`,
    variables
})

export const OrganizationMngUpdateOrganization = (variables) => ({
    mutation: gql`
            ,mutation  OrganizationMngUpdateOrganization($id: ID!,$input: OrganizationMngOrganizationInput!, $merge: Boolean!){
                OrganizationMngUpdateOrganization(id:$id, input: $input, merge:$merge ){
                    id,name,description,type,active,logoUrl,
                    document,
                    documentType,
                    attributes,
                    interoperableProfileMap,
                    contactInformation { 
                        emailAddress, 
                        phoneNumber,
                        address, 
                        mobilePhoneNumber,
                        daneLocation {
                            stateCode,
                            stateName,
                            cityName,
                            cityCode,
                            countryCode,
                            countryName,
                            countryIdentificationCode
                        },
                    },
                    primaryLink{
                        url, username, password, organizationId
                    }
                }
            }`,
    variables
})

export const onOrganizationMngOrganizationModified = (variables) => ([
    gql`subscription onOrganizationMngOrganizationModified($id:ID!){
            OrganizationMngOrganizationModified(id:$id){    
                id,name,description,type,active,logoUrl,
                document,
                documentType,
                attributes,
                interoperableProfileMap,
                contactInformation { 
                        emailAddress, 
                        phoneNumber,
                        address, 
                        mobilePhoneNumber,
                        daneLocation {
                            stateCode,
                            stateName,
                            cityName,
                            cityCode,
                            countryCode,
                            countryName,
                            countryIdentificationCode
                        },
                    },
                metadata{
                    createdBy,createdAt,updatedBy,updatedAt 
                },
                primaryLink{
                        url, username, password,organizationId
                }
            }
    }`,
    { variables }
])