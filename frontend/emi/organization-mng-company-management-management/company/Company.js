import React, { useEffect, useState } from 'react';
import { Button, Tab, Tabs, TextField, Icon, Typography, Switch, FormControlLabel, FormControl, InputLabel, Select, MenuItem, makeStyles, Grid, Avatar } from '@material-ui/core';
import { FuseAnimate, FusePageCarded, FuseLoading } from '@fuse';
import { useForm } from '@fuse/hooks';
import { useSubscription, useMutation, useLazyQuery } from "@apollo/react-hooks";
import { Link } from 'react-router-dom';
import _ from '@lodash';
import * as AppActions from 'app/store/actions';
import { useDispatch, useSelector } from 'react-redux';
import withReducer from 'app/store/withReducer';
import * as Actions from '../store/actions';
import INDUSTRIES from "./Industries"
import reducer from '../store/reducers';
import { MDText } from 'i18n-react';
import i18n from "../i18n";
import {
    onOrganizationMngCompanyModified,
    OrganizationMngCompany,
    OrganizationMngCreateCompany,
    OrganizationMngUpdateCompany,
    OrganizationMngParentCompanyVehicleQuota,
    OrganizationMngExternalCompany
} from "../gql/Company";
import Error404Page from 'app/main/pages/Error404Page';
import Error500Page from 'app/main/pages/Error500Page';
import Documents from './tabs/Documents';
import { from } from 'rxjs';
import SyncIcon from '@material-ui/icons/Sync';
import { Attributes } from './tabs/Attributes';
import { Allies } from './tabs/Allies';


const defaultData = {
    name: '',
    description: '',
    authorityCode: '',
    active: true,
    industry: 'OTHER',
    logoUrl: '',
    vehicleQuota: 1,
    primaryLink: {
        url: '',
        username: '',
        password: '',
        companyId: '',
        organizationId: ''
    },
    organizationId: undefined,
    partners: [],
    partnersDetails: []
};

const useStyles = makeStyles((theme) => ({
    small: {
        width: theme.spacing(3),
        height: theme.spacing(3),
    },
    large: {
        width: theme.spacing(9),
        height: theme.spacing(9),
        margin: "auto",

    },
    heightButton: {
        height: '53px',
    },
    formAutocomplete: {
        flex: '1 1 auto',
        height: 'auto',
        display: 'flex',
        position: 'relative',
        minHeight: '100%',
        flexDirection: 'row',
        backgroundColor: '#fafafa',
    },
    textForm: {
        '& input': {
            textTransform: "uppercase"
        }

    }
}));

