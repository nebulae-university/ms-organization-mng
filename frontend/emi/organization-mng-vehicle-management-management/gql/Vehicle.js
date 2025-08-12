import { gql } from 'apollo-boost';

export const OrganizationMngVehicleListing = (variables) => ({
    query: gql`
            query OrganizationMngVehicleListing($filterInput:OrganizationMngVehicleFilterInput ,$paginationInput:OrganizationMngVehiclePaginationInput,$sortInput:OrganizationMngVehicleSortInput){
                OrganizationMngVehicleListing(filterInput:$filterInput,paginationInput:$paginationInput,sortInput:$sortInput){
                    listing{
                       id,plate,active,internalNumber, deviceId, devSerial, type, externalSystemId,pendingToReportToParent, companyId
                    },
                    queryTotalResultCount
                }
            }`,
    variables,
    fetchPolicy: 'network-only',
});

export const OrganizationMngCompleteVehicleListing = (variables) => ({
    query: gql`
            query OrganizationMngVehicleListing($filterInput:OrganizationMngVehicleFilterInput ,$paginationInput:OrganizationMngVehiclePaginationInput,$sortInput:OrganizationMngVehicleSortInput){
                OrganizationMngVehicleListing(filterInput:$filterInput,paginationInput:$paginationInput,sortInput:$sortInput){
                    listing {
                       id, plate, active, internalNumber, bodyworkBrand, deviceId, devSerial, type, organizationId, ownership,
                       manufacturer, model, year, fuelType, emissionsStandard, schemaType, colors, chassisNumber,
                       engineNumber, fuelRangeWithFullTank, companyId, codeLoadToParent, hasDriverDoor,
                       humanResources {
                            ownerIds, driverIds, managerIds, userObjList
                        },
                       capacity { seated, standing },
                       regulatoryCompliance { 
                            operationCardNumber, operationCardExpeditionDate, operationCardExpirationDate, operationCardCompany,
                            operationCardInternalNumber, mandatoryInsuranceNumber, mandatoryInsuranceExpeditionDate,
                            mandatoryInsuranceExpirationDate, mandatoryInsuranceIssuer, technomechanicalNumber, 
                            technomechanicalExpeditionDate, technomechanicalExpirationDate, technomechanicalIssuer,
                            carInsuranceNumber, carInsuranceExpeditionDate, carInsuranceExpirationDate, carInsuranceIssuer
                        },
                        metadata{ createdBy, createdAt, updatedBy, updatedAt },   
                    },
                    
                    queryTotalResultCount 
                }
            }`,
    variables,
    fetchPolicy: 'network-only',
});


export const OrganizationMngVehicle = (variables) => ({
    query: gql`
            query OrganizationMngVehicle($id: ID!, $organizationId: String!){
                OrganizationMngVehicle(id:$id, organizationId:$organizationId){
                    id, organizationId, ownership, type, plate, manufacturer, model, year, active, fuelType, emissionsStandard, schemaType, colors, chassisNumber, engineNumber, internalNumber, bodyworkBrand, deviceId, devSerial,
                    companyId, codeLoadToParent, hasDriverDoor
                    fuelRangeWithFullTank, capacity {seated, standing},
                    regulatoryCompliance {
                        operationCardNumber, operationCardExpeditionDate, operationCardExpirationDate, operationCardCompany, operationCardInternalNumber,
                        mandatoryInsuranceNumber, mandatoryInsuranceExpeditionDate, mandatoryInsuranceExpirationDate, mandatoryInsuranceIssuer,
                        technomechanicalNumber, technomechanicalExpeditionDate, technomechanicalExpirationDate, technomechanicalIssuer,
                        carInsuranceNumber, carInsuranceExpeditionDate, carInsuranceExpirationDate, carInsuranceIssuer
                    },
                    humanResources{ ownerIds, driverIds, managerIds, userObjList },
                    metadata{ createdBy, createdAt, updatedBy, updatedAt }
                }
            }`,
    variables,
    fetchPolicy: 'network-only',
})

export const OrganizationMngImportVehicle = (variables) => ({
    mutation: gql`
            mutation  OrganizationMngImportVehicle($vehicleDataCompress: String, $organizationId: String){
                OrganizationMngImportVehicle(vehicleDataCompress: $vehicleDataCompress, organizationId: $organizationId){
                    persisted,
                    validRows,
                    inserted,
                    updated,
                    INVALID_DATA,
                    NOT_FOUND,
                    PROCESS_ERROR,
                    MONGO_ERROR
                }
            }`,
    variables
})


