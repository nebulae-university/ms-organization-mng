/* React core */
import React, { useState, useEffect } from 'react';
/* UI core */
import { TextField, Typography } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
/* GraphQL Client hooks */
import { useLazyQuery } from "@apollo/react-hooks";
/* Tools */
import { useEventCallback } from 'rxjs-hooks'
import { debounceTime } from "rxjs/operators";
/* GQL queries/mutation to use */
import { OrganizationMngUserListing } from '../../gql/User'


/**
 * Basic Info validators
 * @param {*} T 
 */
export function humanResourcesFormValidationsGenerator(T) {
    return {
    };
}


/**
 * Aggregate HumanResources form
 * @param {{dataSource,T}} props 
 */
export function HumanResources(props) {
    // Properties injected by parent
    const { dataSource: form, T, onChange, errors, touched, canWrite,customCanWrite, setFieldValue, setForm, loggedUser, companyId } = props;

    // user listing query    
    const gqlUsersListing = OrganizationMngUserListing({});
    const paginationInput = { page: 0, count: 5, queryTotalResultCount: false }

    /**
     * Converts an User object to an string representation
     * @param {*} user 
     */
    function userAsString(user) {
        return user ? `${user.firstName} ${user.lastName} - ${user.documentId}` : "???";
    }


    /*
    ============== OWNER IDS AUTOCOMPLETE LOGIC ============
    */

    // OWNER autocomplete STATE and READ ops
    const [ownerOptions, setOwnerOptions] = useState([]);
    const [ownerSelectedList, setOwnerSelectedList] = useState(!form.humanResources.userObjList ? [] : form.humanResources.userObjList.filter(uo => form.humanResources.ownerIds.includes(uo.id)));
    const [queryOwners, queryOwnersResult] = useLazyQuery(gqlUsersListing.query, { fetchPolicy: gqlUsersListing.fetchPolicy })
    // users search keyword debounced
    const [ownerKeywordCallBack, ownerKeyword] = useEventCallback((event$) => event$.pipe(debounceTime(500)));

    
    /**
     * Handles owner selection change
     * @param {*} evt 
     * @param {*} selectedOwners 
     */
    function handleOwnersChange(evt, selectedOwners) {
        if (!customCanWrite()) return;
        const selectedOwnerObjs = selectedOwners.filter(x => x).map(x => {
            return x.id ? x : ownerSelectedList.find(o => o.id === x);
        });
        const selectedOwnerIds = selectedOwners.filter(x => x).map(x => {
            return x.id ? x.id : x;
        });
        setOwnerSelectedList(selectedOwnerObjs);
        setFieldValue("humanResources.ownerIds", selectedOwnerIds); setForm({ ...form, humanResources: { ...form.humanResources, ownerIds: selectedOwnerIds } });
    };
    //handles owner input search word change
    function handleOwnersInputChange(evt) {
        if (evt && evt.target && evt.target.value && evt.target.value !== '' && loggedUser)
            ownerKeywordCallBack(evt.target.value);
    }
    //fires the query once the user stop typing
    useEffect(() => {
        if (ownerKeyword !== undefined && ownerKeyword !== null)
            queryOwners({ variables: { paginationInput, filterInput: { name: ownerKeyword, organizationId: loggedUser.selectedOrganization.id, company: companyId } } });
    }, [ownerKeyword]);
    //Refresh owner options when  queryOwners resolves    
    useEffect(() => {
        if (!queryOwnersResult.loading && queryOwnersResult.data)
            setOwnerOptions([...queryOwnersResult.data.OrganizationMngUserListing.listing.filter(user => user.active)]);
    }, [queryOwnersResult]);


    /*
    ============== DIRVERS IDS AUTOCOMPLETE LOGIC ============
    */

    // DRIVERS autocomplete STATE and READ ops
    const [driveOptions, setDriverOptions] = useState([]);
    const [driverSelectedList, setDriverSelectedList] = useState(!form.humanResources.userObjList ? [] : form.humanResources.userObjList.filter(uo => form.humanResources.driverIds.includes(uo.id)));
    const [queryDrivers, queryDriversResult] = useLazyQuery(gqlUsersListing.query, { fetchPolicy: gqlUsersListing.fetchPolicy })
    // users search keyword debounced
    const [driverKeywordCallBack, driverKeyword] = useEventCallback((event$) => event$.pipe(debounceTime(500)));

    /**
     * Handles drivers selection change
     * @param {*} evt 
     * @param {*} selectedDrivers 
     */
    function handleDriversChange(evt, selectedDrivers) {
        if (!customCanWrite()) return;
        const selectedDriverObjs = selectedDrivers.filter(x => x).map(x => {
            return x.id ? x : driverSelectedList.find(o => o.id === x);
        });
        const selectedDriverIds = selectedDrivers.filter(x => x).map(x => {
            return x.id ? x.id : x;
        });
        setDriverSelectedList(selectedDriverObjs);
        setFieldValue("humanResources.driverIds", selectedDriverIds); setForm({ ...form, humanResources: { ...form.humanResources, driverIds: selectedDriverIds } });
    };
    // handles driver input search word change
    function handleDriversInputChange(evt) {
        if (evt && evt.target && evt.target.value && evt.target.value !== '' && loggedUser)
            driverKeywordCallBack(evt.target.value);
    }
    //fires the query once the user stop typing
    useEffect(() => {
        if (driverKeyword !== undefined && driverKeyword !== null)
            queryDrivers({ variables: { paginationInput, filterInput: { name: driverKeyword, organizationId: loggedUser.selectedOrganization.id, companyIds: [companyId], roleMapName:"VEHICLE-DRIVER" } } });
    }, [driverKeyword]);
    //Refresh driver options when  query Drivers resolves    
    useEffect(() => {
        if (!queryDriversResult.loading && queryDriversResult.data)
            setDriverOptions([...queryDriversResult.data.OrganizationMngUserListing.listing.filter(user => user.active)])
    }, [queryDriversResult])


    /*
    ============== MANAGERS IDS AUTOCOMPLETE LOGIC ============
    */

    // Manager autocomplete STATE and READ ops
    const [managerOptions, setManagerOptions] = useState([]);
    const [managerSelectedList, setManagerSelectedList] = useState(!form.humanResources.userObjList ? [] : form.humanResources.userObjList.filter(uo => form.humanResources.managerIds.includes(uo.id)));
    const [queryManagers, queryManagersResult] = useLazyQuery(gqlUsersListing.query, { fetchPolicy: gqlUsersListing.fetchPolicy })
    // users search keyword debounced
    const [managerKeywordCallBack, managerKeyword] = useEventCallback((event$) => event$.pipe(debounceTime(500)));

    /**
     * Handles manager selection change
     * @param {*} evt 
     * @param {*} selectedManagers 
     */
    function handleManagersChange(evt, selectedManagers) {
        if (!customCanWrite()) return;
        const selectedManagerObjs = selectedManagers.filter(x => x).map(x => {
            return x.id ? x : managerSelectedList.find(o => o.id === x);
        });
        const selectedManagerIds = selectedManagers.filter(x => x).map(x => {
            return x.id ? x.id : x;
        });
        setManagerSelectedList(selectedManagerObjs);
        setFieldValue("humanResources.managerIds", selectedManagerIds); setForm({ ...form, humanResources: { ...form.humanResources, managerIds: selectedManagerIds } });
    };
    // handles manager input search word change
    function handleManagersInputChange(evt) {
        if (evt && evt.target && evt.target.value && evt.target.value !== '' && loggedUser)
            managerKeywordCallBack(evt.target.value);
    }
    //fires the query once the user stop typing
    useEffect(() => {
        if (managerKeyword !== undefined && managerKeyword !== null)
            queryManagers({ variables: { paginationInput, filterInput: { name: managerKeyword, organizationId: loggedUser.selectedOrganization.id, company: companyId } } });
    }, [managerKeyword]);
    //Refresh manager options when  queryManagers resolves    
    useEffect(() => {
        if (!queryManagersResult.loading && queryManagersResult.data)
            setManagerOptions([...queryManagersResult.data.OrganizationMngUserListing.listing.filter(user => user.active)])
    }, [queryManagersResult])


    return (

        <div>
            <Typography className="mt-8  text-16 sm:text-20 truncate" color="inherit">
                {T.translate("vehicle.humanresources.owners")}
            </Typography>
            <Autocomplete
                multiple filterSelectedOptions
                id="ownerIds"
                getOptionLabel={option => {
                    if (!option) return "null";
                    const user = option.id ? option : ownerSelectedList.find(o => o.id === option);
                    return userAsString(user);
                }}
                options={ownerOptions}
                value={form.humanResources.ownerIds}
                onChange={handleOwnersChange}
                onInputChange={handleOwnersInputChange}
                disabled={!customCanWrite()}
                renderInput={params => (
                    <TextField
                        {...params}
                        variant="outlined"
                        autocomplete="off"
                        margin="normal"
                        fullWidth
                        placeholder={T.translate("vehicle.humanresources.owners")}
                    />
                )}
            />

            <Typography className="mt-8  text-16 sm:text-20 truncate" color="inherit">
                {T.translate("vehicle.humanresources.managers")}
            </Typography>
            <Autocomplete
                multiple filterSelectedOptions
                id="managerIds"
                getOptionLabel={option => {
                    if (!option) return "null";
                    const user = option.id ? option : managerSelectedList.find(o => o.id === option);
                    return userAsString(user);
                }}
                options={managerOptions}
                value={form.humanResources.managerIds}
                onChange={handleManagersChange}
                onInputChange={handleManagersInputChange}
                disabled={!customCanWrite()}
                renderInput={params => (
                    <TextField
                        {...params} variant="outlined" margin="normal" fullWidth
                        placeholder={T.translate("vehicle.humanresources.managers")}
                    />
                )}

            />



            <Typography className="mt-8  text-16 sm:text-20 truncate" color="inherit">
                {T.translate("vehicle.humanresources.drivers")}
            </Typography>
            <Typography className="mt-8  text-8 sm:text-8" color="inherit">
                {T.translate("vehicle.humanresources.drivers_order")}
            </Typography>
            <Autocomplete
                multiple filterSelectedOptions
                id="driverIds"
                getOptionLabel={option => {
                    if (!option) return "null";
                    const user = option.id ? option : driverSelectedList.find(o => (o || {}).id === option);
                    return userAsString(user);
                }}
                options={driveOptions}
                value={form.humanResources.driverIds}
                onChange={handleDriversChange}
                onInputChange={handleDriversInputChange}
                disabled={!customCanWrite()}
                renderInput={params => (
                    <TextField
                        {...params} variant="outlined" margin="normal" fullWidth
                        placeholder={T.translate("vehicle.humanresources.drivers")}
                    />
                )}
            />


        </div>
    );
}

