import { gql } from 'apollo-boost';

export const OrganizationMngCompanyListing = (variables) => ({
    query: gql`
            query OrganizationMngCompanyListing($filterInput:OrganizationMngCompanyFilterInput ,$paginationInput:OrganizationMngCompanyPaginationInput,$sortInput:OrganizationMngCompanySortInput){
                OrganizationMngCompanyListing(filterInput:$filterInput,paginationInput:$paginationInput,sortInput:$sortInput){
                    listing{
                       id,name,active,authorityCode, document, partnerId
                    },
                    queryTotalResultCount,
                }
            }`,
    variables,
    fetchPolicy: 'network-only',
})

export const OrganizationMngCompany = (variables) => ({
    query: gql`
            query OrganizationMngCompany($id: ID!, $organizationId: String!){
                OrganizationMngCompany(id:$id, organizationId:$organizationId){
                    id,name,description,useGeocodeTranslation,active,organizationId,industry,vehicleQuota,authorityCode,logoUrl,
                    metadata{
                        createdBy, createdAt, updatedBy, updatedAt
                    }, document, documentType, attributes
                    documents{
                        name
                        fileURL
                        uploaderUserId
                        uploaderUserFullname
                        uploadTimestamp
                    },
                    primaryLink{
                        url, username, password, organizationId, companyId
                    }
                    partners,
                    partnersDetails
                    partnerId
                }
            }`,
    variables,
    fetchPolicy: 'network-only',
})


export const OrganizationMngCreateCompany = (variables) => ({
    mutation: gql`
            mutation  OrganizationMngCreateCompany($input: OrganizationMngCompanyInput!){
                OrganizationMngCreateCompany(input: $input){
                    id,name,description,useGeocodeTranslation,active,organizationId,industry,vehicleQuota,authorityCode,logoUrl,
                    document, documentType, attributes, partners, partnersDetails
                    primaryLink{
                        url, username, password, organizationId, companyId
                    }
                }
            }`,
    variables
})

export const OrganizationMngParentCompanyVehicleQuota = (variables) => ({
    query: gql`
            query  OrganizationMngParentCompanyVehicleQuota($organizationId: String!, $companyId:String!){
                OrganizationMngParentCompanyVehicleQuota(organizationId: $organizationId, companyId: $companyId){
                    vehicleQuota,companyId
                }
            }`,
    variables,
    fetchPolicy: 'network-only',
})

export const OrganizationMngExternalCompany = (variables) => ({
    query: gql`
            query  OrganizationMngExternalCompany($organizationId: String, $companyId:String){
                OrganizationMngExternalCompany(organizationId: $organizationId, companyId: $companyId){
                    organizationId, companyId
                }
            }`,
    variables,
    fetchPolicy: 'network-only',
})

export const OrganizationMngRequestDownloadCompanyDocument = (variables) => ({
    query: gql`
            query OrganizationMngRequestDownloadCompanyDocument($requestId: String,$fileUrl: String, $downloadKey: BigInt){
                OrganizationMngRequestDownloadCompanyDocument(requestId:$requestId, fileUrl: $fileUrl, downloadKey: $downloadKey){
                    url,
                    validityTS
                }
            }`,
    variables,
    fetchPolicy: 'network-only',
})

export const OrganizationMngAlliesListing = (variables) => ({
    query: gql`
            query OrganizationMngAlliesListing($alliesSearch:String, $organizationId: String, $companyId:String){
                OrganizationMngAlliesListing(alliesSearch:$alliesSearch, organizationId:$organizationId, companyId:$companyId ){
                    listing{
                       id,name,active
                    },
                }
            }`,
    variables,
    fetchPolicy: 'network-only',
})


export const OrganizationMngDeleteCompany = (variables) => ({
    mutation: gql`
            mutation OrganizationMngCompanyListing($ids: [ID]!){
                OrganizationMngDeleteCompanies(ids: $ids){
                    code,message
                }
            }`,
    variables
})


export const OrganizationMngUpdateCompany = (variables) => ({
    mutation: gql`
            ,mutation  OrganizationMngUpdateCompany($id: ID!,$input: OrganizationMngCompanyInput!, $merge: Boolean!){
                OrganizationMngUpdateCompany(id:$id, input: $input, merge:$merge ){
                    id,organizationId,name,description,active,useGeocodeTranslation,industry,vehicleQuota
                    ,logoUrl, document, documentType, attributes, partners, partnersDetails, partnerId,
                    authorityCode
                    documents{
                        name
                        fileURL
                        uploaderUserId
                        uploaderUserFullname
                        uploadTimestamp
                    },
                    primaryLink{
                        url, username, password,organizationId, companyId
                    }
                }
            }`,
    variables
})

export const OrganizationMngUploadCompanyDocument = (variables) => ({
    mutation: gql`
            ,mutation  OrganizationMngUploadCompanyDocument($organizationId: String,$companyId: String,$fileName: String, $file: Upload){
                OrganizationMngUploadCompanyDocument(organizationId: $organizationId,companyId: $companyId,fileName: $fileName, file: $file){
                    id,organizationId,name,description,active,industry,vehicleQuota,logoUrl, document, documentType
                    documents{
                        name
                        fileURL
                        uploaderUserId
                        uploaderUserFullname
                        uploadTimestamp
                    }
                }
            }`,
    variables
})


export const OrganizationMngDeleteCompanyDocumentsByFileUrl = (variables) => ({
    mutation: gql`
            ,mutation  OrganizationMngDeleteCompanyDocumentsByFileUrl($companyId: String,$fileUrls: [String]){
                OrganizationMngDeleteCompanyDocumentsByFileUrl(companyId: $companyId,fileUrls:$fileUrls){
                    id,organizationId,name,description,active,industry,vehicleQuota,logoUrl, document, documentType
                    documents{
                        name
                        fileURL
                        uploaderUserId
                        uploaderUserFullname
                        uploadTimestamp
                    }
                }
            }`,
    variables
})


export const onOrganizationMngCompanyModified = (variables) => ([
    gql`subscription onOrganizationMngCompanyModified($id:ID!){
            OrganizationMngCompanyModified(id:$id){    
                id,organizationId,name,description,useGeocodeTranslation,active,industry,authorityCode
                vehicleQuota
                ,logoUrl, document, documentType, attributes
                metadata{
                    createdBy,createdAt,updatedBy,updatedAt 
                }
                documents{
                        name
                        fileURL
                        uploaderUserId
                        uploaderUserFullname
                        uploadTimestamp
                },
                primaryLink{
                    url, username, password, organizationId, companyId
                }
            }
    }`,
    { variables }
])

export const OrganizationMngCompanyPartialFileDownloaded = (variables) => ([
    gql`subscription OrganizationMngCompanyPartialFileDownloaded($requestId: String){
            OrganizationMngCompanyPartialFileDownloaded(requestId: $requestId){    
                requestId
                downloadKey
                partialEncode
                totalSections
                currentSection
            }
    }`,
    { variables }
])