function Company(props) {
    //Redux dispatcher
    const dispatch = useDispatch();
    // current logged user
    const user = useSelector(({ auth }) => auth.user);

    const classes = useStyles();

    //Company state
    const [company, setCompany] = useState();
    const [specs, setSpecs] = useState({});
    const [errorValidate, setErrorValidate] = useState([]);
    const [specsUpdated, setSpecsUpdated] = useState(false);
    const gqlOrganizationMngCompany = OrganizationMngCompany({});
    const gqlOrganizationMngParentCompanyVehicleQuota = OrganizationMngParentCompanyVehicleQuota({});
    const gqlOrganizationMngExternalCompany = OrganizationMngExternalCompany({});
    const [getExternalCompany, getExternalCompanyResult] = useLazyQuery(gqlOrganizationMngExternalCompany.query,
        { fetchPolicy: gqlOrganizationMngCompany.fetchPolicy })
    const [getVehicleQuota, getVehicleQuotaResult] = useLazyQuery(gqlOrganizationMngParentCompanyVehicleQuota.query,
        { fetchPolicy: gqlOrganizationMngCompany.fetchPolicy });
    const [createCompany, createCompanyResult] = useMutation(OrganizationMngCreateCompany({}).mutation);
    const [updateCompany, updateCompanyResult] = useMutation(OrganizationMngUpdateCompany({}).mutation);
    const [refreshCompany, companyResult] = useLazyQuery(gqlOrganizationMngCompany.query,
        { fetchPolicy: gqlOrganizationMngCompany.fetchPolicy })
    const onOrganizationMngCompanyModifiedResult = useSubscription(
        ...onOrganizationMngCompanyModified({ id: props.match.params.companyId }));

    //UI controls states
    const [tabValue, setTabValue] = useState(0);
    const [errorName, setErrorName] = useState(undefined);
    const [errorAuthorityCode, setErrorAuthorityCode] = useState(undefined);
    const [errorDocumentType, setErrorDocumentType] = useState(undefined);
    const [errorDocument, setErrorDocument] = useState(undefined);
    const [errorDescription, setErrorDescription] = useState(undefined);
    const { form, handleChange, setForm } = useForm(null);
    const [partnersToDelete, setpartnersToDelete] = useState([])
    const DOCUMENT_TYPE = {
        PASSPORT_NUMBER: 'PASSPORT_NUMBER',
        IDENTITY_CARD: 'IDENTITY_CARD',
        CITIZENSHIP_CARD: 'CITIZENSHIP_CARD',
        FOREIGNER_IDENTITY: 'FOREIGNER_IDENTITY',
        NIP: 'NIP',
        NIUP: 'NIUP',
        NIT: 'NIT'
    };
    let T = new MDText(i18n.get(user.locale));

    useEffect(() => {
        if (companyResult.data)
            setCompany(companyResult.data.OrganizationMngCompany)
    }, [companyResult])

    useEffect(() => {
        if (createCompanyResult.data) {
            setSpecsUpdated(false);
            setCompany(createCompanyResult.data.OrganizationMngCreateCompany)
            setForm(createCompanyResult.data.OrganizationMngCreateCompany)
            props.history.push('/company-mng/companies/' + createCompanyResult.data.OrganizationMngCreateCompany.id + '/');
            dispatch(AppActions.showMessage({ message: T.translate("company.create_success"), variant: 'success' }));
        }
    }, [createCompanyResult])

    useEffect(() => {
        if (getVehicleQuotaResult.data) {
            setForm({ ...form, vehicleQuota: getVehicleQuotaResult.data.OrganizationMngParentCompanyVehicleQuota.vehicleQuota })
            if (form.vehicleQuota !== getVehicleQuotaResult.data.OrganizationMngParentCompanyVehicleQuota.vehicleQuota) {
                dispatch(AppActions.showMessage({ message: T.translate("company.field_sync_vehicleQuota"), variant: 'success' }));
            }
            else if (form.vehicleQuota === getVehicleQuotaResult.data.OrganizationMngParentCompanyVehicleQuota.vehicleQuota) {
                dispatch(AppActions.showMessage({ message: T.translate("company.no_sync_vehicleQuota"), variant: 'info' }));
            } else {
                dispatch(AppActions.showMessage({ message: T.translate("company.no_sync_vehicleQuota"), variant: 'info' }));
            }
        }

    }, [getVehicleQuotaResult])

    useEffect(() => {

        if (getExternalCompanyResult.data) {


            if (form.primaryLink.companyId !== getExternalCompanyResult.data.OrganizationMngExternalCompany.companyId &&
                form.primaryLink.organizationId !== getExternalCompanyResult.data.OrganizationMngExternalCompany.organizationId) {
                const companyId = getExternalCompanyResult.data.OrganizationMngExternalCompany.companyId
                const organizationId = getExternalCompanyResult.data.OrganizationMngExternalCompany.organizationId
                setForm({ ...form, primaryLink: { ...form.primaryLink, companyId, organizationId } })
                dispatch(AppActions.showMessage({ message: T.translate("company.field_sync"), variant: 'success' }));
            }
            else if (form.primaryLink.companyId === getExternalCompanyResult.data.OrganizationMngExternalCompany.companyId &&
                form.primaryLink.organizationId === getExternalCompanyResult.data.OrganizationMngExternalCompany.organizationId) {
                dispatch(AppActions.showMessage({ message: T.translate("company.no_sync"), variant: 'info' }));
            }
        }

    }, [getExternalCompanyResult])

    useEffect(() => {
        if (updateCompanyResult.data) {
            setSpecsUpdated(false);
            setCompany(updateCompanyResult.data.OrganizationMngUpdateCompany)
            setForm(updateCompanyResult.data.OrganizationMngUpdateCompany)
            dispatch(AppActions.showMessage({ message: T.translate("company.update_success"), variant: 'success' }));
        }
    }, [updateCompanyResult])

    useEffect(() => {
        function updateCompanyState() {
            const params = props.match.params;
            const { companyId } = params;
            if (companyId !== 'new') {
                if (user.selectedOrganization && user.selectedOrganization.id !== "") {
                    refreshCompany({ variables: { organizationId: user.selectedOrganization.id, id: props.match.params.companyId } });
                }
            } else if (user.selectedOrganization && user.selectedOrganization.id) {
                setCompany({ ...defaultData, organizationId: user.selectedOrganization.id })
                dispatch(Actions.setCompaniesPage(0));
            }
        }
        updateCompanyState();
    }, [dispatch, props.match.params, user.selectedOrganization]);

    // Keep the sync between the Company state and the form state
    useEffect(() => {
        if (
            (company && !form) ||
            (company && form && company.id !== form.id)
        ) {
            setSpecs(company.attributes)
            setForm({
                ...company,
                primaryLink: company.primaryLink || {
                    url: '',
                    username: '',
                    password: '',
                    companyId: '',
                    organizationId: ''
                },
            });
        }
    }, [form, company]);

    useEffect(() => {
        if (specs && form) {
            if (!_.isEqual(form.attributes, specs)) {
                setSpecsUpdated(true);
            } else {
                setSpecsUpdated(false);
            }
        }
    }, [specs]);

    useEffect(() => {
        if (onOrganizationMngCompanyModifiedResult.data) {
            const { OrganizationMngCompanyModified } = onOrganizationMngCompanyModifiedResult.data;
            setForm(OrganizationMngCompanyModified);
        }
    }, [onOrganizationMngCompanyModifiedResult.data]);

    useEffect(() => {
        const error = getVehicleQuotaResult.error || getExternalCompanyResult.error;
        if (error) {
            const { graphQLErrors, networkError, message } = error;
            let messageInf;

            if (graphQLErrors[0] && graphQLErrors[0].message && graphQLErrors[0].message.code) {
                switch (((graphQLErrors[0] || {}).message || {}).code) {
                    default:
                        messageInf = T.translate(`${graphQLErrors[0].message.code}`)
                        break;
                }
            }

            const errMessage = networkError
                ? T.translate(`company.network_error`)
                : graphQLErrors.length === 0
                    ? message
                    : messageInf
            dispatch(AppActions.showMessage({
                message: errMessage,
                variant: 'error'
            }));
        }
    }, [getVehicleQuotaResult.error, getExternalCompanyResult.error])

    useEffect(() => {
        const gqlError = companyResult.error || createCompanyResult.error || updateCompanyResult.error;
        if (gqlError) {
            const { graphQLErrors, networkError, message } = gqlError;
            let messageInf;

            if (graphQLErrors[0] && graphQLErrors[0].message && graphQLErrors[0].message.code) {
                switch (((graphQLErrors[0] || {}).message || {}).code) {
                    default:
                        messageInf = T.translate(`${graphQLErrors[0].message.code}`)
                        break;
                }
            }

            const errMessage = networkError
                ? T.translate(`company.network_error`)
                : graphQLErrors.length === 0
                    ? message
                    : messageInf
            dispatch(AppActions.showMessage({
                message: errMessage,
                variant: 'error'
            }));
        }
    }, [companyResult.error, createCompanyResult.error, updateCompanyResult.error])

    // useEffect(() => {
    //   console.log("company, form ==>", {company, form});
    // }, [company, form]);

    function handleChangeTab(event, tabValue) {
        setTabValue(tabValue);
    }

    function canWrite() {
        return user.role.includes('COMPANY_WRITE');
    }

    function canBeSubmitted() {
        return (
            canWrite() &&
            form.name.length > 0 &&
            (form.document || "").length > 0 &&
            (form.documentType || "").length > 0 &&
            form.organizationId !== undefined &&
            validateUrl(form.primaryLink.url) &&
            !minMax(form.primaryLink.username.length) &&
            !minMax(form.primaryLink.password.length) &&
            !errorName &&
            !errorAuthorityCode &&
            !errorDocument &&
            !errorDocumentType &&
            !errorDescription &&
            (
              !_.isEqual(
                { 
                  ...company, 
                  metadata: undefined, 
                  name: company.name.trim().toUpperCase(),
                  partnersDetails: undefined
                }, 
                { 
                  ...form, 
                  metadata: undefined, 
                  partnersDetails: undefined,
                  name: form.name.trim().toUpperCase() }
                ) || 
                specsUpdated
            ) &&
            errorValidate.length === 0 ||
            company.partners === null
            //|| company.useGeocodeTranslation !== form.useGeocodeTranslation
        );
    }

    function canBeTest() {
        if (form.primaryLink) {
            return (
                canWrite() &&
                validateUrl((form.primaryLink.url || "")) &&
                (form.primaryLink.username || "").length > 5 &&
                (form.primaryLink.password || "").length > 5
            );
        } else {
            return false
        }

    }

    function handleIndustrySelectChange({ target: { value } }) {
        setForm({ ...form, industry: value })
    }

    function handleVehicleQuotaChange(event) {
        if (parseInt(event.target.value) >= 1 && parseInt(event.target.value) <= 5000) {
            event.persist();
            handleChange(event);
        }
    }

    function handleSync() {
        getVehicleQuota({ variables: { organizationId: user.selectedOrganization.id, companyId: company.id } })
    }

    function handleConect() {
        getExternalCompany({ variables: { organizationId: user.selectedOrganization.id, companyId: company.id } })
    }

    function handleSave() {
        const { id } = form
        const { /* partners: formPartners, */ partnersDetails: formPartnersDetails, ...restForm } = form
        /* const { partners } = company */

        if (id === undefined) {
            createCompany({ variables: { input: { /* partners: partners || [], */ ...restForm, name: form.name.trim().toUpperCase(), attributes: specs, documents: undefined, vehicleQuota: parseInt(form.vehicleQuota), organizationId: user.selectedOrganization.id } } });
        } else {
            let agregatePartnersToDelete = (company.partners || []).filter(partner => !(form.partners || []).find(p => p === partner));
            updateCompany({ variables: { id, input: { ...restForm, agregatePartnersToDelete, name: form.name.trim().toUpperCase(), attributes: specs, documents: undefined, vehicleQuota: parseInt(form.vehicleQuota), id: undefined, __typename: undefined, metadata: undefined, primaryLink: { ...restForm.primaryLink, __typename: undefined } }, merge: true } });
        }
    }

    function handleNameChange(event) {
        const newVal = event.target.value.trim().toUpperCase();
        if (!newVal) {
            setErrorName(T.translate("company.errors.name.required_field"));
        } else if (newVal.length < 3) {
            setErrorName(T.translate("company.errors.name.min_chars"));
        } else if (newVal.length > 100) {
            setErrorName(T.translate("company.errors.name.max_chars"));
        } else if (newVal) {
            const nameRegex = /^[A-Z0-9][ A-Z0-9]+[A-Z0-9]$/;
            setErrorName(!nameRegex.test(newVal) ? T.translate("company.errors.name.invalid_format") : undefined);
        }

        handleChange(event)
    }

    function handleAuthorityCodeChange(event) {
        const newVal = event.target.value.trim().toUpperCase();
        if (!newVal || newVal === "") {
            setErrorAuthorityCode(undefined);
        } else {
            const nameRegex = /^[A-Z0-9][ A-Z0-9]+[A-Z0-9]$/;
            setErrorAuthorityCode(!nameRegex.test(newVal) ? T.translate("company.errors.authorityCode.invalid_format") : undefined);
        }

        handleChange(event)
    }

    function handleDocumentChange(event) {
        const newVal = event.target.value.trim().toUpperCase();
        const documentType = form.documentType;
        if (!newVal) {
            setErrorDocument(T.translate("company.errors.document.required_field"));
        } else if (documentType === "PASSPORT_NUMBER") {
            const passportRegex = /^(?!^0+$)[A-Z0-9]{6,9}$/;
            setErrorDocument(!passportRegex.test(String(newVal)) ? T.translate("company.errors.document.invalid_format", { EXAM: "49TADY9H3" }) : undefined);
        }
        else if (documentType === "CITIZENSHIP_CARD") {
            const citizenRegex = /^[0-9]{5,10}/;
            setErrorDocument(!citizenRegex.test(String(newVal)) || newVal.length > 10 ? T.translate("company.errors.document.invalid_format", { EXAM: "1212121212" }) : undefined);
        }
        else if (documentType === "IDENTITY_CARD") {
            const identityCardRegex = /^[0-9]{5,10}$/;
            setErrorDocument(!identityCardRegex.test(String(newVal)) || newVal.length > 10 ? T.translate("company.errors.document.invalid_format", { EXAM: "1212121212" }) : undefined);
        }
        else if (documentType === "FOREIGNER_IDENTITY") {
            const foreignerIdentityRegex = /^[0-9]{5,10}/;
            setErrorDocument(!foreignerIdentityRegex.test(String(newVal)) || newVal.length > 10 ? T.translate("company.errors.document.invalid_format", { EXAM: "1212121212" }) : undefined);
        }
        else if (documentType === "NIUP") {
            const niupCardRegex = /^(?!^0+$)[A-Z0-9]{6,10}$/;
            setErrorDocument((!niupCardRegex.test(String(newVal)) || newVal.length > 10) ? T.translate("company.errors.document.invalid_format", { EXAM: "ABC1234567" }) : undefined);
        }
        else if (documentType === "NIP") {
            const niupCardRegex = /^[0-9]{6,11}/;
            setErrorDocument((!niupCardRegex.test(String(newVal)) || newVal.length > 11) ? T.translate("company.errors.document.invalid_format", { EXAM: "12121212121" }) : undefined);
        }
        else if (documentType === "NIT") {
            const citizenRegex = /(^[0-9]+-{1}[0-9]{1})/;
            setErrorDocument(!citizenRegex.test(String(newVal)) ? T.translate("company.errors.document.invalid_format", { EXAM: "11223333-1" }) : undefined);
        } else {
            setErrorDocument(undefined)
        }

        handleChange(event)
    }

    function handleDocumentTypeChange(event) {
        const newVal = event.target.value.trim().toUpperCase();
        const document = form.document;
        if (!newVal) {
            setErrorDocumentType(T.translate("company.errors.document_type.required_field"));
        } else {
            setErrorDocumentType(undefined)
        }

        if (!document) {
            setErrorDocument(T.translate("company.errors.document.required_field"));
        } else if (newVal === "PASSPORT_NUMBER") {
            const passportRegex = /^(?!^0+$)[A-Z0-9]{6,9}$/;
            setErrorDocument(!passportRegex.test(String(document)) ? T.translate("company.errors.document.invalid_format", { EXAM: "49TADY9H3" }) : undefined);
        }
        else if (newVal === "CITIZENSHIP_CARD") {
            const citizenRegex = /^[0-9]{5,10}/;
            setErrorDocument((!citizenRegex.test(String(document)) || document.length > 10) ? T.translate("company.errors.document.invalid_format", { EXAM: "1212121212" }) : undefined);
        }
        else if (newVal === "NIT") {
            const citizenRegex = /(^[0-9]+-{1}[0-9]{1})/;
            setErrorDocument(!citizenRegex.test(String(document)) ? T.translate("company.errors.document.invalid_format", { EXAM: "11223333-1" }) : undefined);
        }
        else if (newVal === "IDENTITY_CARD") {
            const identityCardRegex = /^[0-9]{5,10}$/;
            setErrorDocument((!identityCardRegex.test(String(document)) || document.length > 10) ? T.translate("company.errors.document.invalid_format", { EXAM: "1212121212" }) : undefined);
        }
        else if (newVal === "FOREIGNER_IDENTITY") {
            const foreignerIdentityRegex = /^[0-9]{5,10}/;
            setErrorDocument(!foreignerIdentityRegex.test(String(document)) || document.length > 10 ? T.translate("company.errors.document.invalid_format", { EXAM: "1212121212" }) : undefined);
        }
        else if (newVal === "NIUP") {
            const niupCardRegex = /^(?!^0+$)[A-Z0-9]{6,10}$/;
            setErrorDocument((!niupCardRegex.test(String(document)) || document.length > 10) ? T.translate("company.errors.document.invalid_format", { EXAM: "ABC1234567" }) : undefined);
        }
        else if (newVal === "NIP") {
            const niupCardRegex = /^[0-9]{6,11}/;
            setErrorDocument((!niupCardRegex.test(String(document)) || document.length > 11) ? T.translate("company.errors.document.invalid_format", { EXAM: "12121212121" }) : undefined);
        }
        else {
            setErrorDocument(undefined)
        }


        handleChange(event)
    }

    function handleDescriptionChange(event) {
        const newVal = event.target.value.trim();

        if (newVal.length > 500) {
            setErrorDescription(T.translate("company.errors.description.max_chars", { len: 500 }));
        } else {
            setErrorDescription(undefined);
        }

        handleChange(event)
    }

    function validateUrl(url) {
        return (url || '').length === 0 || /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(url);
    }

    function minMax(characters) {
        return characters != '' && characters < 5 ? T.translate("company.min") : '' || characters > 100 ? T.translate("company.max") : ''
    }

    const gqlError = companyResult.error || createCompanyResult.error || updateCompanyResult.error;
    if (gqlError) {
        const firstErrorMessage = gqlError.graphQLErrors[0].message;
        if (((firstErrorMessage || {}).code || 0) < 3011 && (!firstErrorMessage.includes || !firstErrorMessage.includes("Cannot return null"))) {
            return (<Error500Page message={T.translate("company.internal_server_error")}
                description={gqlError.graphQLErrors.map(e => `@${e.path[0]} => code ${e.message.code}: ${e.message.name}`)} />);
        }
    }

    if (!user.selectedOrganization || companyResult.loading) {
        return (<FuseLoading />);
    }

    if (props.match.params.companyId !== "new" && !companyResult.data) {
        return (<Error404Page message={T.translate("company.not_found")} />);
    }

    

    const metadataComponent = form && (
        <div>
            <form autoComplete="off">
                <TextField
                    className="mt-8 mb-16"
                    error={form.name === ''}
                    label={T.translate("company.metadata.createdBy")}
                    id="createdBy"
                    name="createdBy"
                    value={!form.metadata ? "" : form.metadata.createdBy}
                    variant="outlined"
                    fullWidth
                    InputProps={{
                        readOnly: true,
                    }}
                />

                <TextField
                    className="mt-8 mb-16"
                    error={form.name === ''}
                    label={T.translate("company.metadata.createdAt")}
                    id="createdAt"
                    name="createdAt"
                    value={!form.metadata ? "" : new Date(form.metadata.createdAt).toLocaleString()}
                    variant="outlined"
                    fullWidth
                    InputProps={{
                        readOnly: true,
                    }}
                />

                <TextField
                    className="mt-8 mb-16"
                    error={form.name === ''}
                    label={T.translate("company.metadata.updatedBy")}
                    id="updatedBy"
                    name="updatedBy"
                    value={!form.metadata ? "" : form.metadata.updatedBy}
                    variant="outlined"
                    fullWidth
                    InputProps={{
                        readOnly: true,
                    }}
                />


                <TextField
                    className="mt-8 mb-16"
                    error={form.name === ''}
                    label={T.translate("company.metadata.updatedAt")}
                    id="updatedAt"
                    name="updatedAt"
                    value={!form.metadata ? "" : new Date(form.metadata.updatedAt).toLocaleString()}
                    variant="outlined"
                    fullWidth
                    InputProps={{
                        readOnly: true,
                    }}
                />
            </form>
        </div>
    )

    return (
      <form autoComplete="off" className={`${classes.formAutocomplete}`}>
        <FusePageCarded
          classes={{
            toolbar: "p-0",
            header: "min-h-72 h-72 sm:h-136 sm:min-h-136",
          }}
          header={
            form && (
              <div className="flex flex-1 w-full items-center justify-between">
                <div className="flex flex-col items-start max-w-full">
                  <FuseAnimate animation="transition.slideRightIn" delay={300}>
                    <Typography
                      className="normal-case flex items-center sm:mb-12"
                      component={Link}
                      role="button"
                      to="/company-mng/companies"
                      color="inherit"
                    >
                      <Icon className="mr-4 text-20">arrow_back</Icon>
                      {T.translate("company.companies")}
                    </Typography>
                  </FuseAnimate>

                  <div className="flex items-center max-w-full">
                    <FuseAnimate animation="transition.expandIn" delay={300}>
                      <Icon className="text-32 mr-0 sm:text-48 mr-12">
                        business
                      </Icon>
                    </FuseAnimate>

                    <div className="flex flex-col min-w-0">
                      <FuseAnimate
                        animation="transition.slideLeftIn"
                        delay={300}
                      >
                        <Typography className="text-16 sm:text-20 truncate">
                          {form.name
                            ? form.name.toUpperCase()
                            : T.translate("company.new_operator")}
                        </Typography>
                      </FuseAnimate>
                      <FuseAnimate
                        animation="transition.slideLeftIn"
                        delay={300}
                      >
                        <Typography variant="caption">
                          {T.translate("company.company_detail")}
                        </Typography>
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
                    {T.translate("company.save")}
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
              <Tab
                className="h-64 normal-case"
                label={T.translate("company.basic_info")}
              />
              <Tab
                className="h-64 normal-case"
                label={T.translate("company.documents")}
              />
              <Tab
                className="h-64 normal-case"
                label={T.translate("company.attributes")}
              />
              {((company && company.partnerId === null || (company && company.partnerId && company.partnerId.length === 0)) || props.match.params.companyId === 'new' ) && (
                <Tab
                  className="h-64 normal-case"
                  label={T.translate("company.allies.title")}
                />
              )}

              {process.env.REACT_APP_PLATFORM_TYPE === "DEPENDENT" && (
                <Tab
                  className="h-64 normal-case"
                  label={T.translate("company.Primary_Link")}
                />
              )}

              {form && form.metadata && (
                <Tab
                  className="h-64 normal-case"
                  label={T.translate("company.metadata_tab")}
                />
              )}
            </Tabs>
          }
          content={
            form && (
              <div className="p-16 sm:p-24 max-w-2xl">
                {tabValue === 0 && (
                  <div>
                    <TextField
                      className={`mt-8 mb-16 ${classes.textForm}`}
                      error={errorName}
                      helperText={errorName}
                      required
                      label={T.translate("company.name")}
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleNameChange}
                      variant="outlined"
                      fullWidth
                      InputProps={{
                        readOnly: !canWrite(),
                      }}
                    />

                    <FormControl
                      variant="outlined"
                      className="mt-8 mb-16"
                      fullWidth
                    >
                      <InputLabel htmlFor="industry">
                        {T.translate("company.industry")}
                      </InputLabel>
                      <Select
                        labelWidth={70}
                        value={form.industry}
                        onChange={handleIndustrySelectChange}
                      >
                        {INDUSTRIES.map((i) => (
                          <MenuItem key={i} value={i}>
                            {" "}
                            {T.translate(`company.industries.${i}`)}{" "}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <TextField
                      className="mt-8 mb-16"
                      id="authorityCode"
                      name="authorityCode"
                      error={errorAuthorityCode}
                      helperText={errorAuthorityCode}
                      // onChange={handleChange}
                      label={T.translate("company.authorityCode")}
                      type="text"
                      value={form.authorityCode.toUpperCase()}
                      onChange={handleAuthorityCodeChange}
                      variant="outlined"
                      fullWidth
                      InputProps={{
                        readOnly: !canWrite(),
                      }}
                    />

                    <TextField
                      select
                      className="mt-8 mb-16"
                      required
                      helperText={errorDocumentType}
                      error={errorDocumentType}
                      label={T.translate("company.documentType")}
                      id="documentType"
                      name="documentType"
                      value={form.documentType || ""}
                      onChange={handleDocumentTypeChange}
                      onBlur={handleDocumentTypeChange}
                      variant="outlined"
                      autoComplete={"off"}
                      fullWidth
                      InputProps={{
                        readOnly: !canWrite(),
                      }}
                    >
                      {Object.keys(DOCUMENT_TYPE).map((key) => (
                        <MenuItem key={key} value={key}>
                          {T.translate(
                            `company.documentTypes.${DOCUMENT_TYPE[key]}`
                          )}
                        </MenuItem>
                      ))}
                    </TextField>

                    <TextField
                      className="mt-8 mb-16"
                      required
                      helperText={errorDocument}
                      error={errorDocument}
                      label={T.translate("company.documentNumber")}
                      id="document"
                      name="document"
                      value={(
                        (form.document && form.document.toUpperCase()) ||
                        ""
                      ).trim()}
                      onChange={handleDocumentChange}
                      onBlur={handleDocumentChange}
                      variant="outlined"
                      autoComplete={"off"}
                      fullWidth
                      InputProps={{
                        readOnly: !canWrite(),
                      }}
                    />

                    <Grid container spacing={1}>
                      <Grid item xs={11}>
                        <TextField
                          className="mt-8 mb-16"
                          error={form.vehicleQuota === ""}
                          required
                          type="number"
                          label={T.translate("company.vehicleQuota")}
                          id="vehicleQuota"
                          name="vehicleQuota"
                          value={form.vehicleQuota}
                          onChange={handleVehicleQuotaChange}
                          variant="outlined"
                          fullWidth
                          disabled={
                            process.env.REACT_APP_PLATFORM_TYPE === "DEPENDENT"
                          }
                          InputProps={{
                            readOnly: !canWrite(),
                          }}
                        />
                      </Grid>
                      <Grid item xs={1}>
                        {process.env.REACT_APP_PLATFORM_TYPE === "DEPENDENT" &&
                          form &&
                          form.id && (
                            <Button
                              className={`whitespace-no-wrap mt-8 mb-16 ${classes.heightButton}`}
                              variant="contained"
                              onClick={handleSync}
                              color="secondary"
                            >
                              <SyncIcon />
                            </Button>
                          )}
                      </Grid>
                    </Grid>

                    <Grid container spacing={1}>
                      <Grid item xs={11}>
                        <TextField
                          className="mt-8 mb-16"
                          id="logoUrl"
                          name="logoUrl"
                          onChange={handleChange}
                          label={T.translate("company.logoUrl")}
                          type="text"
                          value={form.logoUrl}
                          variant="outlined"
                          fullWidth
                          InputProps={{
                            readOnly: !canWrite(),
                          }}
                        />
                      </Grid>
                      <Grid item xs={1}>
                        <Avatar src={form.logoUrl} className={classes.large} />
                      </Grid>
                    </Grid>

                    <TextField
                      className="mt-8 mb-16"
                      id="description"
                      name="description"
                      // onChange={handleChange}
                      label={T.translate("company.description")}
                      type="text"
                      value={form.description}
                      multiline
                      rows={5}
                      error={errorDescription}
                      helperText={errorDescription}
                      onChange={handleDescriptionChange}
                      onBlur={handleDescriptionChange}
                      variant="outlined"
                      fullWidth
                      InputProps={{
                        readOnly: !canWrite(),
                      }}
                    />

                    <FormControlLabel
                      control={
                        <Switch
                          checked={form.active}
                          onChange={handleChange}
                          id="active"
                          name="active"
                          value="active"
                          inputProps={{ "aria-label": "primary checkbox" }}
                          variant="outlined"
                          disabled={!canWrite()}
                        />
                      }
                      label={T.translate("company.active")}
                    />

                    <FormControlLabel
                      control={
                        <Switch
                          checked={form.useGeocodeTranslation}
                          onChange={handleChange}
                          id="useGeocodeTranslation"
                          name="useGeocodeTranslation"
                          value="useGeocodeTranslation"
                          inputProps={{ "aria-label": "primary checkbox" }}
                          variant="outlined"
                          disabled={!canWrite()}
                        />
                      }
                      label={T.translate("company.useGeocodeTranslation")}
                    />
                  </div>
                )}
                {tabValue === 1 && (
                  <Documents dataSource={company} T={T} {...{ user }} />
                )}
                {tabValue === 2 && (
                  <Attributes
                    dataSource={company}
                    T={T}
                    {...{
                      user,
                      specs,
                      setSpecs,
                      specsUpdated,
                      setSpecsUpdated,
                      errorValidate,
                      setErrorValidate,
                    }}
                  />
                )}
                {
                  (
                    tabValue === 3 && 
                    (
                      (company && company.partnerId === null || (company && company.partnerId && company.partnerId.length === 0)) || 
                      props.match.params.companyId === 'new'
                    )
                  ) 
                    && (
                  <Allies dataSource={company} form={ form } T={T} {...{ user, setpartnersToDelete, partnersToDelete, setCompany, specs, setSpecs, specsUpdated, setSpecsUpdated, errorValidate, setErrorValidate, setForm }} />
                )}

                {tabValue === 4 &&
                process.env.REACT_APP_PLATFORM_TYPE === "DEPENDENT" && (
                    <div>
                    <TextField
                        className="mt-8 mb-16"
                        error={!validateUrl(form.primaryLink.url)}
                        helperText={
                        !validateUrl(form.primaryLink.url)
                            ? T.translate("company.wrong_url")
                            : ""
                        }
                        label={T.translate("company.url")}
                        type="text"
                        id="primaryLink.url"
                        name="primaryLink.url"
                        value={form.primaryLink.url.trim()}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                        InputProps={{
                        readOnly: !canWrite(),
                        }}
                    />

                    <TextField
                        className="mt-8 mb-16"
                        id="primaryLink.username"
                        name="primaryLink.username"
                        error={"" !== minMax(form.primaryLink.username.length)}
                        helperText={minMax(form.primaryLink.username.length)}
                        onChange={(event) => {
                        event.target.value = (
                            event.target.value || ""
                        ).toUpperCase();
                        handleChange(event);
                        }}
                        label={T.translate("company.username")}
                        type="text"
                        value={(((form || {}).primaryLink || {}).username || "")
                        .toUpperCase()
                        .trim()}
                        variant="outlined"
                        fullWidth
                        InputProps={{
                        readOnly: !canWrite(),
                        autoComplete: "new-password",
                        }}
                    />

                    <TextField
                        className="mt-8 mb-16"
                        type="password"
                        label={T.translate("company.password")}
                        id="primaryLink.password"
                        name="primaryLink.password"
                        error={"" !== minMax(form.primaryLink.password.length)}
                        helperText={minMax(form.primaryLink.password.length)}
                        value={form.primaryLink.password.trim()}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                        InputProps={{
                        readOnly: !canWrite(),
                        autoComplete: "new-password",
                        }}
                    />
                    <TextField
                        className="mt-8 mb-16"
                        type="text"
                        label={T.translate("company.external_company")}
                        id="primaryLink.companyId"
                        name="primaryLink.companyId"
                        value={form.primaryLink.companyId || ""}
                        onChange={handleChange}
                        disabled
                        variant="outlined"
                        fullWidth
                        InputProps={{
                        readOnly: !canWrite(),
                        }}
                    />
                    <TextField
                        className="mt-8 mb-16"
                        type="text"
                        label={T.translate("company.external_organization")}
                        id="primaryLink.organizationId"
                        name="primaryLink.organizationId"
                        value={form.primaryLink.organizationId || ""}
                        onChange={handleChange}
                        disabled
                        variant="outlined"
                        fullWidth
                        InputProps={{
                        readOnly: !canWrite(),
                        }}
                    />
                    {/* <Button
                        className="whitespace-no-wrap"
                        variant="contained"
                        disabled={!canBeTest()}
                        onClick={handleTest}
                        color='secondary'
                    >
                        {T.translate("company.test")}
                    </Button> */}
                    <Button
                        className="whitespace-no-wrap"
                        variant="contained"
                        disabled={!canBeTest() || canBeSubmitted()}
                        onClick={handleConect}
                        color="secondary"
                    >
                        {T.translate("company.connected")}
                    </Button>
                    </div>
                )}

                {process.env.REACT_APP_PLATFORM_TYPE !== "DEPENDENT" &&
                  tabValue === 4 &&
                  metadataComponent}

                {process.env.REACT_APP_PLATFORM_TYPE !== "DEPENDENT" &&
                    company && ((company.partnerId && company.partnerId.length !== 0)) &&
                    tabValue === 3 &&
                    metadataComponent}

              </div>
            )
          }
          innerScroll
        />
      </form>
    );
}

export default withReducer('CompanyManagement', reducer)(Company);
