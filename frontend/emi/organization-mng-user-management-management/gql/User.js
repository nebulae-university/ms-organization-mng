import { gql } from 'apollo-boost';

export const OrganizationMngUserListing = (variables) => ({
    query: gql`
            query OrganizationMngUserListing($filterInput:OrganizationMngUserFilterInput ,$paginationInput:OrganizationMngUserPaginationInput,$sortInput:OrganizationMngUserSortInput){
                OrganizationMngUserListing( filterInput: $filterInput, paginationInput:$paginationInput, sortInput:$sortInput){
                    listing {
                       id,documentId,firstName,lastName,emailAddress, active,auth{username, authId}, metadata {createdAt}
                    },
                    queryTotalResultCount
                }
            }`,
    variables,
    fetchPolicy: 'network-only',
});

export const OrganizationMngCompleteUserListing = (variables) => ({
    query: gql`
            query OrganizationMngUserListing($filterInput:OrganizationMngUserFilterInput ,$paginationInput:OrganizationMngUserPaginationInput,$sortInput:OrganizationMngUserSortInput){
                OrganizationMngUserListing( filterInput: $filterInput, paginationInput:$paginationInput, sortInput:$sortInput){
                    listing {
                        id, 
                        documentId, 
                        firstName, 
                        lastName, 
                        emailAddress, 
                        phoneNumber, 
                        lastLoginDate, 
                        active,
                        roles,
                        roleMapName,
                        preferences { 
                            locale, 
                            timezone 
                        },
                        regulatoryCompliance { 
                            driverLicenseNumber, 
                            driverLicenseCategory, 
                            driverLicenseExpeditionDate, 
                            driverLicenseExpirationDate
                            mandatoryHealthPlanNumber, 
                            mandatoryHealthPlanIssuer,
                            mandatoryHealthPlanExpeditionDate,
                            mandatoryHealthPlanExpirationDate,
                            occupationalRiskAdministratorNumber, 
                            occupationalRiskAdministratorIssuer, 
                            occupationalRiskAdministratorExpeditionDate, 
                            occupationalRiskAdministratorExpirationDate
                        }
                        profilePicture,
                        auth { 
                            username 
                        },
                        metadata { 
                            createdBy, 
                            createdAt, 
                            updatedBy, 
                            updatedAt 
                        },
                        companyObj
                    },
                    queryTotalResultCount
                }
            }`,
    variables,
    fetchPolicy: 'network-only',
});

export const OrganizationMngUser = (variables) => ({
    query: gql`
            query OrganizationMngUser($id: ID!, $organizationId: String!){
                OrganizationMngUser(id:$id, organizationId:$organizationId){
                    id,
                    documentId,
                    organizationId,
                    firstName,
                    lastName,
                    companyId,
                    companyIds,
                    emailAddress,
                    phoneNumber,
                    roles,
                    roleMapName,
                    lastLoginDate,
                    active,
                    preferences { 
                        locale, 
                        timezone 
                    },
                    regulatoryCompliance {
                        driverLicenseNumber, 
                        driverLicenseCategory, 
                        driverLicenseExpeditionDate, 
                        driverLicenseExpirationDate, 
                        mandatoryHealthPlanNumber, 
                        mandatoryHealthPlanIssuer, 
                        mandatoryHealthPlanExpeditionDate, 
                        mandatoryHealthPlanExpirationDate, 
                        occupationalRiskAdministratorNumber, 
                        occupationalRiskAdministratorIssuer, 
                        occupationalRiskAdministratorExpeditionDate, 
                        occupationalRiskAdministratorExpirationDate,
                        typeVehicles
                    },
                    # companyObj,
                    profilePicture,
                    auth { 
                        authId, 
                        username 
                    },                    
                    metadata {
                        createdBy, 
                        createdAt, 
                        updatedBy,
                        updatedAt
                    }
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
                       id,name,active,partners
                    },
                    queryTotalResultCount
                }
            }`,
    variables,
    fetchPolicy: 'network-only',
})

export const OrganizationMngCreateUser = (variables) => ({
    mutation: gql`
            mutation  OrganizationMngCreateUser($input: OrganizationMngUserInput!){
                OrganizationMngCreateUser(input: $input){
                    id,
                    documentId,
                    organizationId,
                    firstName,
                    lastName,
                    emailAddress,
                    phoneNumber,
                    roles,
                    roleMapName,
                    lastLoginDate,
                    active,
                    companyId,
                    companyIds,
                    preferences { 
                        locale, 
                        timezone 
                    },        
                    regulatoryCompliance {
                        driverLicenseNumber, 
                        driverLicenseCategory, 
                        driverLicenseExpeditionDate, 
                        driverLicenseExpirationDate, 
                        mandatoryHealthPlanNumber, 
                        mandatoryHealthPlanIssuer, 
                        mandatoryHealthPlanExpeditionDate, 
                        mandatoryHealthPlanExpirationDate, 
                        occupationalRiskAdministratorNumber, 
                        occupationalRiskAdministratorIssuer, 
                        occupationalRiskAdministratorExpeditionDate, 
                        occupationalRiskAdministratorExpirationDate,
                        typeVehicles
                    },
                    auth { 
                        authId, 
                        username 
                    },
                    metadata {
                        createdBy, 
                        createdAt, 
                        updatedBy, 
                        updatedAt
                    }
                }
            }`,
    variables
})