export const OrganizationMngCreateVehicle = (variables) => ({
    mutation: gql`
            mutation  OrganizationMngCreateVehicle($input: OrganizationMngVehicleInput!){
                OrganizationMngCreateVehicle(input: $input){
                    id, organizationId, ownership, type, plate, manufacturer, model, year, active, fuelType, emissionsStandard, schemaType, colors, chassisNumber, engineNumber, internalNumber, bodyworkBrand, deviceId, devSerial,hasDriverDoor
                    companyId, codeLoadToParent,
                    fuelRangeWithFullTank, capacity {seated, standing},
                    regulatoryCompliance {
                        operationCardNumber, operationCardExpeditionDate, operationCardExpirationDate, operationCardCompany, operationCardInternalNumber,
                        mandatoryInsuranceNumber, mandatoryInsuranceExpeditionDate, mandatoryInsuranceExpirationDate, mandatoryInsuranceIssuer,
                        technomechanicalNumber, technomechanicalExpeditionDate, technomechanicalExpirationDate, technomechanicalIssuer,
                        carInsuranceNumber, carInsuranceExpeditionDate, carInsuranceExpirationDate, carInsuranceIssuer
                    },
                    humanResources{ ownerIds, driverIds, managerIds, userObjList },
                    metadata{ createdBy, createdAt, updatedBy, updatedAt }
                }
            }`,
    variables
})

export const OrganizationMngDeleteVehicle = (variables) => ({
    mutation: gql`
            mutation OrganizationMngVehicleListing($ids: [ID]!, $organizationId: String!, $companyId: String){
                OrganizationMngDeleteVehicles(ids: $ids, organizationId:$organizationId, companyId:$companyId){
                    code,message
                }
            }`,
    variables
})

export const OrganizationMngUpdateVehicle = (variables) => ({
    mutation: gql`
            mutation  OrganizationMngUpdateVehicle($id: ID!,$input: OrganizationMngVehicleInput!, $merge: Boolean!){
                OrganizationMngUpdateVehicle(id:$id, input: $input, merge:$merge ){
                    id, organizationId, ownership, type, plate, manufacturer, model, year, active, fuelType, emissionsStandard, schemaType, colors, chassisNumber, engineNumber, internalNumber, bodyworkBrand, deviceId, devSerial,hasDriverDoor,
                    companyId, codeLoadToParent,
                    fuelRangeWithFullTank, capacity {seated, standing},
                    regulatoryCompliance {
                        operationCardNumber, operationCardExpeditionDate, operationCardExpirationDate, operationCardCompany, operationCardInternalNumber,
                        mandatoryInsuranceNumber, mandatoryInsuranceExpeditionDate, mandatoryInsuranceExpirationDate, mandatoryInsuranceIssuer,
                        technomechanicalNumber, technomechanicalExpeditionDate, technomechanicalExpirationDate, technomechanicalIssuer,
                        carInsuranceNumber, carInsuranceExpeditionDate, carInsuranceExpirationDate, carInsuranceIssuer
                    },
                    humanResources{ ownerIds, driverIds, managerIds, userObjList }
                }
            }`,
    variables
})

export const onOrganizationMngVehicleModified = (variables) => ([
    gql`subscription onOrganizationMngVehicleModified($id:ID!){
            OrganizationMngVehicleModified(id:$id){    
                id, organizationId, ownership, type, plate, manufacturer, model, year, active, fuelType, emissionsStandard, schemaType, colors, chassisNumber, engineNumber, internalNumber, bodyworkBrand, deviceId, devSerial,hasDriverDoor,
                companyId, codeLoadToParent,
                fuelRangeWithFullTank, capacity {seated, standing},
                regulatoryCompliance {
                    operationCardNumber, operationCardExpeditionDate, operationCardExpirationDate, operationCardCompany, operationCardInternalNumber,
                    mandatoryInsuranceNumber, mandatoryInsuranceExpeditionDate, mandatoryInsuranceExpirationDate, mandatoryInsuranceIssuer,
                    technomechanicalNumber, technomechanicalExpeditionDate, technomechanicalExpirationDate, technomechanicalIssuer,
                    carInsuranceNumber, carInsuranceExpeditionDate, carInsuranceExpirationDate, carInsuranceIssuer
                },
                humanResources{ ownerIds, driverIds, managerIds, userObjList },
                metadata{ createdBy, createdAt, updatedBy, updatedAt }
            }
    }`,
    { variables }
])