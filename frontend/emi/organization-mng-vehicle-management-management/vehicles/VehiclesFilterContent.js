import React, { useState, useEffect } from 'react';
import { Checkbox, FormGroup, FormControlLabel, Select, MenuItem, Typography, FormControl, Button, Icon } from '@material-ui/core';
import { FuseAnimate } from '@fuse';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { red, amber } from '@material-ui/core/colors';
import * as Actions from '../store/actions';
import { MDText } from 'i18n-react';
import i18n from "../i18n";
import { useLazyQuery } from "@apollo/react-hooks";
import {
    UserMngCompanyListing
} from "../gql/User";
import ReportDownloaderDialog from './dialogs/ReportDownloader';

const useStyles = makeStyles(theme => ({
    downloadButton: {
        backgroundColor: "#dbdbdb",
        border: "1px solid rgba(0, 0, 0, 0.12);",
        borderRadius: "4px",
        '&.Mui-disabled': {
            color: "#656565",
            backgroundColor: "#FFFFFF00"
        }
    }
}));

function TodoSidebarContent(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const gqlCompaniesListing = UserMngCompanyListing({});
    const [companyOptions, setCompanyOptions] = useState();
    const [queryCompanies, queryCompaniesResult] = useLazyQuery(gqlCompaniesListing.query, { fetchPolicy: gqlCompaniesListing.fetchPolicy })
    const user = useSelector(({ auth }) => auth.user);
    const { filters: { active: activeChecked, company }, totalDataCount } = useSelector(({ VehicleManagement }) => VehicleManagement.vehicles);
    const T = new MDText(i18n.get(user.locale));

    //DIALOG STATES
    const [ openReportOptionsDialog, setOpenReportOptionsDialog ] = useState(false);


    //fires the query once the user stop typing the keyword
    useEffect(() => {
        if (user.selectedOrganization)
            queryCompanies({ variables: { paginationInput: { page: 0, count: 100, queryTotalResultCount: false }, filterInput: { active: true, organizationId: user.selectedOrganization.id } } });
    }, [user]);

    useEffect(() => {
        if (!queryCompaniesResult.loading && queryCompaniesResult.data) {
            const options = [...queryCompaniesResult.data.UserMngCompanyListing.listing.map(({ id, name, number, active }) => ({ id, name, number, active }))];
            if (user.data.companyIds === null) {
                options.unshift({ id: "NO_COMPANY", name: T.translate("vehicles.filters.withoutOperator"), enum: true })
            }
            options.unshift({ id: "ALL_COMPANIES", name: T.translate("vehicles.filters.all"), enum: true })
            setCompanyOptions(options);
            if (!company) { 
                dispatch(Actions.setUsersFilterCompany(options[0]));
            }
        }

    }, [queryCompaniesResult])

    function handleActiveChange(evt) {
        if (activeChecked === null) {
            dispatch(Actions.setVehiclesFilterActive(true));
        } else if (activeChecked) {
            dispatch(Actions.setVehiclesFilterActive(false));
        } else {
            dispatch(Actions.setVehiclesFilterActive(null));
        }
    }

    /**
     * Handles contract selection change
     * @param {*} evt 
     * @param {*} selectedContracts 
     */
    function handleCompanyChange(evt) {
        const value = evt ? evt.target.value : undefined;
        dispatch(Actions.setUsersFilterCompany(value));
        //setCompanySelected(value);
    };

    /**
    * Converts an Contract object to an string representation
    * @param {*} contract 
    */
    function companyAsString(company) {
        return company ? `${company.name || ''} ` : "???";
    }

    function onDownloadVehiclesInfo(){
        setOpenReportOptionsDialog(true)
    }

    function handleCloseReportOptions(extensionFile){
        setOpenReportOptionsDialog(false);
    }

    return (
        <FuseAnimate animation="transition.slideUpIn" delay={400}>

            <div className="flex-auto border-l-1 border-solid">

                {/* FORM */}
                <div className="p-24">
                    <FormGroup row>

                        {/* ACTIVE TAG */}
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={activeChecked === null ? false : activeChecked}
                                    indeterminate={activeChecked === null}
                                    onChange={handleActiveChange}
                                    value="active"
                                    inputProps={{ 'aria-label': 'primary checkbox' }}
                                />
                            }
                            label={T.translate("vehicles.filters.active")}
                        />
                        {/* ACTIVE TAG */}

                        {/* TRANSPORT COMPANY */}
                        <Typography className="mt-8 text-14 sm:text-14 truncate" color="inherit">
                            {T.translate("vehicles.filters.company")}
                        </Typography>

                        <FormControl className="w-full">
                            <Select
                                value={ companyOptions 
                                    ? companyOptions.find(c => c.id === (company || {}).id) || {}
                                    : {}
                                }
                                id="companyId"
                                onChange={handleCompanyChange}
                            >
                                {companyOptions && companyOptions.map(c => (<MenuItem key={c.id} value={c}>{companyAsString(c)}</MenuItem>))}
                            </Select>
                        </FormControl>

                        {/* BUTTON TO OPEN DIALOG TO DOWNLOAD THE REPORT */}
                        <div className="w-full mt-16 items-center" >

                            <Button
                                className={`mt-8 w-full normal-case ${classes.downloadButton}`}
                                variant="contained"
                                disabled={ !totalDataCount }
                                onClick={onDownloadVehiclesInfo}
                            >
                                <Icon className="mr-2">cloud_download</Icon>
                                {T.translate("vehicles.filters.download_file")}
                            </Button>
                            {!totalDataCount && <p style={{ color: red[500] }} >No se encontraron datos para descargar vehículos </p>}
                        </div>
                        
                    </FormGroup>
                </div>

                {/* DIALOGS */}
                <div>
                    {openReportOptionsDialog && <ReportDownloaderDialog 
                        T={T}
                        open={openReportOptionsDialog}
                        onClose={handleCloseReportOptions}
                        companies={companyOptions}
                    />}
                </div>
            </div>

            
        </FuseAnimate>
    );
}

export default TodoSidebarContent;
