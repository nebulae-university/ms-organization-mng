import React, { useEffect, useState } from 'react';
import { Button, Tab, Tabs, TextField, FormControl, Select, MenuItem, Icon, Typography, Switch, FormControlLabel, LinearProgress, makeStyles, Avatar } from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import { FuseAnimate, FusePageCarded, FuseLoading } from '@fuse';
import { useForm } from '@fuse/hooks';
import { useSubscription, useLazyQuery, useMutation } from "@apollo/react-hooks";
import { Link } from 'react-router-dom';
import _ from '@lodash';
import DateFnsUtils from '@date-io/date-fns';
import { useDispatch, useSelector } from 'react-redux';
import withReducer from 'app/store/withReducer';
import * as Actions from '../store/actions';
import * as AppActions from 'app/store/actions';
import reducer from '../store/reducers';
import { MDText } from 'i18n-react';
import i18n from "../i18n";
import enLocale from "date-fns/locale/en-US";
import esLocale from "date-fns/locale/es";
import {
    onOrganizationMngUserModified, OrganizationMngUser, OrganizationMngCreateUser, OrganizationMngUpdateUser,
    OrganizationMngRoleListing, OrganizationMngCreateUserAuth, OrganizationMngDeleteUserAuth, OrganizationMngUpdateUserAuthPassword,
    UserMngCompanyListing, OrganizationMngUpdatePhoto
} from "../gql/User";
//import { OrganizationMngCompanyListing } from "../gql/Company";
import Error404Page from 'app/main/pages/Error404Page';
import Error500Page from 'app/main/pages/Error500Page';
import CreateAuthDialog from './CreateAuthDialog';
import { Photo } from './userPhoto';
import { use } from 'react';

const localeMap = {
    en_US: enLocale,
    es_CO: esLocale,
};

const defaultData = {
    companyId: '',
    companyIds: [],
    roles: [],
    firstName: "",
    lastName: "",
    emailAddress: "",
    documentId: "",
    phoneNumber: "",
    active: true,
    preferences: {
        locale: "es_CO",
        timezone: "America/Mexico_City"
    },
    regulatoryCompliance: {
        driverLicenseNumber: "",
        driverLicenseCategory: "",
        driverLicenseExpeditionDate: Date.now(),
        driverLicenseExpirationDate: Date.now(),
        mandatoryHealthPlanNumber: "",
        mandatoryHealthPlanIssuer: "",
        mandatoryHealthPlanExpeditionDate: Date.now(),
        mandatoryHealthPlanExpirationDate: Date.now(),
        occupationalRiskAdministratorNumber: "",
        occupationalRiskAdministratorIssuer: "",
        occupationalRiskAdministratorExpeditionDate: Date.now(),
        occupationalRiskAdministratorExpirationDate: Date.now(),
        typeVehicles: [],
    },
    auth: undefined,
    profilePicture: undefined
};

const useStyles = makeStyles((theme) => ({
    textForm: {
        '& input': {
            textTransform: "uppercase"
        }

    },
    large: {
        width: '90px',
        height: '90px',
    }
}));

