import React, { useEffect, useState } from 'react';
import {
    Button, Tab, Tabs, TextField, Icon, Typography, Switch, FormControl, InputLabel, FormControlLabel, MenuItem, Select,
    Grid, Avatar, makeStyles
} from '@material-ui/core';
import { FuseAnimate, FusePageCarded, FuseLoading } from '@fuse';
import { useForm } from '@fuse/hooks';
import { useSubscription, useLazyQuery, useMutation } from "@apollo/react-hooks";
import { Link } from 'react-router-dom';
import _ from '@lodash';
import { useDispatch, useSelector } from 'react-redux';
import * as AppActions from 'app/store/actions';
import withReducer from 'app/store/withReducer';
import * as Actions from '../store/actions';
import reducer from '../store/reducers';
import { MDText } from 'i18n-react';
import i18n from "../i18n";
import { onOrganizationMngOrganizationModified, OrganizationMngOrganization, OrganizationMngParentOrganization, OrganizationMngCreateOrganization, OrganizationMngUpdateOrganization } from "../gql/Organization";
import Error404Page from 'app/main/pages/Error404Page';
import Error500Page from 'app/main/pages/Error500Page';
import { concatMapTo } from 'rxjs/operators';
import { Attributes } from './tabs/Attributes';
import { InteroperableProfileMap } from './tabs/InteroperableProfileMap';

import { ContactInfo, contactInfoFormValidationsGenerator } from "./tabs/contactInformation";
const defaultData = {
    name: '',
    description: '',
    active: true,
    organizations: 'PUBLIC_TRANSPORT',
    logoUrl: '',
    document: "",
    documentType: "",
    primaryLink: {
        url: '',
        username: '',
        password: '',
        organizationId: ''
    },
    interoperableProfileMap:{}, 
    contactInformation: {
        emailAddress: "",
        phoneNumber: "",
        address: "",
        mobilePhoneNumber: "",
        daneLocation: null
    }
};

const ORGANIZATIONS = [
    "PUBLIC_TRANSPORT",
    "PRIVATE_TRANSPORT"
];

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

