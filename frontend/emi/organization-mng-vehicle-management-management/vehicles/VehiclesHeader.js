import React, { useState, useEffect } from 'react';
import { Paper, Button, Input, Icon, Typography, Hidden, IconButton } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { FuseAnimate } from '@fuse';
import { useDispatch, useSelector } from 'react-redux';
import { useSubscription, useLazyQuery, useMutation } from "@apollo/react-hooks";
import { Link } from 'react-router-dom';
import * as AppActions from 'app/store/actions';
import * as Actions from '../store/actions';
import * as XLSX from 'xlsx';
import { MDText } from 'i18n-react';
import i18n from "../i18n";
import pako from 'pako';
import _ from '@lodash';
import { useEventCallback } from 'rxjs-hooks'
import { debounceTime } from "rxjs/operators";
import { makeStyles } from '@material-ui/styles';
import { SplitButton } from './VehiclesDropButtonGroup';
import { DialogVehiclesImport } from './dialogs/DialogVehiclesImport';

import { OrganizationMngImportVehicle } from '../gql/Vehicle';

const useStyles = makeStyles((theme) => ({
    textUppercase: {
        '& input': {
            textTransform: 'uppercase',
            '&::placeholder': {
                textTransform: 'initial',
            }
        }
    }
}));

const VEHICLE_PLATE = "Placa";

function VehiclesHeader(props) {
    const dispatch = useDispatch();
    const user = useSelector(({ auth }) => auth.user);
    const T = new MDText(i18n.get(user.locale));
    const searchTextFilter = useSelector(({ VehicleManagement }) => VehicleManagement.vehicles.filters.keyword);
    const [searchText, setSearchText] = useState(searchTextFilter)
    const mainTheme = useSelector(({ fuse }) => fuse.settings.mainTheme);
    const options = [T.translate("vehicles.add_new_vehicle"), T.translate("vehicles.import_vehicle")];
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [nameFile, setNameFile] = useState();
    const [dataFile, setDataFile] = useState();
    const [errorFiles, setErrorFiles] = useState(false);
    const [errorFilesMessage, setErrorFilesMessage] = useState('');
    const [open, setOpen] = useState(false);
    const [keywordCallBack, keyword] = useEventCallback(
        (event$) => event$.pipe(debounceTime(500))
    );
    const classes = useStyles();

    //#region import
    const [importVehicle, importVehicleResult] = useMutation(OrganizationMngImportVehicle({}).mutation);

    //#endregion

    function handleFile(file, fileName) {
        if (!file) return;
        setNameFile(file.name);
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: 'binary', cellDates: true });
            const jsonData = {};
            for (let i = 0; i < workbook.SheetNames.length; i++) {
                const sheetName = workbook.SheetNames[i];
                const sheet = workbook.Sheets[sheetName];
                const SheetNameSplit = sheetName.split(" - ");
                for (let index = 0; index < SheetNameSplit.length; index++) {
                    const nameSheet = SheetNameSplit[index];
                    jsonData["vehicles"] = XLSX.utils.sheet_to_json(sheet, { header: 1, blankrows: false });
                }
            }
            const jsonString = JSON.stringify(jsonData);
            const stringBuffer = new Uint8Array([...jsonString].map(char => char.charCodeAt(0)));
            const compressed = pako.deflate(stringBuffer);
            const base64Compressed = Buffer.from(compressed).toString('base64');
            setDataFile(base64Compressed);
        };
        fileReader.readAsArrayBuffer(file);
        setErrorFiles(false);
        setErrorFilesMessage('');
    }

    function handleClickOpen() {
        setOpen(true);
    };

    function handleClose() {
        setOpen(false);
        setNameFile();
    }

    function handleSearchChange(evt) {
        keywordCallBack(evt.target.value.toUpperCase());
        setSearchText(evt.target.value);
    }

    function handleImportVehicle() {
        importVehicle({variables: {vehicleDataCompress: dataFile, organizationId: user.selectedOrganization.id}});
    }

    useEffect(() => {
        if (keyword !== undefined && keyword !== null)
            dispatch(Actions.setVehiclesFilterKeyword(keyword));
    }, [keyword]);

useEffect(()=>{
    if(importVehicleResult && importVehicleResult.data && importVehicleResult.data.OrganizationMngImportVehicle){
        const dataResult = importVehicleResult.data.OrganizationMngImportVehicle;
        const variantOnDispatch =  dataResult.INVALID_DATA > 0 || dataResult.NOT_FOUND > 0 || dataResult.PROCESS_ERROR > 0 || dataResult.MONGO_ERROR > 0 ? "warning": "success";
        dispatch(AppActions.showMessage({ message: T.translate("vehicles.importResult", {...dataResult}), variant: variantOnDispatch }));
        handleClose();
    }
    
},[importVehicleResult])
    return (
        <div className="flex flex-1 w-full items-center justify-between">

            <Hidden lgUp>
                <IconButton
                    onClick={(ev) => props.pageLayout.current.toggleLeftSidebar()}
                    aria-label="open left sidebar"
                >
                    <Icon>filter_list</Icon>
                </IconButton>
            </Hidden>

            <div className="flex items-center">
                <FuseAnimate animation="transition.expandIn" delay={300}>
                    <Icon className="text-32 mr-0 sm:mr-12">directions_bus</Icon>
                </FuseAnimate>
                <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                    <Typography className="hidden sm:flex" variant="h6">{T.translate("vehicles.vehicles")} </Typography>
                </FuseAnimate>
            </div>

            <div className="flex flex-1 items-center justify-center px-12">

                <ThemeProvider theme={mainTheme}>
                    <FuseAnimate animation="transition.slideDownIn" delay={300}>
                        <Paper className="flex items-center w-full max-w-512 px-8 py-4 rounded-8" elevation={1}>

                            <Icon className="mr-8" color="action">search</Icon>

                            <Input
                                placeholder={T.translate("vehicles.search")}
                                className={`flex flex-1 ${classes.textUppercase}`}
                                disableUnderline
                                fullWidth
                                value={searchText}
                                inputProps={{
                                    'aria-label': 'Search'
                                }}
                                onChange={handleSearchChange}
                            />
                        </Paper>
                    </FuseAnimate>
                </ThemeProvider>

            </div>
            {user && user.role.includes('VEHICLE_RES_ADM') &&
                <FuseAnimate animation="transition.slideRightIn" delay={300}>
                    <SplitButton {...{ options, selectedIndex, setSelectedIndex, handleClickOpen }} />
                </FuseAnimate>
            }
            <DialogVehiclesImport {...{ T, open, handleClose, nameFile, handleFile, handleImportVehicle, importVehicleResult }} />
        </div>
    );
}

export default VehiclesHeader;
