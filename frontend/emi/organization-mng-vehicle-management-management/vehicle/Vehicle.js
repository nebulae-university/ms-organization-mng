/* React core */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
/* UI core */
import { Button, Tab, Tabs, TextField, Icon, Typography, Switch, FormControlLabel, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import { FuseAnimate, FusePageCarded, FuseLoading } from '@fuse';
import { useForm } from '@fuse/hooks';
/* GraphQL Client hooks */
import { useSubscription, useLazyQuery, useMutation } from "@apollo/react-hooks";
/* Redux */
import { useDispatch, useSelector } from 'react-redux';
import withReducer from 'app/store/withReducer';
import * as AppActions from 'app/store/actions';
import * as Actions from '../store/actions';
import reducer from '../store/reducers';
/* Tools */
import _ from '@lodash';
import { Formik } from 'formik';
import * as Yup from "yup";
import { MDText } from 'i18n-react';
import i18n from "../i18n";
/* Support pages */
import Error404Page from 'app/main/pages/Error404Page';
import Error500Page from 'app/main/pages/Error500Page';
/* GQL queries/mutation to use */
import {
    onOrganizationMngVehicleModified,
    OrganizationMngVehicle,
    OrganizationMngCreateVehicle,
    OrganizationMngUpdateVehicle
} from "../gql/Vehicle";
import {
    UserMngCompanyListing
} from "../gql/User";
/* TABS renders */
import Metadata from './tabs/Metadata';
import { BasicInfo, basicInfoFormValidationsGenerator, basicInfoCapacityFormValidationsGenerator } from './tabs/BasicInfo';
import { RegulatoryCompliance, regulatoryComplianceFormValidationsGenerator } from './tabs/RegulatoryCompliance';
import { HumanResources, humanResourcesFormValidationsGenerator } from './tabs/HumanResources';
 

/**
 * Default Aggregate data when creating 
 */
const defaultData = {
    plate: '',
    ownership: 'OWN',
    active: true,
    hasDriverDoor: false,
    type: 'OTHER',
    manufacturer: 'OTHER',
    model: '',
    year: new Date().getFullYear(),
    fuelType: 'GASOLINE',
    emissionsStandard: 'OTHER',
    schemaType: 'NONE',
    colors: [],
    chassisNumber: '',
    engineNumber: '',
    internalNumber: '',
    bodyworkBrand: '',
    fuelRangeWithFullTank: 0,
    capacity: { seated: 0, standing: 0 },
    regulatoryCompliance: {
        operationCardNumber: "",
        operationCardExpeditionDate: Date.now(),
        operationCardExpirationDate: Date.now(),
        operationCardCompany: "",
        operationCardInternalNumber: "",
        mandatoryInsuranceNumber: "",
        mandatoryInsuranceExpeditionDate: Date.now(),
        mandatoryInsuranceExpirationDate: Date.now(),
        mandatoryInsuranceIssuer: "",
        technomechanicalNumber: "",
        technomechanicalExpeditionDate: Date.now(),
        technomechanicalExpirationDate: Date.now(),
        technomechanicalIssuer: "",
        carInsuranceNumber: "",
        carInsuranceExpeditionDate: Date.now(),
        carInsuranceExpirationDate: Date.now(),
        carInsuranceIssuer: "",
    },
    deviceId: '',
    humanResources: { ownerIds: [], driverIds: [], managerIds: [], userObjList: [] }
};

function Vehicle(props) {
    //Redux dispatcher
    const dispatch = useDispatch();

    // current logged user
    const loggedUser = useSelector(({ auth }) => auth.user);

    // Vehicle STATE and CRUD ops
    const gqlCompaniesListing = UserMngCompanyListing({});
    const [companyOptions, setCompanyOptions] = useState();
    const [queryCompanies, queryCompaniesResult] = useLazyQuery(gqlCompaniesListing.query, { fetchPolicy: gqlCompaniesListing.fetchPolicy })
    const [companyId, setCompanyId] = useState('')
    const [vehicle, setVehicle] = useState();
    const gqlVehicle = OrganizationMngVehicle({ id: props.match.params.vehicleId });
    const [readVehicle, readVehicleResult] = useLazyQuery(gqlVehicle.query, { fetchPolicy: gqlVehicle.fetchPolicy })
    const [createVehicle, createVehicleResult] = useMutation(OrganizationMngCreateVehicle({}).mutation);
    const [updateVehicle, updateVehicleResult] = useMutation(OrganizationMngUpdateVehicle({}).mutation);
    const onVehicleModifiedResult = useSubscription(...onOrganizationMngVehicleModified({ id: props.match.params.vehicleId }));
    const [originalVehicle, setOriginalVehicle] = useState();
    const [regulatoryComplianceWithErrors, setRegulatoryComplianceWithErrors] = useState(false);
    const [errorModel, setErrorModel] = useState(undefined);
    const [errorChasisNumber, setErrorChasisNumber] = useState(undefined);
    const [errorInternalNumber, setErrorInternalNumber] = useState(undefined);
    const [errorBodyworkBrand, setErrorBodyworkBrand] = useState(undefined);
    const [errorEngineNumber, setErrorEngineNumber] = useState(undefined);
    const [errorDeviceId, setErrorDeviceId] = useState(undefined);

    //UI controls states
    const [tabValue, setTabValue] = useState(0);
    const { form, handleChange: formHandleChange, setForm } = useForm(null);
    const [errors, setErrors] = useState([]);

    //Translation services
    const T = new MDText(i18n.get(loggedUser.locale));

    /*
    *  ====== USE_EFFECT SECTION ========
    */

    /*
        Prepares the FORM:
            - if is NEW then use default data
            - if is old Vehicle then loads the data
        Reads (from the server) a Vehicle when:
            - having a valid props.match.params (aka ID)
            - having or changing the selected Organization ID
    */
    useEffect(() => {
        function updateVehicleState() {
            if (loggedUser.selectedOrganization && loggedUser.selectedOrganization.id) {
                setVehicle({ ...defaultData, organizationId: loggedUser.selectedOrganization.id })
                dispatch(Actions.setVehiclesPage(0));
            }
            if (loggedUser.selectedOrganization && loggedUser.selectedOrganization.id) {
                queryCompanies({ variables: { paginationInput: { page: 0, count: 100, queryTotalResultCount: false }, filterInput: { organizationId: loggedUser.selectedOrganization.id } } });
            }
        }
        updateVehicleState();
    }, [dispatch, props.match.params, loggedUser.selectedOrganization]);

    useEffect(() => {
        if (!queryCompaniesResult.loading && queryCompaniesResult.data) {
            const params = props.match.params;
            const { vehicleId } = params;
            const options = [...queryCompaniesResult.data.UserMngCompanyListing.listing.map(({ id, name, number, active }) => ({ id, name, number, active }))];
            setCompanyOptions(options);
            if (vehicleId !== 'new' && loggedUser.selectedOrganization && loggedUser.selectedOrganization.id !== "") {
                readVehicle({ variables: { organizationId: loggedUser.selectedOrganization.id, id: vehicleId } });
            } else {
                setCompanyOptions(options.filter(o => o.active));
            }
        }

    }, [queryCompaniesResult])

    //Refresh Vehicle state when the lazy query (READ) resolves
    useEffect(() => {
        if (readVehicleResult.data) {

            const original = readVehicleResult.data.OrganizationMngVehicle;
            delete original.codeLoadToParent
            setOriginalVehicle(original);

            const clone = _.cloneDeep(original);
            clone.fuelRangeWithFullTank = original.fuelRangeWithFullTank || 0;

            setVehicle(clone);
            setCompanyOptions(companyOptions.filter(c => c.active || c.id === clone.companyId))
        }
    }, [readVehicleResult])
    //Refresh Vehicle state when the CREATE mutation resolves
    useEffect(() => {
        if (createVehicleResult.data && createVehicleResult.data.OrganizationMngCreateVehicle) {
            const codeLoadToParent = createVehicleResult.data.OrganizationMngCreateVehicle.codeLoadToParent;

            const dataClone = _.cloneDeep(createVehicleResult.data.OrganizationMngCreateVehicle);
            delete dataClone.codeLoadToParent
            setVehicle(dataClone);

            props.history.push('/vehicle-mng/vehicles/' + createVehicleResult.data.OrganizationMngCreateVehicle.id + '/');
            dispatch(AppActions.showMessage({ message: T.translate("vehicle.create_success"), variant: 'success' }));

            if (codeLoadToParent) {
                const codeErrors = [7007, 7009, 7010];
                dispatch(AppActions.showMessage({
                    message: T.translate(`${codeLoadToParent}`),
                    variant: (codeErrors.includes(codeLoadToParent)) ? 'warning' : 'error'
                }));
            }
        }
    }, [createVehicleResult])
    //Refresh Vehicle state when the UPDATE mutation resolves
    useEffect(() => {
        if (updateVehicleResult.data) {
            const codeLoadToParent = updateVehicleResult.data.OrganizationMngUpdateVehicle.codeLoadToParent;

            const dataClone = _.cloneDeep(updateVehicleResult.data.OrganizationMngUpdateVehicle);
            delete dataClone.codeLoadToParent
            setVehicle(dataClone);

            if (codeLoadToParent) {
                const codeErrors = [7007, 7009, 7010];
                dispatch(AppActions.showMessage({
                    message: T.translate(`${codeLoadToParent}`),
                    variant: (codeErrors.includes(codeLoadToParent)) ? 'warning' : 'error'
                }));
            }
        }
    }, [updateVehicleResult])
    //Refresh Vehicle state when GQL subscription notifies a change
    useEffect(() => {
        if (onVehicleModifiedResult.data) {

            const { VehicleModifiedResult } = onVehicleModifiedResult.data
            setForm(VehicleModifiedResult);

            dispatch(AppActions.showMessage({ message: T.translate("vehicle.update_success"), variant: 'success' }));
        }
    }, [onVehicleModifiedResult.data]);

    // Keep the sync between the Vehicle state and the form state
    useEffect(() => {
        if ((vehicle && !form) || (vehicle && form && vehicle.id !== form.id)) {
            setCompanyId((vehicle.companyId || (loggedUser.data.companyId || '')));
            const carInsuranceNumber = vehicle.regulatoryCompliance.carInsuranceNumber || "";
            const carInsuranceExpeditionDate = vehicle.regulatoryCompliance.carInsuranceExpeditionDate || Date.now();
            const carInsuranceExpirationDate = vehicle.regulatoryCompliance.carInsuranceExpirationDate || Date.now();
            const carInsuranceIssuer = vehicle.regulatoryCompliance.carInsuranceIssuer || "";
            setForm({...vehicle, regulatoryCompliance: { ...vehicle.regulatoryCompliance, carInsuranceNumber, carInsuranceExpeditionDate, carInsuranceExpirationDate, carInsuranceIssuer }});
        }
    }, [form, vehicle, setForm]);

    // DISPLAYS floating message for CRUD errors
    useEffect(() => {
        const error = createVehicleResult.error || updateVehicleResult.error;
        if (error) {
            const { graphQLErrors, networkError, message } = error;
            let messageInf;
            let statusCode;
            
            if (graphQLErrors[0].message.code && graphQLErrors[0].message.code === 2) {
                dispatch(AppActions.showMessage({ message: T.translate(`vehicles.errors.2`), variant: 'error' }))
            } else if (graphQLErrors[0] && graphQLErrors[0].message && graphQLErrors[0].message.code) {
                statusCode = graphQLErrors[0].message.code;
                switch (((graphQLErrors[0] || {}).message || {}).code) {
                    default:
                        messageInf = T.translate(`${graphQLErrors[0].message.code}`)
                        break;
                }
            
            }

            const errMessage = networkError
                ? T.translate(`vehicle.network_error`)
                : graphQLErrors.length === 0
                    ? message
                    : messageInf
            dispatch(AppActions.showMessage({
                message: errMessage,
                variant: (statusCode === 7009 || statusCode === 7010) ? 'warning' : 'error'
            }));
        }
    }, [createVehicleResult.error, updateVehicleResult.error])

    /*
    *  ====== FORM HANDLERS, VALIDATORS AND LOGIC ========
    */

    /**
     * Handles Tab changes
     * @param {*} event 
     * @param {*} tabValue 
     */
    function handleChangeTab(event, tabValue) {
        setTabValue(tabValue);
    }

    /**
     * Evaluates if the logged user has enought permissions to WRITE (Create/Update/Delete) data
     */
    function canWrite() {
        return loggedUser.role.includes('VEHICLE_WRITE');
    }

    function customCanWrite(){
        return loggedUser.role.includes('VEHICLE_RES_ADM');
    }

    /**
     * Evals if the Save button can be submitted
     */
    function canBeSubmitted() {
        return (
            (customCanWrite() || canWrite)
            && !updateVehicleResult.loading
            && !createVehicleResult.loading
            && _.isEmpty(errors)
            && companyId && companyId !== ""
            && !_.isEqual({ ...originalVehicle, metadata: undefined }, { ...form, fuelRangeWithFullTank: parseInt(form.fuelRangeWithFullTank || 0), year: parseInt(form.year), companyId, capacity: {...form.capacity, seated: parseInt(form.capacity.seated || 0), standing: parseInt(form.capacity.standing || 0) }, metadata: undefined })
            && (!form.regulatoryCompliance || (form.regulatoryCompliance && !regulatoryComplianceWithErrors)))
            && !errorInternalNumber && !errorModel && !errorChasisNumber && !errorEngineNumber
            && form.plate
    }

    /**
     * Handle the Save button action
     */
    function handleSave() {
        const { id } = form;
        const parsedForm = { ...form, plate: (form.plate || "").toUpperCase(), bodyworkBrand: (form.bodyworkBrand || "").toUpperCase(), id: undefined, __typename: undefined, metadata: undefined };
        parsedForm.year = parsedForm.year !== "" && parsedForm.year !== null ? parseInt(parsedForm.year) : new Date().getFullYear();
        parsedForm.capacity.seated = parsedForm.capacity.seated !== "" && parsedForm.capacity.seated !== null ? parseInt(parsedForm.capacity.seated) : 0;
        parsedForm.capacity.standing = parsedForm.capacity.standing !== "" && parsedForm.capacity.standing !== null ? parseInt(parsedForm.capacity.standing) : 0;
        if (parsedForm.capacity) { delete parsedForm.capacity.__typename; }
        if (parsedForm.regulatoryCompliance) { delete parsedForm.regulatoryCompliance.__typename; }
        if (parsedForm.humanResources) { 
            if(parsedForm.humanResources.driverIds){
                parsedForm.humanResources.driverIds = Array.from(new Set(parsedForm.humanResources.driverIds))
            }
            if(parsedForm.humanResources.managerIds){
                parsedForm.humanResources.managerIds = Array.from(new Set(parsedForm.humanResources.managerIds))
            }
            if(parsedForm.humanResources.ownerIds){
                parsedForm.humanResources.ownerIds = Array.from(new Set(parsedForm.humanResources.ownerIds))
            }
            delete parsedForm.humanResources.__typename; delete parsedForm.humanResources.userObjList;
        }

        if (parsedForm.fuelRangeWithFullTank !== "" && parsedForm.fuelRangeWithFullTank !== null) {
            parsedForm.fuelRangeWithFullTank = parseInt(parsedForm.fuelRangeWithFullTank);
        } else {
            parsedForm.fuelRangeWithFullTank = 0;
        }

        delete parsedForm.deviceId;
        delete parsedForm.devSerial;

        if (id === undefined) {
            createVehicle({ variables: { input: { ...parsedForm, companyId, organizationId: loggedUser.selectedOrganization.id } } });
        } else {
            updateVehicle({ variables: { id, input: { ...parsedForm, companyId }, merge: true } });
        }
    }


    /*
    *  ====== ALTERNATIVE PAGES TO RENDER ========
    */

    // Shows an ERROR page when a really important server response fails
    const gqlError = readVehicleResult.error;
    if (gqlError) {
        const firstErrorMessage = gqlError.graphQLErrors[0].message;
        if (!firstErrorMessage.includes || !firstErrorMessage.includes("Cannot return null")) {
            return (<Error500Page message={T.translate("vehicle.internal_server_error")}
                description={gqlError.graphQLErrors.map(e => `@${e.path[0]} => code ${e.message.code}: ${e.message.name}`)} />);
        }
    }

    // Shows the Loading bar if we are waiting for something mandatory
    if (!loggedUser.selectedOrganization || readVehicleResult.loading || queryCompaniesResult.loading) {
        return (<FuseLoading />);
    }

    // Shows a NotFound page if the Vehicle has not been found. (maybe because it belongs to other organization or the id does not exists)
    if (props.match.params.vehicleId !== "new" && (!readVehicleResult.data && !createVehicleResult.data)&& loggedUser.selectedOrganization && readVehicleResult.called) {
        return (<Error404Page message={T.translate("vehicle.not_found")} />);
    }


    /*
    *  ====== FINAL PAGE TO RENDER ========
    */

    return (
        <FusePageCarded
            classes={{
                toolbar: "p-0",
                header: "min-h-72 h-72 sm:h-136 sm:min-h-136"
            }}
            header={
                form && (
                    <div className="flex flex-1 w-full items-center justify-between">

                        <div className="flex flex-col items-start max-w-full">

                            <FuseAnimate animation="transition.slideRightIn" delay={300}>
                                <Typography className="normal-case flex items-center sm:mb-12" component={Link} role="button" to="/vehicle-mng/vehicles" color="inherit">
                                    <Icon className="mr-4 text-20">arrow_back</Icon>
                                    {T.translate("vehicle.vehicles")}
                                </Typography>
                            </FuseAnimate>

                            <div className="flex items-center max-w-full">
                                <FuseAnimate animation="transition.expandIn" delay={300}>
                                    <Icon className="text-32 mr-0 sm:text-48 mr-12">directions_bus</Icon>
                                </FuseAnimate>

                                <div className="flex flex-col min-w-0">
                                    <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                                        <Typography className="text-16 sm:text-20 truncate">
                                            {form.plate ? form.plate : T.translate("vehicle.new_vehicle")}
                                        </Typography>
                                    </FuseAnimate>
                                    <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                                        <Typography variant="caption">{T.translate("vehicle.vehicle_detail")}</Typography>
                                    </FuseAnimate>
                                </div>
                            </div>
                        </div>
                        <FuseAnimate animation="transition.slideRightIn" delay={300}>
                            <Button
                                className="whitespace-no-wrap"
                                variant="contained"
                                disabled={!canBeSubmitted()}
                                onClick={handleSave}
                            >
                                {T.translate("vehicle.save")}
                            </Button>
                        </FuseAnimate>
                    </div>
                )
            }
            contentToolbar={
                <Tabs
                    value={tabValue}
                    onChange={handleChangeTab}
                    indicatorColor="secondary"
                    textColor="secondary"
                    variant="scrollable"
                    scrollButtons="auto"
                    classes={{ root: "w-full h-64" }}
                >
                    <Tab className="h-64 normal-case" label={T.translate("vehicle.basic_info")} />
                    {(form && form.regulatoryCompliance) && (<Tab className="h-64 normal-case" label={T.translate("vehicle.regulatoryCompliance_tab")} />)}
                    {(form && form.humanResources) && (<Tab className="h-64 normal-case" label={T.translate("vehicle.humanresources_tab")} />)}
                    {(form && form.metadata) && (<Tab className="h-64 normal-case" label={T.translate("vehicle.metadata_tab")} />)}
                </Tabs>
            }
            content={
                form && (
                    <div className="p-16 sm:p-24 max-w-2xl">

                        <Formik
                            initialValues={{ ...form }}
                            enableReinitialize
                            onSubmit={handleSave}
                            validationSchema={Yup.object().shape({
                                ...basicInfoFormValidationsGenerator(T),
                                capacity: Yup.object().shape({
                                    ...basicInfoCapacityFormValidationsGenerator(T)
                                }),
                                regulatoryCompliance: Yup.object().shape({
                                    ...regulatoryComplianceFormValidationsGenerator(T)
                                })
                            })}

                        >

                            {(props) => {
                                const {
                                    values,
                                    touched,
                                    errors,
                                    setFieldTouched,
                                    handleChange,
                                    handleSubmit,
                                    resetForm,
                                    setFieldValue
                                } = props;

                                setErrors(errors);
                                const onChange = (fieldName) => (event) => {
                                    event.persist();
                                    setFieldTouched(fieldName);
                                    handleChange(event);
                                    formHandleChange(event);
                                };
                                return (
                                    <form noValidate onSubmit={handleSubmit}>
                                        {tabValue === 0 && <BasicInfo dataSource={values} {...{ T, onChange, errorDeviceId, setErrorDeviceId, errorModel, setErrorModel, errorChasisNumber, setErrorChasisNumber, errorInternalNumber, setErrorInternalNumber, errorEngineNumber, setErrorEngineNumber, canWrite, errors, touched, setFieldValue, setForm, companyOptions, companyId, setCompanyId, queryCompaniesResult, loggedUser, errorBodyworkBrand, setErrorBodyworkBrand }} />}
                                        {tabValue === 1 && <RegulatoryCompliance dataSource={values} {...{ T, setRegulatoryComplianceWithErrors, onChange, canWrite, customCanWrite, errors, touched, setFieldValue, setForm, loggedUser }} />}
                                        {tabValue === 2 && <HumanResources dataSource={values} {...{ T,customCanWrite, onChange, canWrite, errors, touched, setFieldValue, setForm, companyId, loggedUser }} />}
                                        {tabValue === 3 && <Metadata dataSource={values} T={T} />}
                                    </form>
                                );
                            }}
                        </Formik>



                    </div>
                )
            }
            innerScroll
        />
    )
}

export default withReducer('VehicleManagement', reducer)(Vehicle);