function Organization(props) {
    const dispatch = useDispatch();
    const classes = useStyles();
    //Logged user
    const user = useSelector(({ auth }) => auth.user);

    //Organization state and GQL 

    const [organization, setOrganization] = useState();
    const gqlOrganizationMngParentOrganization = OrganizationMngParentOrganization({})
    const gqlOrganizationMngOrganization = OrganizationMngOrganization({})
    const [createOrganization, OrganizationMngCreateOrganizationResult] = useMutation(OrganizationMngCreateOrganization({}).mutation);
    const [updateOrganization, OrganizationMngUpdateOrganizationResult] = useMutation(OrganizationMngUpdateOrganization({}).mutation);
    const [refreshOrganization, organizationResult] = useLazyQuery(gqlOrganizationMngOrganization.query,
        { fetchPolicy: gqlOrganizationMngOrganization.fetchPolicy })
    const onOrganizationMngOrganizationModifiedResult = useSubscription(
        ...onOrganizationMngOrganizationModified({ id: props.match.params.organizationId }));
    const [originalOrganization, setOriginalOrganization] = useState();
    const [specs, setSpecs] = useState({});
    const [interoperableProfileMap, setInteroperableProfileMap] = useState({});
    const [specsUpdated, setSpecsUpdated] = useState(false);
    const [interoperableProfileMapUpdated, setInteroperableProfileMapUpdated] = useState(false);
    const [errorValidate, setErrorValidate] = useState([]);

    const [interoperableProfileMapErrorValidate, setInteroperableProfileMapErrorValidate] = useState([]);

    const [OrganizationParent, organizationParentResult] = useLazyQuery(gqlOrganizationMngParentOrganization.query,
        { fetchPolicy: gqlOrganizationMngOrganization.fetchPolicy })

    //UI controls state
    const [tabValue, setTabValue] = useState(0);
    const [errorName, setErrorName] = useState(undefined);
    const { form, handleChange, setForm } = useForm(null);
    const T = new MDText(i18n.get(user.locale));

    //Responsive className
    const full_half = "mt-8 mb-16 w-full p-2 sm:w-1/2";

    useEffect(() => {
        if (organizationResult.data) {
            setSpecsUpdated(false);
            setInteroperableProfileMapUpdated(false);
            const original = organizationResult.data.OrganizationMngOrganization;
            setOriginalOrganization(original);
            setSpecs((original || {}).attributes);
            setInteroperableProfileMap((original || {}).interoperableProfileMap);
            const clone = _.cloneDeep(original);
            clone.type = original.type || 'PUBLIC_TRANSPORT';

            setOrganization(clone);
        }

    }, [organizationResult])

    useEffect(() => {
        if (organizationParentResult.data) {
            if (form.primaryLink.organizationId !== organizationParentResult.data.OrganizationMngParentOrganization.id) {
                setSpecsUpdated(false);
                setInteroperableProfileMapUpdated(false)
                dispatch(AppActions.showMessage({ message: T.translate("organization.sync"), variant: 'success' }));
                setForm({
                    ...form, primaryLink: {
                        ...form.primaryLink,
                        organizationId: organizationParentResult.data.OrganizationMngParentOrganization.id
                    }
                });
            }
            else if (form.primaryLink.organizationId === organizationParentResult.data.OrganizationMngParentOrganization.id) {
                dispatch(AppActions.showMessage({ message: T.translate("organization.no_sync"), variant: 'info' }));
            }

        }
    }, [organizationParentResult])

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
        if (interoperableProfileMap && form) {
            if (!_.isEqual(form.interoperableProfileMap, interoperableProfileMap)) {
                setInteroperableProfileMapUpdated(true);
            } else {
                setInteroperableProfileMapUpdated(false);
            }
        }
    }, [interoperableProfileMap]);

    useEffect(() => {
        const error = organizationParentResult.error;
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
                ? T.translate("organization.network_error")
                : graphQLErrors.length === 0
                    ? message
                    : messageInf
            dispatch(AppActions.showMessage({
                message: errMessage,
                variant: 'error'
            }));
        }
    }, [organizationParentResult.error,])

    useEffect(() => {
        function updateOrganizationState() {
            const params = props.match.params;
            const { organizationId } = params;

            if (organizationId === 'new') {
                setOrganization({ ...defaultData })
                dispatch(Actions.setOrganizationsPage(0));
            } else {
                refreshOrganization({ variables: { id: props.match.params.organizationId } });
            }
        }

        updateOrganizationState();
    }, [dispatch, props.match.params]);

    useEffect(() => {
        if ((organization && !form) || (organization && form && organization.id !== form.id)) {
            setForm({
                ...organization,
                primaryLink: organization.primaryLink || {
                    url: '',
                    username: '',
                    password: '',
                    organizationId: ''
                },
                contactInformation: organization.contactInformation || {
                    emailAddress: "",
                    phoneNumber: "",
                    address: "",
                    mobilePhoneNumber: "",
                    daneLocation: null
                }
            });
        }
    }, [form, organization, setForm]);

    useEffect(() => {
        if (onOrganizationMngOrganizationModifiedResult.data) {
            const { OrganizationMngOrganizationModified } = onOrganizationMngOrganizationModifiedResult.data;
            setForm(OrganizationMngOrganizationModified);
        }
    }, [onOrganizationMngOrganizationModifiedResult.data]);

    useEffect(() => {
        if (OrganizationMngCreateOrganizationResult.data) {
            setOrganization(OrganizationMngCreateOrganizationResult.data.OrganizationMngCreateOrganization)
            props.history.push('/organization-mng/organizations/' + OrganizationMngCreateOrganizationResult.data.OrganizationMngCreateOrganization.id + '/');
            dispatch(AppActions.showMessage({ message: T.translate("organization.create_success"), variant: 'success' }));
        }

    }, [OrganizationMngCreateOrganizationResult])

    useEffect(() => {
        if (OrganizationMngUpdateOrganizationResult.data) {
            setOrganization(OrganizationMngUpdateOrganizationResult.data.OrganizationMngUpdateOrganization)
            dispatch(AppActions.showMessage({ message: T.translate("organization.update_success"), variant: 'success' }));
        }

    }, [OrganizationMngUpdateOrganizationResult])

    useEffect(() => {
        const error = OrganizationMngCreateOrganizationResult.error || onOrganizationMngOrganizationModifiedResult.error;
        if (error) {
            const { graphQLErrors, networkError, message } = error;
            const errMessage = networkError
                ? JSON.stringify(networkError)
                : graphQLErrors.length === 0
                    ? message
                    : graphQLErrors[0].message.name
            dispatch(AppActions.showMessage({
                message: errMessage,
                variant: 'error'
            }));
        }
    }, [OrganizationMngCreateOrganizationResult.error, onOrganizationMngOrganizationModifiedResult.error])

    function validateUrl(url) {
        return (url || '').length === 0 || /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(url);
    }

    function minMax(value) {
        return value != 0 && value < 5 ? T.translate("organization.minimum_characters") : '' || value > 100 ? T.translate("organization.max_characters") : ''
    }

    function handleChangeTab(event, tabValue) {
        setTabValue(tabValue);
    }

    function canWrite() {
        return user.role.includes('ORGANIZATION_WRITE');
    }

    function canBeSubmitted() {
        return (
            canWrite()
            && !OrganizationMngCreateOrganizationResult.loading
            && !OrganizationMngUpdateOrganizationResult.loading
            && form.name.length > 0
            && validateUrl(form.primaryLink.url)
            && !inputValidator(null, true)
            && !minMax(form.primaryLink.username.length)
            && !minMax(form.primaryLink.password.length)
            && !errorName
            && (!_.isEqual(
                { ...originalOrganization, metadata: undefined, name: (originalOrganization || { name: '' }).name.trim().toUpperCase(), },
                { ...form, metadata: undefined, name: form.name.trim().toUpperCase(), }) || specsUpdated || interoperableProfileMapUpdated) && errorValidate.length === 0 && interoperableProfileMapErrorValidate.length === 0
        );
    }

    function canBeTest() {
        if (form.primaryLink) {
            return (
                canWrite()
                && validateUrl(form.primaryLink.url)
                && form.primaryLink.username.length > 5
                && form.primaryLink.password.length > 5
            )
        }
    }
    const valueFocusCleaner = (value) => {
        return value.trim();
    };

    function inputValidator(path, validateAllSchema = false) {
        const validators = {
            documentType: () => {
                const documentType = form.documentType
                if (!documentType) {
                    return { error: true, msg: T.translate("organization.form_validations.documentType.required") }
                }
                return {}
            },
            document: () => {
                const document = form.document;
                const documentType = form.documentType;

                if (!document) {
                    return { error: true, msg: T.translate("organization.form_validations.document.required") }
                }
                if (documentType === "PASSPORT_NUMBER") {
                    const passportRegex = /^(?!^0+$)[A-Z0-9]{6,9}$/;
                    return !passportRegex.test(String(document)) ? { error: true, msg: T.translate("organization.form_validations.document.invalid_format", { EXAM: "49TADY9H3" }) } : {}
                }
                if (documentType === "CITIZENSHIP_CARD") {
                    const citizenRegex = /^[0-9]{5,10}$/;
                    return !citizenRegex.test(String(document)) ? { error: true, msg: T.translate("organization.form_validations.document.invalid_format", { EXAM: "1212121212" }) } : {}
                }
                if (documentType === "IDENTITY_CARD") {
                    const identityCardRegex = /^[0-9]{5,10}$/;
                    return !identityCardRegex.test(String(document)) ? { error: true, msg: T.translate("organization.form_validations.document.invalid_format", { EXAM: "1212121212" }) } : {}
                }
                if (documentType === "FOREIGNER_IDENTITY") {
                    const foreignerIdentityRegex = /^[0-9]{5,10}$/;
                    return !foreignerIdentityRegex.test(String(document)) ? { error: true, msg: T.translate("organization.form_validations.document.invalid_format", { EXAM: "1212121212" }) } : {}
                }
                if (documentType === "NIUP") {
                    const niupCardRegex = /^(?!^0+$)[A-Z0-9]{6,10}$/;
                    return !niupCardRegex.test(String(document)) ? { error: true, msg: T.translate("organization.form_validations.document.invalid_format", { EXAM: "ABC1234567" }) } : {}
                }
                if (documentType === "NIP") {
                    const nipCardRegex = /^[0-9]{6,11}$/;
                    return !nipCardRegex.test(String(document)) ? { error: true, msg: T.translate("organization.form_validations.document.invalid_format", { EXAM: "12121212121" }) } : {}
                }
                if (documentType === "NIT") {
                    const nitRegex = /(^[0-9]+-{1}[0-9]{1})/;
                    return !nitRegex.test(String(document)) ? { error: true, msg: T.translate("organization.form_validations.document.invalid_format", { EXAM: "11223333-1" }) } : {}
                }
                return {}
            },
            contactInformation: {
                emailAddress: () => {
                    const emailAddress = (form.contactInformation || {}).emailAddress
                    if (!emailAddress) {
                        return { error: true, msg: T.translate("organization.form_validations.emailAddress.required") };
                    }
                    if (emailAddress && emailAddress !== "") {
                        const mailRegext = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                        return !mailRegext.test(String(emailAddress).toLowerCase()) ? { error: true, msg: T.translate("organization.form_validations.emailAddress.invalid_format") } : {}
                    }
                    return {}
                },
                phoneNumber: () => {
                    const phoneNumber = (form.contactInformation || {}).phoneNumber
                    if (!phoneNumber) {
                        return { error: true, msg: T.translate("organization.form_validations.phoneNumber.required") };
                    }
                    if (phoneNumber && phoneNumber !== "") {
                        const phoneNumberRegex = /^(\+\d{1,3}\s)\(?\d{1,3}\)?[\s]\d{7}$/;
                        return !phoneNumberRegex.test(String(phoneNumber).toLowerCase()) ? { error: true, msg: T.translate("organization.form_validations.phoneNumber.invalid_format") } : {};
                    }
                    return {};
                },
                address: () => {
                    const address = (form.contactInformation || {}).address
                    if (!address) {
                        return { error: true, msg: T.translate("organization.form_validations.address.required") }
                    }
                    return {}
                },
                mobilePhoneNumber: () => {
                    const mobilePhoneNumber = (form.contactInformation || {}).mobilePhoneNumber;
                    if (!mobilePhoneNumber) {
                        return { error: true, msg: T.translate("organization.form_validations.mobilePhoneNumber.required") }
                    }
                    if (mobilePhoneNumber && mobilePhoneNumber !== "") {
                        const mobilePhoneNumberRegex = /^(\+\d{1,3}\s)\(?\d{3}\)?[\s]\d{7}$/;
                        return !mobilePhoneNumberRegex.test(String(mobilePhoneNumber).toLowerCase()) ? { error: true, msg: T.translate("organization.form_validations.mobilePhoneNumber.invalid_format") } : {};
                    }
                    return {};
                },
                daneLocation: () => {
                    const daneLocation = (form.contactInformation || {}).daneLocation
                    if (!daneLocation) {
                        return { error: true, msg: T.translate("organization.form_validations.daneLocation.required") };
                    }
                    return {}
                }
            }
        }

        if (validateAllSchema) return validateFullSchema(validators);
        if (path) {
            const validateResult = deepFind(validators, path)
            return typeof validateResult === "function" ? validateResult() : {};
        }


    }
    function validateFullSchema(obj) {
        return Object.keys(obj).some(key => {
            if (typeof obj[key] === 'object') return validateFullSchema(obj[key])
            if (typeof obj[key] === 'function') {
                const validateResult = obj[key]();
                if (validateResult.error) {
                    return true;
                } else {
                    return false;
                }
            }
        })
    }

    function deepFind(obj, path) {
        const paths = path.split('.');
        let current = obj;

        for (let i = 0; i < paths.length; ++i) {
            if (current[paths[i]] == undefined) {
                return undefined;
            } else {
                current = current[paths[i]];
            }
        }
        return current;
    }
    function handleSave() {
        const { id } = form;
        delete form.organizations;
        if (id === undefined) {
            createOrganization({ variables: { input: { ...form, attributes: specs, interoperableProfileMap,name: form.name.trim().toUpperCase() } } });
        } else {
            updateOrganization({
                variables: {
                    id, input: {
                        ...form,
                        name: form.name.trim().toUpperCase(),
                        id: undefined,
                        __typename: undefined,
                        metadata: undefined,
                        attributes: specs,
                        interoperableProfileMap,
                        primaryLink: { ...form.primaryLink, __typename: undefined },
                        contactInformation: { ...form.contactInformation, __typename: undefined, daneLocation: { ...((form.contactInformation || {}).daneLocation || {}), __typename: undefined } },
                    }, merge: true
                }
            });
        }
    }

    // function testWebService(url, user, psw) {
    //     let headers = new Headers();
    //     headers.set(
    //         "Authorization",
    //         "Basic " + window.btoa(user + ":" + psw)
    //     );
    //     fetch(url, {
    //         method: "GET",
    //         headers: headers
    //         //credentials: 'user:passwd'
    //     })
    //         .then(response => {
    //             //mostrar aviso ok/errro con la rzon traducida del statusCode
    //             const statusCode = response.status;
    //             if (statusCode === 401) {
    //                 dispatch(AppActions.showMessage({ message: `Error: ${statusCode} ${T.translate("organization.test_connection_error_401")}`, variant: 'error' }));
    //             } else if (statusCode === 404) {
    //                 dispatch(AppActions.showMessage({ message: `Error: ${statusCode} ${T.translate("organization.test_connection_error_404")}`, variant: 'error' }));
    //             } else {
    //                 dispatch(AppActions.showMessage({ message: T.translate("organization.test_connection_success"), variant: 'success' }));
    //             }
    //         })
    //         .catch(function (error) {
    //             //mostrar ERROR con razoon: e.toString()
    //             console.log("ENTRA0", `Error: ${error.message}-`)
    //             dispatch(AppActions.showMessage({ message: `${T.translate("organization.test_fetch_error")}`, variant: 'error' }));

    //         });
    // };

    function handleTest() {
        //testWebService(form.primaryLink.url + "/vehicle-quota", form.primaryLink.username, form.primaryLink.password, form.primaryLink.organizationId)
        OrganizationParent({ variables: { organizationId: user.selectedOrganization.id } })
    }


    function handleNameChange(event) {
        const newVal = event.target.value.trim().toUpperCase();
        if (!newVal) {
            setErrorName(T.translate("organization.errors.name.required_field"));
        } else if (newVal.length < 3) {
            setErrorName(T.translate("organization.errors.name.min_chars"));
        } else if (newVal.length > 100) {
            setErrorName(T.translate("organization.errors.name.max_chars"));
        } else if (newVal) {
            const nameRegex = /^[A-Z0-9-_ .,]{3,100}$/gm;
            // /^[A-Z0-9][ A-Z0-9]+[A-Z0-9]$/
            setErrorName(!nameRegex.test(newVal) ? T.translate("organization.errors.name.invalid_format") : undefined);
        }

        handleChange(event)
    }

    const gqlError = organizationResult.error || OrganizationMngCreateOrganizationResult.error || OrganizationMngUpdateOrganizationResult.error;
    if (gqlError) {
        const firstErrorMessage = gqlError.graphQLErrors[0].message;
        if (((firstErrorMessage || {}).code || 0) < 6018 && (!firstErrorMessage.includes || !firstErrorMessage.includes("Cannot return null"))) {
            return (<Error500Page message={T.translate("organization.internal_server_error")}
                description={gqlError.graphQLErrors.map(e => `@${e.path[0]} => code ${e.message.code}: ${e.message.name}`)} />);
        } else if (((firstErrorMessage || {}).code || 0) >= 6018) {
            dispatch(AppActions.showMessage({ message: T.translate(`${firstErrorMessage.code}`), variant: 'error' }));
        }
    }

    if (organizationResult.loading) {

        return (<FuseLoading />);
    }

    if (props.match.params.organizationId !== "new" && !organizationResult.data) {
        return (<Error404Page message={T.translate("organization.not_found")} />);
    }

    const metadataComponent = form && (
        <div>
            <form autoComplete="off">
                <TextField
                    className={full_half}
                    error={form.name === ''}
                    label={T.translate("organization.metadata.createdBy")}
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
                    className={full_half}
                    error={form.name === ''}
                    label={T.translate("organization.metadata.createdAt")}
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
                    className={full_half}
                    error={form.name === ''}
                    label={T.translate("organization.metadata.updatedBy")}
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
                    className={full_half}
                    error={form.name === ''}
                    label={T.translate("organization.metadata.updatedAt")}
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

    return <form autoComplete="off" className={`${classes.formAutocomplete}`}>
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
                                <Typography className="normal-case flex items-center sm:mb-12" component={Link} role="button" to="/organization-mng/organizations" color="inherit">
                                    <Icon className="mr-4 text-20">arrow_back</Icon>
                                    {T.translate("organization.organizations")}
                                </Typography>
                            </FuseAnimate>

                            <div className="flex items-center max-w-full">
                                <FuseAnimate animation="transition.expandIn" delay={300}>
                                    <Icon className="text-32 mr-0 sm:text-48 mr-12">business</Icon>
                                </FuseAnimate>

                                <div className="flex flex-col min-w-0">
                                    <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                                        <Typography className="text-16 sm:text-20 truncate">
                                            {form.name ? form.name.toUpperCase() : T.translate("organization.new_organization")}
                                        </Typography>
                                    </FuseAnimate>
                                    <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                                        <Typography variant="caption">{T.translate("organization.organization_detail")}</Typography>
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
                                {T.translate("organization.save")}
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
                    <Tab className="h-64 normal-case" label={T.translate("organization.basic_info")} />

                    <Tab className="h-64 normal-case" label={T.translate("organization.attributes")} />

                    <Tab className="h-64 normal-case" label={T.translate("organization.interoperableProfileMap")} />
                    {(process.env.REACT_APP_PLATFORM_TYPE === "DEPENDENT") && <Tab className="h-64 normal-case" label={T.translate("organization.primary_link")} />}

                    {(form && form.metadata) && (<Tab className="h-64 normal-case" label={T.translate("organization.metadata_tab")} />)}

                </Tabs>
            }
            
            content={
                form && (
                    <div className="p-16 sm:p-24 max-w-2xl">
                        {tabValue === 0 &&
                            (
                                <div>

                                    <TextField
                                        className={`mt-8 mb-16 ${classes.textForm}`}
                                        error={errorName}
                                        helperText={errorName}
                                        required
                                        label={T.translate("organization.name")}
                                        id="name"
                                        name="name"
                                        value={form.name}
                                        onChange={handleNameChange}
                                        onBlur={(evt) => {
                                            evt.target.value = valueFocusCleaner(evt.target.value)
                                            handleNameChange(evt)
                                        }}
                                        variant="outlined"
                                        fullWidth
                                        InputProps={{
                                            readOnly: !canWrite(),
                                        }}
                                    />
                                    <TextField
                                        select
                                        label={T.translate("organization.organizationEnum")}
                                        value={form.type || '---'}
                                        onChange={({ target: { value } }) => { setForm({ ...form, type: value }); }}
                                        variant="outlined"
                                        autoComplete={'off'}
                                        fullWidth
                                        InputProps={{
                                            readOnly: !canWrite(),
                                        }}
                                    >
                                        {
                                            ORGANIZATIONS.map(i => <MenuItem key={i} value={i}> {T.translate(`organization.organizationsEnum.${i}`)} </MenuItem>)
                                        }

                                    </TextField>
                                    <ContactInfo {...{ form, setForm, T, handleChange, canWrite, valueFocusCleaner, inputValidator }} />
                                    <Grid container spacing={1}>
                                        <Grid item xs={11}>
                                            <TextField
                                                className="mt-8 mb-16"
                                                id="logoUrl"
                                                name="logoUrl"
                                                onChange={handleChange}
                                                label={T.translate("organization.logoUrl")}
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
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={form.active}
                                                onChange={handleChange}
                                                id="active"
                                                name="active"
                                                value="active"
                                                inputProps={{ 'aria-label': 'primary checkbox' }}
                                                variant="outlined"
                                                disabled={!canWrite()}
                                            />
                                        }
                                        label={T.translate("organization.active")}
                                    />
                                    <TextField
                                        className="mt-8 mb-16"
                                        id="description"
                                        name="description"
                                        onChange={handleChange}
                                        label={T.translate("organization.description")}
                                        type="text"
                                        value={form.description}
                                        multiline
                                        rows={5}
                                        variant="outlined"
                                        fullWidth
                                        InputProps={{
                                            readOnly: !canWrite(),
                                        }}
                                    />
                                </div>
                            )}
                        {tabValue === 1 &&
                            <Attributes dataSource={organization} T={T} {...{ user, specs, setSpecs, specsUpdated, setSpecsUpdated, errorValidate, setErrorValidate, tabValue}} />
                        }
                        {tabValue === 2 &&
                            <InteroperableProfileMap dataSource={organization} T={T} {...{ user, interoperableProfileMap, setInteroperableProfileMap, interoperableProfileMapUpdated, setInteroperableProfileMapUpdated, interoperableProfileMapErrorValidate, setInteroperableProfileMapErrorValidate, tabValue}} />
                        }
                        {tabValue === 4 && (process.env.REACT_APP_PLATFORM_TYPE === "DEPENDENT") &&
                            (
                                <div>
                                    <TextField
                                        className="mt-8 mb-16"
                                        error={!validateUrl(form.primaryLink.url)}
                                        helperText={!validateUrl((form.primaryLink.url)) ? T.translate("organization.invalid_url") : ''}
                                        label={T.translate("organization.primaryLink.URL_External_Api")}
                                        id="primaryLink.url"
                                        name="primaryLink.url"
                                        value={form.primaryLink.url}
                                        onChange={(evt) => {
                                            evt.target.value = (evt.target.value || "").trim()
                                            handleChange(evt);
                                        }}
                                        variant="outlined"
                                        fullWidth
                                        InputProps={{
                                            readOnly: !canWrite(),
                                            autoComplete: 'off'
                                        }}
                                    />

                                    <TextField
                                        className="mt-8 mb-16"
                                        error={'' !== minMax(form.primaryLink.username.length)}
                                        id="primaryLink.username"
                                        name="primaryLink.username"
                                        helperText={minMax(form.primaryLink.username.length)}
                                        onChange={(evt) => {
                                            evt.target.value = (evt.target.value || "").toUpperCase().trim()
                                            handleChange(evt);
                                        }}
                                        label={T.translate("organization.primaryLink.username")}
                                        type="text"
                                        value={(((form || {}).primaryLink || {}).username || '').toUpperCase().trim()}
                                        variant="outlined"
                                        fullWidth
                                        autoComplete='off'
                                        InputProps={{
                                            readOnly: !canWrite(),
                                            autoComplete: 'new-password'
                                        }}
                                    />
                                    <TextField
                                        className="mt-8 mb-16"
                                        error={'' !== minMax(form.primaryLink.password.length)}
                                        id="primaryLink.password"
                                        name="primaryLink.password"
                                        helperText={minMax(form.primaryLink.password.length)}
                                        onChange={(evt) => {
                                            evt.target.value = (evt.target.value || "").trim()
                                            handleChange(evt);
                                        }}
                                        label={T.translate("organization.primaryLink.password")}
                                        type="password"
                                        autoComplete='off'
                                        value={form.primaryLink.password.trim()}
                                        variant="outlined"
                                        fullWidth
                                        InputProps={{
                                            readOnly: !canWrite(),
                                            autoComplete: 'new-password'
                                        }}
                                    />
                                    <TextField
                                        className="mt-8 mb-16"
                                        id="primaryLink.organizationId"
                                        name="primaryLink.organizationId"
                                        onChange={handleChange}
                                        label={T.translate("organization.primaryLink.organizationId")}
                                        type="text"
                                        value={form.primaryLink.organizationId || ''}
                                        disabled={true}
                                        variant="outlined"
                                        fullWidth
                                        InputProps={{
                                            readOnly: !canWrite(),
                                        }}
                                    />

                                    <FuseAnimate animation="transition.slideRightIn" delay={300}>
                                        <Button
                                            className="whitespace-no-wrap"
                                            variant="contained"
                                            onClick={handleTest}
                                            disabled={(!canBeTest() || canBeSubmitted())}
                                            color="secondary"
                                        >
                                            {T.translate("organization.test_connection")}
                                        </Button>
                                    </FuseAnimate>

                                </div>
                            )}

                        {(process.env.REACT_APP_PLATFORM_TYPE === "DEPENDENT" && tabValue === 4) && metadataComponent}

                        {(process.env.REACT_APP_PLATFORM_TYPE !== "DEPENDENT" && tabValue === 3) && metadataComponent}



                    </div>
                )
            }
            innerScroll
        />
    </form>
}

export default withReducer('OrganizationManagement', reducer)(Organization);