export const OrganizationMngDeleteUser = (variables) => ({
    mutation: gql`
            mutation OrganizationMngUserListing($ids: [ID]!){
                OrganizationMngDeleteUsers(ids: $ids){
                    code,message
                }
            }`,
    variables
})

export const OrganizationMngUpdateUser = (variables) => ({
    mutation: gql`
            ,mutation  OrganizationMngUpdateUser($id: ID!,$input: OrganizationMngUserInput!, $merge: Boolean!){
                OrganizationMngUpdateUser(id:$id, input: $input, merge:$merge ){
                    id,
                    documentId,
                    organizationId,
                    companyId,
                    companyIds,
                    firstName,
                    lastName,
                    emailAddress,
                    phoneNumber,
                    roles,
                    roleMapName,
                    lastLoginDate,
                    active,
                    preferences { 
                        locale, 
                        timezone 
                    },
                    regulatoryCompliance {
                        driverLicenseNumber, 
                        driverLicenseCategory, 
                        driverLicenseExpeditionDate, 
                        driverLicenseExpirationDate, 
                        mandatoryHealthPlanNumber, 
                        mandatoryHealthPlanIssuer, 
                        mandatoryHealthPlanExpeditionDate, 
                        mandatoryHealthPlanExpirationDate, 
                        occupationalRiskAdministratorNumber, 
                        occupationalRiskAdministratorIssuer, 
                        occupationalRiskAdministratorExpeditionDate, 
                        occupationalRiskAdministratorExpirationDate,
                        typeVehicles
                    },
                    auth { 
                        authId, 
                        username 
                    },
                    metadata {
                        createdBy, 
                        createdAt, 
                        updatedBy, 
                        updatedAt
                    }
                }
            }`,
    variables
})

export const OrganizationMngUpdatePhoto = (variables) => ({
    mutation: gql`
            ,mutation  OrganizationMngUpdatePhoto($id: ID!,$photo: Upload!, $organizationId: String!){
                OrganizationMngUpdatePhoto(id:$id, photo: $photo, organizationId:$organizationId ){
                    code,message
                }
            }`,
    variables
})

export const onOrganizationMngUserModified = (variables) => ([
    gql`subscription onOrganizationMngUserModified($id:ID!){
            OrganizationMngUserModified(id:$id){    
                id,
                documentId,
                organizationId,
                firstName,
                lastName,
                emailAddress,
                phoneNumber,
                roles,
                lastLoginDate,
                active,
                preferences { 
                    locale, 
                    timezone 
                },
                regulatoryCompliance {
                    driverLicenseNumber, 
                    driverLicenseCategory, 
                    driverLicenseExpeditionDate,
                    driverLicenseExpirationDate, 
                    mandatoryHealthPlanNumber, 
                    mandatoryHealthPlanIssuer, 
                    mandatoryHealthPlanExpeditionDate, 
                    mandatoryHealthPlanExpirationDate,
                    occupationalRiskAdministratorNumber, 
                    occupationalRiskAdministratorIssuer, 
                    occupationalRiskAdministratorExpeditionDate, 
                    occupationalRiskAdministratorExpirationDate
                },
                auth { 
                    authId, 
                    username 
                },
                metadata { 
                    createdBy,
                    createdAt,
                    updatedBy,
                    updatedAt
                }
            }
    }`,
    { variables }
])


export const OrganizationMngRoleListing = () => ({
    query: gql`
            query OrganizationMngRoleListing{
                OrganizationMngRoleListing{
                    id, name
                }
            }`,
    fetchPolicy: 'network-only',
})

export const OrganizationMngCreateUserAuth = (variables) => ({
    mutation: gql`
            mutation  OrganizationMngCreateUserAuth($userId: ID!, $username: String!){
                OrganizationMngCreateUserAuth(userId:$userId, username: $username){
                    code,message
                }
            }`,
    variables
})

export const OrganizationMngDeleteUserAuth = (variables) => ({
    mutation: gql`
            mutation  OrganizationMngDeleteUserAuth($userId: ID!){
                OrganizationMngDeleteUserAuth(userId:$userId){
                    code,message
                }
            }`,
    variables
})

export const OrganizationMngUpdateUserAuthPassword = (variables) => ({
    mutation: gql`
            mutation OrganizationMngUpdateUserAuthPassword($userId: ID!, $password: String!, $temporary: Boolean){
                OrganizationMngUpdateUserAuthPassword(userId:$userId, password: $password,temporary:$temporary){
                    code,message
                }
            }`,
    variables
})