function User(props) {
    //Redux dispatcher
    const dispatch = useDispatch();

    // current logged user
    const logedUser = useSelector(({ auth }) => auth.user);

    // User DATA
    const gqlCompaniesListing = UserMngCompanyListing({});
    const [user, setUser] = useState();
    const classes = useStyles();
    const gqlOrganizationMngUser = OrganizationMngUser({ id: props.match.params.userId });
    const [refreshUser, userResult] = useLazyQuery(gqlOrganizationMngUser.query, { fetchPolicy: gqlOrganizationMngUser.fetchPolicy })
    const [updatePhoto, updatePhotoResult] = useMutation(OrganizationMngUpdatePhoto({}).mutation);
    const [createUser, createUserResult] = useMutation(OrganizationMngCreateUser({}).mutation);
    const [updateUser, updateUserResult] = useMutation(OrganizationMngUpdateUser({}).mutation);
    const onOrganizationMngUserModifiedResult = useSubscription(...onOrganizationMngUserModified({ id: props.match.params.userId }));
    const [companyOptions, setCompanyOptions] = useState();
    const [queryCompanies, queryCompaniesResult] = useLazyQuery(gqlCompaniesListing.query, { fetchPolicy: gqlCompaniesListing.fetchPolicy })

    //User Auth Creation and commands
    const [createUserAuth, createUserAuthResult] = useMutation(OrganizationMngCreateUserAuth({}).mutation);
    const [updateUserAuthPassword, updateUserAuthPasswordResult] = useMutation(OrganizationMngUpdateUserAuthPassword({}).mutation);
    const [deleteUserAuth, deleteUserAuthResult] = useMutation(OrganizationMngDeleteUserAuth({}).mutation);

    //Companies Autocomplete
    // const { query: CompanyListingQuery, fetchPolicy: CompanyListingQueryFetchPolicy } = OrganizationMngCompanyListing({});
    // const [refreshCompanyListing, companyListingResult] = useLazyQuery(CompanyListingQuery, { fetchPolicy: CompanyListingQueryFetchPolicy })
    // const [selectedCompanies, setSelectedCompanies] = useState([]);

    //Roles Autocomplete
    const { query: RoleListingQuery, fetchPolicy: RoleListingQueryFetchPolicy } = OrganizationMngRoleListing();
    const [refreshRoleListing, roleListingResult] = useLazyQuery(RoleListingQuery, { fetchPolicy: RoleListingQueryFetchPolicy })
    const [selectedRoles, setSelectedRoles] = useState([]);
    const roleFilterOptions = createFilterOptions({
        stringify: role => {
            return T.translate(`user.role_groups.${role.name}`)
        }
    });

    //UI controls states
    const [tabValue, setTabValue] = useState(0);
    const [companyIds, setCompanyIds] = useState([]);
    const [disabledCompanies, setDisabledCompanies] = useState([]);
    // const [companyObj, setCompanyObj] = useState('');
    const [errorPassword, setErrorPassword] = useState(undefined);
    const [errorPhone, setErrorPhone] = useState(undefined);
    const [errorName, setErrorName] = useState(undefined);
    const [errorLastName, setErrorLastName] = useState(undefined);
    const [errorEmail, setErrorEmail] = useState(undefined);
    const [errorDocument, setErrorDocument] = useState(undefined);
    const [errorDriveLicense, setErrorDriveLicense] = useState(undefined);
    const [errorDriveLicenseCategory, setErrorDriveLicenseCategory] = useState(undefined);
    const [errorMandatoryHealthPlanNumber, setErrorMandatoryHealthPlanNumber] = useState(undefined);
    const [errorMandatoryHealthPlanIssuer, setErrorMandatoryHealthPlanIssuer] = useState(undefined);
    const [errorLicenseExpedition, setErrorLicenseExpedition] = useState(undefined);
    const [errorLicenseExpiration, setErrorLicenseExpiration] = useState(undefined);
    const [errorMandatoryHealthPlanExpedition, setErrorMandatoryHealthPlanExpedition] = useState(undefined);
    const [errorMandatoryHealthPlanExpiration, setErrorMandatoryHealthPlanExpiration] = useState(undefined);
    const [resetPasswordControl, setResetPasswordControl] = useState({ psw: "", pswConfirmation: "" });
    const { form, handleChange, setForm } = useForm(null);
    const [profilePicture, setProfilePicture] = useState();
    const [firstTimeCalled, setFirstTimeCalled] = useState(false);
    const [roleMapName, setRoleMapName] = useState([]);

    const [errorOccupationalRiskAdministratorNumber, setErrorOccupationalRiskAdministratorNumber] = useState(undefined);
    const [errorOccupationalRiskAdministratorIssuer, setErrorOccupationalRiskAdministratorIssuer] = useState(undefined);
    const [errorOccupationalRiskAdministratorExpedition, setErrorOccupationalRiskAdministratorExpedition] = useState(undefined);
    const [errorOccupationalRiskAdministratorExpiration, setErrorOccupationalRiskAdministratorExpiration] = useState(undefined);
    //Translate service
    const T = new MDText(i18n.get(logedUser.locale));

    //#region USEFFECT

    useEffect(() => {
        if (userResult.data && !userResult.loading && !firstTimeCalled) {
            const currentData = userResult.data.OrganizationMngUser;
            setFirstTimeCalled(true);
            setUser({ ...currentData, companyIds: (currentData.companyIds || logedUser.data.companyIds) || []/* , companyObj: currentData.companyObj */ });
            setProfilePicture(currentData.profilePicture);
        }

    }, [userResult])

    //fires the query once the user stop typing the keyword
    useEffect(() => {
        if (logedUser.selectedOrganization)
            queryCompanies({ variables: { paginationInput: { page: 0, count: 100, queryTotalResultCount: false }, filterInput: { active: true, organizationId: logedUser.selectedOrganization.id } } });
    }, [logedUser]);


    useEffect(() => {
        if (form && !roleListingResult.loading && roleListingResult.data.OrganizationMngRoleListing) {
            const roleIds = form.roles || [];
            const defaultRoles = roleIds.map(cid => {
                const r = roleListingResult.data.OrganizationMngRoleListing.filter(c => c.id === cid)[0];
                return r ? r : { id: cid, name: "???" }
            });
            setSelectedRoles(defaultRoles);
        }
    }, [form, roleListingResult.data]);

    useEffect(() => {

        if (form && !queryCompaniesResult.loading && queryCompaniesResult.data) {
            const options = [...queryCompaniesResult.data.UserMngCompanyListing.listing.map(({ id, name, number, active, partners }) => ({ id, name, number, active, partners }))];
            setCompanyOptions(options);
        }

    }, [form, queryCompaniesResult.data])




    useEffect(() => {
        function updateUserState() {
            const params = props.match.params;
            const { userId } = params;
            if (logedUser.selectedOrganization && logedUser.selectedOrganization.id) {
                //refreshCompanyListing({ variables: { filterInput: { organizationId: logedUser.selectedOrganization.id } } });
                refreshRoleListing();
                if (userId !== 'new') {
                    if (logedUser.selectedOrganization.id !== "") {
                        setFirstTimeCalled(false);
                        refreshUser({ variables: { organizationId: logedUser.selectedOrganization.id, id: userId } });
                    }
                } else {
                    setUser({ ...defaultData, organizationId: logedUser.selectedOrganization.id })
                    dispatch(Actions.setUsersPage(0));
                }
            }

        }
        updateUserState();
    }, [dispatch, props.match.params, logedUser.selectedOrganization]);

    useEffect(() => {
        if ((user && !form) || (user && form && user.id !== form.id)) {
            const occupationalRiskAdministratorNumber = user.regulatoryCompliance.occupationalRiskAdministratorNumber || "";
            const occupationalRiskAdministratorIssuer = user.regulatoryCompliance.occupationalRiskAdministratorIssuer || "";
            const occupationalRiskAdministratorExpeditionDate = user.regulatoryCompliance.occupationalRiskAdministratorExpeditionDate || Date.now();
            const occupationalRiskAdministratorExpirationDate = user.regulatoryCompliance.occupationalRiskAdministratorExpirationDate || Date.now();

            if (user.companyIds) {
                setForm({
                    ...user,
                    companyIds: user.companyIds || logedUser.data.companyIds,
                    regulatoryCompliance: user.regulatoryCompliance ? { ...user.regulatoryCompliance, occupationalRiskAdministratorNumber, occupationalRiskAdministratorIssuer, occupationalRiskAdministratorExpeditionDate, occupationalRiskAdministratorExpirationDate } : defaultData.regulatoryCompliance
                });

                // setCompanyIds(((user || {}).companyObj || []).map(element => element._id))
                setCompanyIds(user.companyIds || [])
                // setCompanyObj(user.companyObj)
            }
            else if (logedUser.data.companyIds) {
                setForm({
                    ...user,
                    companyIds: user.companyIds || logedUser.data.companyIds,
                    regulatoryCompliance: user.regulatoryCompliance ? { ...user.regulatoryCompliance, occupationalRiskAdministratorNumber, occupationalRiskAdministratorIssuer, occupationalRiskAdministratorExpeditionDate, occupationalRiskAdministratorExpirationDate } : defaultData.regulatoryCompliance
                });
                setCompanyIds(logedUser.data.companyIds || [])
                // setCompanyObj(user.companyObj)
            }
            else {
                setForm({
                    ...user,
                    regulatoryCompliance: user.regulatoryCompliance ? { ...user.regulatoryCompliance, occupationalRiskAdministratorNumber, occupationalRiskAdministratorIssuer, occupationalRiskAdministratorExpeditionDate, occupationalRiskAdministratorExpirationDate } : defaultData.regulatoryCompliance
                });
            }
        }
    }, [form, user, setForm]);

    useEffect(() => {
        if (updatePhotoResult.data && !updatePhotoResult.loading) {
            const { code } = updatePhotoResult.data.OrganizationMngUpdatePhoto;
            if (code === 200) {
                dispatch(AppActions.showMessage({
                    message: `La foto de perfil se actualizó correctamente`,
                    variant: 'success'
                }));
            }
        }
    }, [updatePhotoResult]);

    useEffect(() => {
        if (form && !roleListingResult.loading && roleListingResult.data.OrganizationMngRoleListing) {
            const roleIds = form.roles || [];
            const defaultRoles = roleIds.map(cid => {
                const r = roleListingResult.data.OrganizationMngRoleListing.filter(c => c.id === cid)[0];
                return r ? r : { id: cid, name: "???" }
            });
            setSelectedRoles(defaultRoles);
        }
    }, [form, roleListingResult.data]);

    useEffect(() => {
        if (onOrganizationMngUserModifiedResult.data) {
            const { OrganizationMngUserModified } = onOrganizationMngUserModifiedResult.data;
            setForm({ ...OrganizationMngUserModified, companyIds: form.companyIds });
            setUser({ ...OrganizationMngUserModified, companyIds: user.companyIds })
        }
    }, [onOrganizationMngUserModifiedResult.data]);


    useEffect(() => {
        if (createUserResult.data && createUserResult.data.OrganizationMngCreateUser) {
            const id = createUserResult.data.OrganizationMngCreateUser.id;
            // setCompanyObj(companyOptions.filter(({ id }) => companyIds.includes(id)).map(el => ({...el, _id: el.id})));
            setUser(createUserResult.data.OrganizationMngCreateUser)
            props.history.push('/user-mng/users/' + id + '/');
            dispatch(AppActions.showMessage({ message: T.translate("user.create_success"), variant: 'success' }));
        }

    }, [createUserResult])

    useEffect(() => {
        if (updateUserResult.data) {
            setUser(updateUserResult.data.OrganizationMngUpdateUser);
            setForm(updateUserResult.data.OrganizationMngUpdateUser);
            dispatch(AppActions.showMessage({ message: T.translate("user.update_success"), variant: 'success' }));
        }

    }, [updateUserResult])

    useEffect(() => {
        const error = createUserResult.error || updateUserResult.error;
        if (error) {
            const { graphQLErrors } = error;
            if (graphQLErrors[0].message.code && graphQLErrors[0].message.code === 11000) {
                dispatch(AppActions.showMessage({ message: T.translate(`users.errors.${graphQLErrors[0].message.code}`), variant: 'error' }));
                setErrorEmail(true)

            }
            if (graphQLErrors[0].message.code && graphQLErrors[0].message.code === 11001) {
                dispatch(AppActions.showMessage({ message: T.translate(`users.errors.${graphQLErrors[0].message.code}`), variant: 'error' }));
                setErrorDocument(true)
            }

        }
    }, [createUserResult.error, updateUserResult.error])


    //keycloack Errors
    useEffect(() => {
        const error = createUserAuthResult.error || updateUserAuthPasswordResult.error || deleteUserAuthResult.error
        if (error) {
            const { graphQLErrors: [{ message: { msg } }] } = error;
            handleKeyCloakError(msg)
        }

    }, [createUserAuthResult.error, updateUserAuthPasswordResult.error, deleteUserAuthResult.error])


    useEffect(() => {
        const companyOptionsSelected = companyIds.map(companyId =>
            (companyOptions || []).find(companyOption => {
                return companyOption.id === companyId
            })
        );
        const companiesAlreadyTaken = companyOptionsSelected.flatMap(companyOptionSelected => (companyOptionSelected || {}).partners || []);
        const companiesAlreadyTakenWithoutDuplicates = [...(new Set(companiesAlreadyTaken))];
        setDisabledCompanies(companiesAlreadyTakenWithoutDuplicates);
    }, [companyIds, companyOptions]);

    useEffect(() => {
        if (form && !form.roleMapName && roleListingResult.data) {
            const roleListing = roleListingResult.data.OrganizationMngRoleListing;;
            const roleIds = form.roles;
            const roleMap = [];
            if (roleIds.length > 0) {
                for (let i = 0; i < roleIds.length; i++) {
                    const roleData = roleListing.find(role => role.id === roleIds[i]);
                    if ((roleData || {}).name) roleMap.push((roleData || {}).name);
                }
            }
            setForm({ ...form, roleMapName: roleMap })
            setUser({ ...user, roleMapName: roleMap })
        }
    }, [form, roleListingResult]);
    //#endregion

    function handleChangeTab(event, tabValue) {
        setTabValue(tabValue);
    }

    function canWrite() {
        return logedUser.role.includes('USER_WRITE');
    }

    function canBeSubmitted() {
        return (
            !createUserResult.loading &&
            !updateUserResult.loading &&
            !errorPhone &&
            !errorName &&
            !errorLastName &&
            !errorEmail &&
            !errorDocument &&
            !errorLicenseExpedition &&
            !errorLicenseExpiration &&
            !errorMandatoryHealthPlanExpedition &&
            !errorMandatoryHealthPlanExpiration &&
            !errorDriveLicense &&
            !errorMandatoryHealthPlanIssuer &&
            !errorMandatoryHealthPlanNumber &&
            !errorDriveLicenseCategory &&
            !errorOccupationalRiskAdministratorExpedition &&
            !errorOccupationalRiskAdministratorExpiration &&
            !errorOccupationalRiskAdministratorIssuer &&
            !errorOccupationalRiskAdministratorNumber &&
            form.documentId &&
            form.firstName &&
            form.lastName &&
            form.emailAddress &&
            !_.isEqual({
                ...user,
                metadata: undefined,
                firstName: user.firstName.trim().toUpperCase(),
                lastName: user.lastName.trim().toUpperCase(),
                profilePicture: undefined,
            },
                {
                    ...form,
                    metadata: undefined,
                    firstName: form.firstName.trim().toUpperCase(),
                    lastName: form.lastName.trim().toUpperCase(),
                    profilePicture: undefined,
                }
            ) &&
            canWrite()
        );
    }

    function handleSave() {
        const { id } = form;

        if (id === undefined) {
            createUser({
                variables: {
                    input:
                    {
                        ...form,
                        firstName: form.firstName.trim().toUpperCase(),
                        lastName: form.lastName.trim().toUpperCase(),
                        organizationId: logedUser.selectedOrganization.id
                    }
                }
            }
            );
        } else {
            updateUser({
                variables: {
                    id, input: {
                        ...form,
                        id: undefined,
                        __typename: undefined,
                        metadata: undefined,
                        lastLoginDate: undefined,
                        profilePicture: undefined,
                        firstName: form.firstName.trim().toUpperCase(),
                        lastName: form.lastName.trim().toUpperCase(),
                        preferences: { ...form.preferences, __typename: undefined },
                        regulatoryCompliance: { ...form.regulatoryCompliance, __typename: undefined },
                        auth: undefined,
                    }, merge: true
                }
            });
        }
    }

    function handleKeyCloakError(msg) {
        switch (msg) {
            case "User exists with same username":
                dispatch(AppActions.showMessage({ message: T.translate(`users.errors.${409}`), variant: 'error' }));
                break;
            default:
                dispatch(AppActions.showMessage({ message: T.translate(`users.errors.${404}`), variant: 'error' }));
                break;
        }
    }


    function handleRolesChange(evt, selectedRoles) {
        const newSelectedRoles = selectedRoles.map(roles => {
            if (roles.type) {
                return roles.type;
            } else {
                return roles
            }
        });
        if (!canWrite()) return;
        setForm({ ...form, roles: newSelectedRoles.map(c => c.id), roleMapName: newSelectedRoles.map(c => c.name) });
    }

    function handleAuthCreation(username) {
        createUserAuth({ variables: { userId: form.id, username } });
    }
    function handleAuthDeletion() {
        deleteUserAuth({ variables: { userId: form.id } });
    }
    function handleAuthPasswordReset() {
        if (isResetPasswordValid()) {
            updateUserAuthPassword({ variables: { userId: form.id, password: resetPasswordControl.psw, temporary: true } });
            setResetPasswordControl({ psw: "", pswConfirmation: "" });
        }
    }

    // function isResetPasswordValid() {
    //     return (
    //         resetPasswordControl.psw.length > 0 &&
    //         resetPasswordControl.psw.length > 3 &&
    //         resetPasswordControl.psw === resetPasswordControl.pswConfirmation
    //     );
    // }

    //  Validar si puede puede usar reglex para validar el password

    


    function isResetPasswordValid() {
        if (resetPasswordControl.psw.length === 0 || resetPasswordControl.pswConfirmation.length === 0) {
            return false;
        }
        if (resetPasswordControl.psw.length < 4 || resetPasswordControl.pswConfirmation.length < 4) {
            return false;
        }
        if (resetPasswordControl.psw !== resetPasswordControl.pswConfirmation) {
            return false;
        } 
        
        if (logedUser.selectedOrganization.attributes.public) {
            const password = resetPasswordControl.psw;
            const regular = logedUser.selectedOrganization.attributes.public.userPasswordRegex;
    
            if (!regular) {
                console.warn("⚠️ No existe la expresión regular para validar el password");
            }
    
            const passwordRegex = new RegExp(regular);
            const passwordIsValid = passwordRegex.test(password);
            
            if (!passwordIsValid) {

                return false;
            }
        }
        

        return true;
    }
    
    useEffect(() => {



        if (resetPasswordControl.psw.length === 0 && resetPasswordControl.pswConfirmation.length === 0) {
            setErrorPassword("");
        } else if (resetPasswordControl.psw.length < 4 && resetPasswordControl.pswConfirmation.length < 4) {
            setErrorPassword(T.translate("user.form_validations.password.min_chars"));
        } else if (resetPasswordControl.psw !== resetPasswordControl.pswConfirmation) {
            setErrorPassword(T.translate("user.form_validations.password.max_chars"));
        } else if (logedUser.selectedOrganization.attributes.public) {
            const regex = logedUser.selectedOrganization.attributes.public.userPasswordRegex;
            if (!regex) {
                setErrorPassword(T.translate(logedUser.selectedOrganization.attributes.public.userPasswordRegexFailMsg));
            } else {
                const passwordRegex = new RegExp(regex);
                if (!passwordRegex.test(resetPasswordControl.psw)) {
                    setErrorPassword(T.translate(logedUser.selectedOrganization.attributes.public.userPasswordRegexFailMsg));
                } else {
                    setErrorPassword("");
                }
            }
        } else {
            setErrorPassword("");
        }
    }, [resetPasswordControl.psw, resetPasswordControl.pswConfirmation, logedUser]);
    
    const isFatherCompany = companyId => {
        let response = false;
        const companyEvaluated = companyOptions.find(co => co.id === companyId);
        const companyOptionsSelected = companyIds.map(ci => companyOptions.find(co => co.id === ci));

        if (((companyEvaluated || {}).partners || []).length > 0) return true;

        for (let index = 0; index < (companyOptionsSelected || []).length; index++) {
            const companyOption = companyOptionsSelected[index];
            const different = companyOption.id !== companyId;
            if (!different) continue;
            const addedForOtherCompany = ((companyOption || {}).partners || []).find(partnerId => partnerId === companyId);
            if (addedForOtherCompany) {
                return response;
            }
        }

        return true;
    };

    const addCompany = company => {
        const newCompanyIds = [...((company || {}).partners || []), company.id, ...companyIds];
        const companyIdsWithoutDuplicates = new Set(newCompanyIds);
        const companyIdsWithoutDuplicatesArray = [...companyIdsWithoutDuplicates]
        setCompanyIds(companyIdsWithoutDuplicatesArray);
        setForm({ ...form, companyId: companyIdsWithoutDuplicatesArray[0] || '', companyIds: companyIdsWithoutDuplicatesArray });
    }

    const deleteCompany = companyId => {
        const companyToDelete = companyOptions.find(co => co.id === companyId);
        let newCompanyIds = [];
        if ((companyToDelete.partners || []).length) {
            const companyOptionsSelected = companyIds.map(ci => companyOptions.find(co => co.id === ci));
            const companiesWithoutDependencies = companyToDelete.partners.filter(partner =>
                !companyOptionsSelected.find(cos => {
                    return (cos.partners || []).some(cosPartner => {
                        return cosPartner === partner
                    }) && cos.id !== companyId
                })
            )
            newCompanyIds = companyIds.filter(ci => !(ci === companyId || companiesWithoutDependencies.includes(ci)));
        } else {
            newCompanyIds = companyIds.filter(ci => ci !== companyId);
        }
        setCompanyIds(newCompanyIds);
        setForm({ ...form, companyId: newCompanyIds[0] || '', companyIds: newCompanyIds });
    }

    /**
     * Handles contract selection change
     * @param {*} evt 
     * @param {*} selectedContracts 
     */
    function handleCompanyChange(evt, selected) {
        if (!canWrite()) return;
        const restCompanies = (companyIds || []).filter(company => !selected.some(fc => fc.id === company));
        const addedCompany = selected.filter(companySelected => !companyIds.find(companyId => companyId === companySelected.id));
        if (!addedCompany.length) {
            const companyToEliminate = restCompanies.filter(el => isFatherCompany(el));
            if (!companyToEliminate.length) {
                dispatch(AppActions.showMessage({
                    message: `Existe una compañia que ya tiene como aliado la compañia que estas tratando de seleccionar`,
                    variant: 'info'
                }));
                return;
            }
            deleteCompany(companyToEliminate[0]);
            return;
        }
        addCompany(addedCompany[0]);
        // if(!companyToEliminate.length) {
        // }
        // console.log(restCompanies.filter(el => isFatherCompany(el)).map(id => companyOptions.find(el => el.id === id)));
        // console.log("selected ==>", selected, companyIds);

        // let firstLevelAlliesWithoutDuplicates = [];
        // const value = selected ? selected.map(option => option.id) : [];

        // //mapeo todos los aliados de primer nivel de todas las compañias sin pushear duplicados
        // selected.forEach(data => {
        //     if (data.partners) {
        //         if (!firstLevelAlliesWithoutDuplicates.includes(data.partners)) {
        //             firstLevelAlliesWithoutDuplicates.push(...data.partners);
        //         }
        //     }
        // });

        // let companiesWithAnotherCompanyAsAlly = []
        // let idsCompaniesWithPartners = []

        // //mapeo las compañias que no tienen a otra compañia de la misma organizacion como alidada para mostrarlas en front
        // value.map(element => {
        //     if (!firstLevelAlliesWithoutDuplicates.includes(element)) {
        //         companiesWithAnotherCompanyAsAlly.push(element)
        //     } else {

        //         selected.filter(x => x.id !== element).map(rawData => {
        //             if (rawData.partners) idsCompaniesWithPartners.push(rawData.id, ...rawData.partners)
        //         })

        //     }

        // })

        // // comparo la cantida de elementos que tiene cada array
        // if (value.length !== companiesWithAnotherCompanyAsAlly.length) {

        //     dispatch(AppActions.showMessage({
        //         message: `Existe una compañia que ya tiene como aliado la compañia que estas tratando de seleccionar`,
        //         variant: 'error'
        //     }));
        //     setCompanyIds(companiesWithAnotherCompanyAsAlly || [])

        // } else {
        //     setCompanyIds(value)
        // }

        // const data = value.concat(idsCompaniesWithPartners.length !== 0 ? idsCompaniesWithPartners : firstLevelAlliesWithoutDuplicates);
        // const dataWithoutDuplicates = [...new Set(data)]
        // setForm({ ...form, companyId: dataWithoutDuplicates[0] || '', companyIds: dataWithoutDuplicates });

    }

    function handlePhoneNumber(evt) {
        if (!canWrite()) return;
        const phoneNumber = evt.target.value;
        const phoneNumberRegex = /^(\+\d{1,3}\s)\(?\d{1,3}\)?[\s]\d{7}$/;
        if (phoneNumber && phoneNumber !== "") {
            setErrorPhone(phoneNumberRegex.test(phoneNumber) ? undefined : T.translate("user.form_validations.phoneNumber.invalid_format"));
        } else {


            setErrorPhone(undefined);
        }

        handleChange(evt);
    };

    function handleNameChange(event) {
        const newVal = event.target.value.trim().toUpperCase();
        if (!newVal) {
            setErrorName(T.translate("user.form_validations.name.required_field"));
        } else if (newVal.length < 3) {
            setErrorName(T.translate("user.form_validations.name.min_chars"));
        } else if (newVal.length > 100) {
            setErrorName(T.translate("user.form_validations.name.max_chars"));
        } else if (newVal) {
            const nameRegex = /^[A-Z0-9][ A-Z0-9]+[A-Z0-9]$/;
            setErrorName(!nameRegex.test(newVal) ? T.translate("user.form_validations.name.invalid_format") : undefined);
        }
        handleChange(event)
    }

    function handleLastNameChange(event) {
        const newVal = event.target.value.trim().toUpperCase();
        if (!newVal) {
            setErrorLastName(T.translate("user.form_validations.lastname.required_field"));
        } else if (newVal.length < 3) {
            setErrorLastName(T.translate("user.form_validations.lastname.min_chars"));
        } else if (newVal.length > 100) {
            setErrorLastName(T.translate("user.form_validations.lastname.max_chars"));
        } else if (newVal) {
            const nameRegex = /^[A-Z0-9][ A-Z0-9]+[A-Z0-9]$/;
            setErrorLastName(!nameRegex.test(newVal) ? T.translate("user.form_validations.lastname.invalid_format") : undefined);
        }
        handleChange(event)
    }

    function handleDocumentChange(event) {
        const newVal = event.target.value.trim();
        const nameRegex = /^[A-Z0-9][ A-Z0-9]+[A-Z0-9]$/;
        if (!newVal) {
            setErrorDocument(T.translate("user.form_validations.document.required_field"));
        } else if (newVal.length > 100) {
            setErrorDocument(T.translate("user.form_validations.document.max_chars"));
        } else if (!nameRegex.test(newVal)) {
            setErrorDocument(T.translate("user.form_validations.document.invalid_format"));
        }
        else {
            setErrorDocument(undefined);
        }
        handleChange(event)
    }

    function handleDocumentChange(event) {
        const newVal = event.target.value.trim();
        const nameRegex = /^[A-Z0-9][ A-Z0-9]+[A-Z0-9]$/;
        if (!newVal) {
            setErrorDocument(T.translate("user.form_validations.document.required_field"));
        } else if (newVal.length > 100) {
            setErrorDocument(T.translate("user.form_validations.document.max_chars"));
        } else if (!nameRegex.test(newVal)) {
            setErrorDocument(T.translate("user.form_validations.document.invalid_format"));
        }
        else {
            setErrorDocument(undefined);
        }
        handleChange(event)
    }

    function handleDriverLicenseChange(event) {
        const newVal = event.target.value ? event.target.value.trim().toUpperCase() : "";
        const nameRegex = /^[A-Z0-9][ A-Z0-9]+[A-Z0-9]$/;
        if (newVal.length > 30) {
            setErrorDriveLicense(T.translate("user.form_validations.driver_license.max_chars"));
        }
        else if (newVal !== "" && !nameRegex.test(newVal)) {
            setErrorDriveLicense(T.translate("user.form_validations.driver_license.invalid_format"));
        }
        else {
            setErrorDriveLicense(undefined);
        }
        event.target.value = newVal;
        handleChange(event)
    }

    function handleDriverLicenseCategoryChange(event) {
        const newVal = event.target.value ? event.target.value.trim().toUpperCase() : "";
        const nameRegex = /^[A-Z0-9]+[A-Z0-9]$/;
        if (newVal.length > 30) {
            setErrorDriveLicenseCategory(T.translate("user.form_validations.driver_license_category.max_chars"));
        }
        else if (newVal !== "" && !nameRegex.test(newVal)) {
            setErrorDriveLicenseCategory(T.translate("user.form_validations.driver_license_category.invalid_format"));
        }
        else {
            setErrorDriveLicenseCategory(undefined);
        }
        event.target.value = newVal;
        handleChange(event)
    }

    function handleMandatoryHealthPlanNumberChange(event) {
        const newVal = event.target.value ? event.target.value.trim().toUpperCase() : "";
        const nameRegex = /^[A-Z0-9][ A-Z0-9]+[A-Z0-9]$/;
        if (newVal.length > 30) {
            setErrorMandatoryHealthPlanNumber(T.translate("user.form_validations.driver_mandatory_plan_number.max_chars"));
        }
        else if (newVal !== "" && !nameRegex.test(newVal)) {
            setErrorMandatoryHealthPlanNumber(T.translate("user.form_validations.driver_mandatory_plan_number.invalid_format"));
        }
        else {
            setErrorMandatoryHealthPlanNumber(undefined);
        }
        event.target.value = newVal;
        handleChange(event)
    }

    function handleMandatoryHealthPlanIssuer(event) {
        const newVal = event.target.value ? event.target.value.trim().toUpperCase() : "";
        const nameRegex = /^[A-Z0-9][ A-Z0-9]+[A-Z0-9]$/;
        if (newVal.length > 30) {
            setErrorMandatoryHealthPlanIssuer(T.translate("user.form_validations.driver_mandatory_plan_issuer.max_chars"));
        }
        else if (newVal !== "" && !nameRegex.test(newVal)) {
            setErrorMandatoryHealthPlanIssuer(T.translate("user.form_validations.driver_mandatory_plan_issuer.invalid_format"));
        }
        else {
            setErrorMandatoryHealthPlanIssuer(undefined);
        }
        event.target.value = newVal;
        handleChange(event)
    }

    function handleOccupationalRiskAdministratorNumberChange(event) {
        const newVal = event.target.value ? event.target.value.trim().toUpperCase() : "";
        const nameRegex = /^[A-Z0-9][ A-Z0-9]+[A-Z0-9]$/;
        if (newVal.length > 30) {
            setErrorOccupationalRiskAdministratorNumber(T.translate("user.form_validations.occupational_risk.max_chars"));
        }
        else if (newVal !== "" && !nameRegex.test(newVal)) {
            setErrorOccupationalRiskAdministratorNumber(T.translate("user.form_validations.occupational_risk.invalid_format"));
        }
        else {
            setErrorOccupationalRiskAdministratorNumber(undefined);
        }
        event.target.value = newVal;
        handleChange(event)
    }

    function handleOccupationalRiskAdministratorIssuer(event) {
        const newVal = event.target.value ? event.target.value.trim().toUpperCase() : "";
        const nameRegex = /^[A-Z0-9][ A-Z0-9]+[A-Z0-9]$/;
        if (newVal.length > 30) {
            setErrorOccupationalRiskAdministratorIssuer(T.translate("user.form_validations.occupational_risk.max_chars"));
        }
        else if (newVal !== "" && !nameRegex.test(newVal)) {
            setErrorOccupationalRiskAdministratorIssuer(T.translate("user.form_validations.occupational_risk.invalid_format"));
        }
        else {
            setErrorOccupationalRiskAdministratorIssuer(undefined);
        }
        event.target.value = newVal;
        handleChange(event)
    }

    function handleOccupationalRiskAdministratorExpeditionChange(date) {
        if (date && !isNaN(date.getTime())) {
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            const expirationDate = new Date(date.getFullYear() + 1, date.getMonth(), date.getDate());
            setForm({ ...form, regulatoryCompliance: { ...form.regulatoryCompliance, occupationalRiskAdministratorExpirationDate: expirationDate.getTime(), occupationalRiskAdministratorExpeditionDate: date.getTime() } });
            setErrorOccupationalRiskAdministratorExpedition(undefined);
            setErrorOccupationalRiskAdministratorExpiration(undefined);
        } else {
            setErrorOccupationalRiskAdministratorExpedition(T.translate("user.form_validations.licence_expedition.invalid_format"));
        }
    }

    function handleOccupationalRiskAdministratorExpirationChange(date) {
        if (date && !isNaN(date.getTime())) {
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            if (date.getTime() <= (((form || {}).regulatoryCompliance || {}).occupationalRiskAdministratorExpeditionDate || 0)) {
                setErrorOccupationalRiskAdministratorExpiration(T.translate("user.form_validations.licence_expiration.lower_than_expedition_date"));
            } else {
                setErrorOccupationalRiskAdministratorExpiration(undefined);
            }
            setForm({ ...form, regulatoryCompliance: { ...form.regulatoryCompliance, occupationalRiskAdministratorExpirationDate: date.getTime() } });
        }
        else {
            setErrorOccupationalRiskAdministratorExpiration(T.translate("user.form_validations.licence_expiration.invalid_format"));
        }
    }

    function handleLicenceExpeditionChange(date) {
        if (date && !isNaN(date.getTime())) {
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            const expirationDate = new Date(date.getFullYear() + 1, date.getMonth(), date.getDate());
            setForm({ ...form, regulatoryCompliance: { ...form.regulatoryCompliance, driverLicenseExpirationDate: expirationDate.getTime(), driverLicenseExpeditionDate: date.getTime() } });
            setErrorLicenseExpedition(undefined);
            setErrorLicenseExpiration(undefined);
        } else {
            setErrorLicenseExpedition(T.translate("user.form_validations.licence_expedition.invalid_format"));
        }
    }

    function handleLicencExpirationChange(date) {
        if (date && !isNaN(date.getTime())) {
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            if (date.getTime() <= (((form || {}).regulatoryCompliance || {}).driverLicenseExpeditionDate || 0)) {
                setErrorLicenseExpiration(T.translate("user.form_validations.licence_expiration.lower_than_expedition_date"));
            } else {
                setErrorLicenseExpiration(undefined);
            }
            setForm({ ...form, regulatoryCompliance: { ...form.regulatoryCompliance, driverLicenseExpirationDate: date.getTime() } });
        }
        else {
            setErrorLicenseExpiration(T.translate("user.form_validations.licence_expiration.invalid_format"));
        }
    }

    function handleMandatoryHealthPlanExpeditionChange(date) {
        if (date && !isNaN(date.getTime())) {
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            const expirationDate = new Date(date.getFullYear() + 1, date.getMonth(), date.getDate());
            setForm({ ...form, regulatoryCompliance: { ...form.regulatoryCompliance, mandatoryHealthPlanExpirationDate: expirationDate.getTime(), mandatoryHealthPlanExpeditionDate: date.getTime() } });
            setErrorMandatoryHealthPlanExpedition(undefined);
            setErrorMandatoryHealthPlanExpiration(undefined);
        } else {
            setErrorMandatoryHealthPlanExpedition(T.translate("user.form_validations.licence_expedition.invalid_format"));
        }
    }

    function handleMandatoryHealthPlanExpirationChange(date) {
        if (date && !isNaN(date.getTime())) {
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            if (date.getTime() <= (((form || {}).regulatoryCompliance || {}).mandatoryHealthPlanExpeditionDate || 0)) {
                setErrorMandatoryHealthPlanExpiration(T.translate("user.form_validations.licence_expiration.lower_than_expedition_date"));
            } else {
                setErrorMandatoryHealthPlanExpiration(undefined);
            }
            setForm({ ...form, regulatoryCompliance: { ...form.regulatoryCompliance, mandatoryHealthPlanExpirationDate: date.getTime() } });
        }
        else {
            setErrorMandatoryHealthPlanExpiration(T.translate("user.form_validations.licence_expiration.invalid_format"));
        }
    }

    function fileProcessor(event) {
        event.stopPropagation();
        const { id } = form;
        const reader = new FileReader();
        const fileUpload = event.target;
        const file = fileUpload.files[0];
        const availableFormats = ['image/jpg', 'image/jpeg', 'image/png'];
        if (file && availableFormats.includes(file['type'])) {
            reader.readAsDataURL(file);
            reader.onload = function (e) {
                const image = new Image();
                const imageContent = e.target.result
                image.src = imageContent;
                image.onload = function () {
                    const height = this.height;
                    const width = this.width;
                    if (height > 512 || width > 512) {
                        dispatch(AppActions.showMessage({
                            message: `Las medidas permitidas para la foto de perfil son de 512x512, los medidas recibidas fueron: ${height}x${width} `,
                            variant: 'error'
                        }));
                        setProfilePicture(null);
                    } else {
                        setProfilePicture(imageContent);
                        updatePhoto({ variables: { id, photo: fileUpload.files[0], organizationId: logedUser.selectedOrganization.id } });

                    }
                };
            };
        } else {
            dispatch(AppActions.showMessage({
                message: `Formato Invalido`,
                variant: 'error'
            }));
        }

    }

    function handlEmailChange(event) {
        const newVal = event.target.value;
        if (!newVal) {
            setErrorEmail(T.translate("user.form_validations.email.required_field"));
        } else if (newVal) {
            const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            setErrorEmail(!emailRegex.test(newVal) ? T.translate("user.form_validations.email.invalid_format") : undefined);
        }
        handleChange(event)
    }

    const valueFocusCleaner = (value) => {
        return value.trim();
    };

    function handleResetPasswordTextChange({ target: { value } }) {
        setResetPasswordControl({ ...resetPasswordControl, psw: value });
    }

    function handleResetPasswordConfirmationTextChange({ target: { value } }) {
        setResetPasswordControl({ ...resetPasswordControl, pswConfirmation: value });
    }

    const gqlError = userResult.error /*|| companyListingResult.error*/ || roleListingResult.error;
    if (gqlError) {
        const firstErrorMessage = gqlError.graphQLErrors[0] ? gqlError.graphQLErrors[0].message : gqlError;
        if (!firstErrorMessage.includes || !firstErrorMessage.includes("Cannot return null")) {
            return (<Error500Page message={T.translate("user.internal_server_error")}
                description={gqlError.graphQLErrors.map(e => `@${e.path[0]} => code ${e.message.code}: ${e.message.name}`)} />);
        }
    }

    if (!logedUser.selectedOrganization || userResult.loading || /*companyListingResult.loading ||*/ roleListingResult.loading) {
        return (<FuseLoading />);
    }

    if (props.match.params.userId !== "new" && !userResult.data) {
        return (<Error404Page message={T.translate("user.not_found")} />);
    }


    //Responsive className
    const full_half = "mt-8 mb-16 w-full p-2 sm:w-1/2";
    const full = "mt-8 mb-16 w-full p-2"

    const typeVehicleFilterOptions = createFilterOptions({
        stringify: type => T.translate(`user.typesVehicle.${type}`),
    });

    const TYPES = [
        "OTHER",
        "BUS",
        "BUSETA",
        "MICRO-BUS",
        "PADRON",
        "BUSETON",
        "ARTICULADO"
    ];

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
                                <Typography className="normal-case flex items-center sm:mb-12" component={Link} role="button" to="/user-mng/users" color="inherit">
                                    <Icon className="mr-4 text-20">arrow_back</Icon>
                                    {T.translate("user.users")}
                                </Typography>
                            </FuseAnimate>

                            <div className="flex items-center max-w-full">
                                <FuseAnimate animation="transition.expandIn" delay={300}>
                                    <Icon className="text-32 mr-0 sm:text-48 mr-12">person</Icon>
                                </FuseAnimate>

                                <div className="flex flex-col min-w-0">
                                    <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                                        <Typography className="text-16 sm:text-20 truncate">
                                            {(form.firstName || form.lastName) ? `${form.firstName.toUpperCase()} ${form.lastName.toUpperCase()}` : T.translate("users.newUser")}
                                        </Typography>
                                    </FuseAnimate>
                                    <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                                        <Typography variant="caption">{T.translate("user.user_detail")}</Typography>
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
                                {T.translate("user.save")}
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
                    <Tab className="h-64 normal-case" label={T.translate("user.basic_info")} />
                    <Tab className="h-64 normal-case" label={T.translate("user.regulatoryCompliance_tab")} />
                    {(form && form.auth) && (<Tab className="h-64 normal-case" label={T.translate("user.auth_tab")} />)}
                    {(form && form.metadata) && (<Tab className="h-64 normal-case" label={T.translate("user.metadata_tab")} />)}
                </Tabs>
            }
            content={
                form && (
                    <div className="p-16 sm:p-24 max-w-2xl">

                        {/*#################################
                        ######### BASIC INFO TAB ###########
                        #################################*/}

                        {tabValue === 0 &&
                            (
                                <div>

                                    <TextField
                                        className={`mt-8 mb-16 w-full p-2 sm:w-1/2 ${classes.textForm}`}
                                        variant="outlined"
                                        fullWidth
                                        required
                                        InputProps={{ readOnly: !canWrite(), }}
                                        onChange={handleNameChange}
                                        label={T.translate("user.firstName")}
                                        onBlur={(evt) => {
                                            evt.target.value = valueFocusCleaner(evt.target.value)
                                            handleNameChange(evt)
                                        }}
                                        error={errorName}
                                        helperText={errorName}
                                        id="firstName"
                                        name="firstName"
                                        value={form.firstName}
                                    />
                                    <TextField
                                        className={`mt-8 mb-16 w-full p-2 sm:w-1/2 ${classes.textForm}`}
                                        variant="outlined" fullWidth required
                                        InputProps={{ readOnly: !canWrite(), }}
                                        onChange={handleLastNameChange}
                                        onBlur={(evt) => {
                                            evt.target.value = valueFocusCleaner(evt.target.value)
                                            handleLastNameChange(evt)
                                        }}
                                        label={T.translate("user.lastName")}
                                        error={errorLastName}
                                        helperText={errorLastName}
                                        id="lastName"
                                        name="lastName"
                                        value={form.lastName}
                                    />
                                    <TextField
                                        className={full_half} variant="outlined" fullWidth required
                                        InputProps={{ readOnly: !canWrite(), }} onChange={handleDocumentChange}
                                        error={errorDocument}
                                        helperText={errorDocument}
                                        label={T.translate("user.documentId")}
                                        id="documentId" name="documentId" value={form.documentId}
                                    />
                                    <TextField
                                        className={full_half} variant="outlined"
                                        error={errorPhone}
                                        helperText={errorPhone}
                                        fullWidth
                                        InputProps={{ readOnly: !canWrite(), }} onChange={handlePhoneNumber}
                                        label={T.translate("user.phoneNumber")}
                                        id="phoneNumber" name="phoneNumber" value={form.phoneNumber}
                                    />
                                    <TextField
                                        className="mt-8 mb-16" variant="outlined" fullWidth required
                                        InputProps={{ readOnly: !canWrite(), }} onChange={handlEmailChange}
                                        label={T.translate("user.emailAddress")} error={errorEmail}
                                        helperText={errorEmail}
                                        id="emailAddress" name="emailAddress" value={form.emailAddress}
                                    />

                                    {/* <Autocomplete
                                        multiple filterSelectedOptions
                                        id="companyIds" getOptionLabel={option => option.name}
                                        options={(!companyListingResult.loading && companyListingResult.data)
                                            ? companyListingResult.data.OrganizationMngCompanyListing.listing : []}
                                        value={selectedCompanies}
                                        onChange={handleCompaniesChange}
                                        disabled={!canWrite()}
                                        renderInput={params => (
                                            <TextField
                                                {...params} variant="outlined" margin="normal" fullWidth
                                                //label={T.translate("user.companies")}
                                                placeholder={T.translate("user.companies")}
                                            />
                                        )}
                                    /> */}

                                    <Autocomplete
                                        multiple filterSelectedOptions
                                        id="roles" getOptionLabel={option => {
                                            if (option.id) {
                                                return T.translate("user.role_groups." + option.name || '')
                                            } else {
                                                return option.name
                                            }
                                        }}
                                        filterOptions={roleFilterOptions}
                                        options={(!roleListingResult.loading && roleListingResult.data)
                                            ? (roleListingResult.data.OrganizationMngRoleListing || []).map(role => {
                                                return {
                                                    type: role,
                                                    name: T.translate("user.role_groups." + role.name || '')
                                                }
                                            }).sort((a, b) => {
                                                if (a.name !== "Todos" && b.name !== "Todos") {
                                                    if ((a.name).toUpperCase() > (b.name).toUpperCase()) {
                                                        return 1;
                                                    }
                                                    if ((a.name).toUpperCase() < (b.name).toUpperCase()) {
                                                        return -1;
                                                    }
                                                }
                                                return 0;
                                            }) : []}
                                        value={selectedRoles}
                                        onChange={handleRolesChange}
                                        disabled={!canWrite()}
                                        renderInput={params => (
                                            <TextField
                                                {...params} variant="outlined" margin="normal" fullWidth
                                                placeholder={T.translate("user.roles")}
                                            />
                                        )}
                                    />

                                    <Typography className="mt-8  text-16 sm:text-20 truncate" color="inherit">
                                        {T.translate("user.company")}
                                    </Typography>

                                    <FormControl className="w-full mt-8 mb-8">
                                        {queryCompaniesResult.loading ? (
                                            <LinearProgress className="m-8 mt-32" />
                                        ) : (
                                            <Autocomplete
                                                multiple
                                                id="companyIds"
                                                options={companyOptions}
                                                className="w-full"
                                                // disabled={logedUser.data.companyIds !== undefined}
                                                getOptionLabel={(option) => option.name}
                                                value={(companyOptions || []).filter(option => companyIds.includes(option.id) && isFatherCompany(option.id))}
                                                onChange={handleCompanyChange}
                                                getOptionDisabled={(option) => disabledCompanies.some(dc => dc === option.id)}
                                                renderInput={(params) => {
                                                    params.inputProps.autoComplete = "off";
                                                    return (
                                                        <TextField
                                                            {...params}
                                                            variant="outlined"
                                                            fullWidth
                                                        />
                                                    );
                                                }}
                                            />
                                        )}
                                    </FormControl>

                                    {form && form.id &&
                                        <>
                                            <Typography className="mt-8  text-16 sm:text-20 truncate" color="inherit">
                                                {T.translate("user.profilePicture")}
                                            </Typography>
                                            <Photo {...{ profilePicture, fileProcessor }} />
                                        </>

                                    }

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
                                        label={T.translate("user.active")}
                                    />


                                </div>
                            )}

                        {/*#################################
                        #### REGULATORY COMPILANCE TAB #####
                        #################################*/}

                        {tabValue === 1 &&
                            (
                                <div>

                                    <Typography className="mt-8  text-16 sm:text-20 truncate" color="inherit">
                                        {T.translate("user.regulatoryCompliance.driverLicense")}
                                    </Typography>

                                    <TextField
                                        className={`${full_half} ${classes.textForm}`} variant="outlined" fullWidth
                                        InputProps={{ readOnly: !canWrite(), }} onChange={handleDriverLicenseChange}
                                        error={errorDriveLicense}
                                        helperText={errorDriveLicense}
                                        label={T.translate("user.regulatoryCompliance.driverLicenseNumber")}
                                        id="regulatoryCompliance.driverLicenseNumber" name="regulatoryCompliance.driverLicenseNumber" value={form.regulatoryCompliance.driverLicenseNumber}
                                    />

                                    <TextField
                                        className={full_half} variant="outlined" fullWidth
                                        error={errorDriveLicenseCategory}
                                        helperText={errorDriveLicenseCategory}
                                        InputProps={{ readOnly: !canWrite(), }} onChange={handleDriverLicenseCategoryChange}
                                        label={T.translate("user.regulatoryCompliance.driverLicenseCategory")}
                                        id="regulatoryCompliance.driverLicenseCategory" name="regulatoryCompliance.driverLicenseCategory" value={form.regulatoryCompliance.driverLicenseCategory}
                                    />

                                    <Autocomplete variant="outlined"
                                        id="typeVehicle"
                                        className={full}
                                        multiple
                                        getOptionLabel={option => T.translate(`user.typesVehicle.${option}`)}
                                        filterOptions={typeVehicleFilterOptions}
                                        options={TYPES}
                                        value={form.regulatoryCompliance.typeVehicles || []}
                                        onChange={(evt, selectedTypeVehicle) => {
                                            if (!canWrite()) return;
                                            // setFieldValue("type", selectedTypeVehicle); 
                                            setForm({ ...form, regulatoryCompliance: { ...form.regulatoryCompliance, typeVehicles: selectedTypeVehicle } });
                                        }}
                                        disabled={!canWrite()}
                                        renderInput={params => (
                                            <TextField
                                                fullWidth
                                                {...params}
                                                variant="outlined"
                                                margin="normal"
                                                placeholder={T.translate("user.regulatoryCompliance.typeVehicle")}
                                            />
                                        )}
                                    />

                                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={localeMap[logedUser.locale]}>
                                        <KeyboardDatePicker
                                            className={full_half}
                                            margin="normal"
                                            id="regulatoryCompliance.mandatoryHealthPlanExpeditionDate"
                                            label={T.translate("user.regulatoryCompliance.driverLicenseExpeditionDate")}
                                            format="MM/dd/yyyy"
                                            value={new Date().setTime(form.regulatoryCompliance.driverLicenseExpeditionDate)}
                                            onChange={handleLicenceExpeditionChange}
                                            error={errorLicenseExpedition}
                                            helperText={errorLicenseExpedition}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                        />
                                    </MuiPickersUtilsProvider>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={localeMap[logedUser.locale]}>
                                        <KeyboardDatePicker
                                            className={full_half}
                                            margin="normal"
                                            id="regulatoryCompliance.driverLicenseExpirationDate"
                                            label={T.translate("user.regulatoryCompliance.driverLicenseExpirationDate")}
                                            format="MM/dd/yyyy"
                                            value={new Date().setTime(form.regulatoryCompliance.driverLicenseExpirationDate)}
                                            minDate={new Date().setTime(form.regulatoryCompliance.driverLicenseExpeditionDate)}
                                            onChange={handleLicencExpirationChange}
                                            error={errorLicenseExpiration}
                                            helperText={errorLicenseExpiration}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                        />
                                    </MuiPickersUtilsProvider>


                                    <Typography className="mt-8 text-16 sm:text-20 truncate" color="inherit">
                                        {T.translate("user.regulatoryCompliance.mandatoryHealthPlan")}
                                    </Typography>
                                    <TextField
                                        className={full_half} variant="outlined" fullWidth
                                        error={errorMandatoryHealthPlanNumber}
                                        helperText={errorMandatoryHealthPlanNumber}
                                        InputProps={{ readOnly: !canWrite(), }} onChange={handleMandatoryHealthPlanNumberChange}
                                        label={T.translate("user.regulatoryCompliance.mandatoryHealthPlanNumber")}
                                        id="regulatoryCompliance.mandatoryHealthPlanNumber" name="regulatoryCompliance.mandatoryHealthPlanNumber" value={form.regulatoryCompliance.mandatoryHealthPlanNumber}
                                    />
                                    <TextField
                                        className={full_half} variant="outlined" fullWidth
                                        error={errorMandatoryHealthPlanIssuer}
                                        helperText={errorMandatoryHealthPlanIssuer}
                                        InputProps={{ readOnly: !canWrite(), }} onChange={handleMandatoryHealthPlanIssuer}
                                        label={T.translate("user.regulatoryCompliance.mandatoryHealthPlanIssuer")}
                                        id="regulatoryCompliance.mandatoryHealthPlanIssuer" name="regulatoryCompliance.mandatoryHealthPlanIssuer" value={form.regulatoryCompliance.mandatoryHealthPlanIssuer}
                                    />
                                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={localeMap[logedUser.locale]}>
                                        <KeyboardDatePicker
                                            className={full_half}
                                            margin="normal"
                                            id="regulatoryCompliance.mandatoryHealthPlanExpeditionDate"
                                            label={T.translate("user.regulatoryCompliance.mandatoryHealthPlanExpeditionDate")}
                                            format="MM/dd/yyyy"
                                            value={new Date().setTime(form.regulatoryCompliance.mandatoryHealthPlanExpeditionDate)}
                                            error={errorMandatoryHealthPlanExpedition}
                                            helperText={errorMandatoryHealthPlanExpedition}

                                            onChange={handleMandatoryHealthPlanExpeditionChange}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                        />
                                    </MuiPickersUtilsProvider>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={localeMap[logedUser.locale]}>
                                        <KeyboardDatePicker
                                            className={full_half}
                                            margin="normal"
                                            id="regulatoryCompliance.mandatoryHealthPlanExpirationDate"
                                            label={T.translate("user.regulatoryCompliance.mandatoryHealthPlanExpirationDate")}
                                            format="MM/dd/yyyy"
                                            value={new Date().setTime(form.regulatoryCompliance.mandatoryHealthPlanExpirationDate)}
                                            minDate={new Date().setTime(form.regulatoryCompliance.mandatoryHealthPlanExpeditionDate)}
                                            error={errorMandatoryHealthPlanExpiration}
                                            helperText={errorMandatoryHealthPlanExpiration}
                                            onChange={handleMandatoryHealthPlanExpirationChange}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                        />
                                    </MuiPickersUtilsProvider>


                                    <Typography className="mt-8 text-16 sm:text-20 truncate" color="inherit">
                                        {T.translate("user.regulatoryCompliance.occupationalRiskAdministrator")}
                                    </Typography>
                                    <TextField
                                        className={full_half} variant="outlined" fullWidth
                                        error={errorOccupationalRiskAdministratorNumber}
                                        helperText={errorOccupationalRiskAdministratorNumber}
                                        InputProps={{ readOnly: !canWrite(), }}
                                        onChange={handleOccupationalRiskAdministratorNumberChange}
                                        label={T.translate("user.regulatoryCompliance.occupationalRiskAdministratorNumber")}
                                        id="regulatoryCompliance.occupationalRiskAdministratorNumber"
                                        name="regulatoryCompliance.occupationalRiskAdministratorNumber"
                                        value={form.regulatoryCompliance.occupationalRiskAdministratorNumber}
                                    />
                                    <TextField
                                        className={full_half} variant="outlined" fullWidth
                                        error={errorOccupationalRiskAdministratorIssuer}
                                        helperText={errorOccupationalRiskAdministratorIssuer}
                                        InputProps={{ readOnly: !canWrite(), }}
                                        onChange={handleOccupationalRiskAdministratorIssuer}
                                        label={T.translate("user.regulatoryCompliance.occupationalRiskAdministratorIssuer")}
                                        id="regulatoryCompliance.occupationalRiskAdministratorIssuer"
                                        name="regulatoryCompliance.occupationalRiskAdministratorIssuer"
                                        value={form.regulatoryCompliance.occupationalRiskAdministratorIssuer}
                                    />
                                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={localeMap[logedUser.locale]}>
                                        <KeyboardDatePicker
                                            className={full_half}
                                            margin="normal"
                                            id="regulatoryCompliance.occupationalRiskAdministratorExpeditionDate"
                                            label={T.translate("user.regulatoryCompliance.occupationalRiskAdministratorExpeditionDate")}
                                            format="MM/dd/yyyy"
                                            value={new Date().setTime(form.regulatoryCompliance.occupationalRiskAdministratorExpeditionDate)}
                                            error={errorOccupationalRiskAdministratorExpedition}
                                            helperText={errorOccupationalRiskAdministratorExpedition}

                                            onChange={handleOccupationalRiskAdministratorExpeditionChange}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                        />
                                    </MuiPickersUtilsProvider>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={localeMap[logedUser.locale]}>
                                        <KeyboardDatePicker
                                            className={full_half}
                                            margin="normal"
                                            id="regulatoryCompliance.occupationalRiskAdministratorExpirationDate"
                                            label={T.translate("user.regulatoryCompliance.occupationalRiskAdministratorExpirationDate")}
                                            format="MM/dd/yyyy"
                                            value={new Date().setTime(form.regulatoryCompliance.occupationalRiskAdministratorExpirationDate)}
                                            minDate={new Date().setTime(form.regulatoryCompliance.occupationalRiskAdministratorExpeditionDate)}
                                            error={errorOccupationalRiskAdministratorExpiration}
                                            helperText={errorOccupationalRiskAdministratorExpiration}

                                            onChange={handleOccupationalRiskAdministratorExpirationChange}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                        />
                                    </MuiPickersUtilsProvider>


                                </div>
                            )}


                        {/*#################################
                        ######### AUTH TAB ###########
                        #################################*/}
                        {(tabValue === 2 && user.auth && user.auth.authId) &&
                            (
                                <div>
                                    <TextField
                                        className={full_half} variant="outlined" fullWidth InputProps={{ readOnly: true, }}
                                        label={T.translate("user.auth.authId")} id="authId" name="authId" value={!form.auth ? "" : form.auth.authId}
                                    />

                                    <TextField
                                        className={full_half} variant="outlined" fullWidth InputProps={{ readOnly: true, }}
                                        label={T.translate("user.auth.username")} id="username" name="username" value={!form.auth ? "" : form.auth.username}
                                    />

                                    <TextField
                                        className="mb-16" fullWidth 
                                        variant="outlined" label={T.translate("user.auth.resetPasswordText")} 
                                        type="password"
                                        error={errorPassword}
                                        helperText={errorPassword}
                                        name="resetPasswordText" value={resetPasswordControl.psw} onChange={handleResetPasswordTextChange}
                                    />
                                    <TextField
                                        className="mb-16" fullWidth variant="outlined" label={T.translate("user.auth.resetPasswordConfirmationText")} type="password"
                                        error={errorPassword}
                                        helperText={errorPassword}
                                        name="resetPasswordConfirmationText" value={resetPasswordControl.pswConfirmation} onChange={handleResetPasswordConfirmationTextChange}
                                    />

                                    <Button
                                        variant="contained" color="secondary" className="w-224 mx-auto mt-16 m-10" aria-label="Reset" disabled={!isResetPasswordValid()} onClick={handleAuthPasswordReset}>
                                        {T.translate("user.auth.resetPasswordButton")}
                                    </Button>



                                    <Typography variant="subtitle1" color="textSecondary" className="mb-16">
                                        {T.translate("user.auth.delete_credentail_desc")}
                                    </Typography>

                                    <Button variant="outlined" color="primary" className="w-224 mx-auto mt-16" aria-label="Delete" onClick={handleAuthDeletion}>
                                        {T.translate("user.auth.deleteAuthButton")}
                                    </Button >
                                </div>
                            )}

                        {(tabValue === 2 && user.auth && !user.auth.authId) &&
                            (
                                <div>
                                    <CreateAuthDialog handleAuthCreation={handleAuthCreation} />
                                </div>
                            )}





                        {/*#################################
                        ######### METADATATAB ###########
                        #################################*/}

                        {tabValue === 3 &&
                            (
                                <div>

                                    <TextField
                                        className={full_half}
                                        label={T.translate("user.metadata.createdBy")}
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
                                        label={T.translate("user.metadata.createdAt")}
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
                                        label={T.translate("user.metadata.updatedBy")}
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
                                        label={T.translate("user.metadata.updatedAt")}
                                        id="updatedAt"
                                        name="updatedAt"
                                        value={!form.metadata ? "" : new Date(form.metadata.updatedAt).toLocaleString()}
                                        variant="outlined"
                                        fullWidth
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />

                                </div>
                            )}


                    </div>
                )
            }
            innerScroll
        />
    )
}

export default withReducer('UserManagement', reducer)(User);
