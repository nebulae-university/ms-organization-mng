
import React, { useEffect, useState } from 'react';
import { TextField, FormControlLabel, Switch, FormControl, MenuItem, Select, InputLabel, Typography, LinearProgress, Button, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import { useDispatch, useSelector } from 'react-redux';
import * as AppActions from 'app/store/actions';
import * as Yup from "yup";
import _ from '@lodash';
import { COLORS, EMISSIONS_STANDARDS, MANUFACTURERS, SCHEMA_TYPES, TYPES, OWNERSHIPS, FUEL_TYPES } from '../../enums';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
    textForm: {
        '& input': {
            textTransform: "uppercase"
        }
    }
}));

/**
 * Basic Info validators
 * @param {*} T 
 */
export function basicInfoFormValidationsGenerator(T) {
    return {
        plate: Yup.string()
            .matches(/[A-Za-z]{3}[0-9]{3}/, T.translate("vehicle.form_validations.plate.regex"))
            .min(6, T.translate("vehicle.form_validations.plate.length", { len: 6 }))
            .max(6, T.translate("vehicle.form_validations.plate.length", { len: 6 }))
            .required(T.translate("vehicle.form_validations.plate.required")),
        year: Yup.number()
            .typeError("vehicle.form_validations.year.not_a_number")
            .min(1900, T.translate("vehicle.form_validations.year.min", { year: 1900 }))
            .max(new Date().getFullYear() + 1, T.translate("vehicle.form_validations.year.max", { year: new Date().getFullYear() + 1 })),
        fuelRangeWithFullTank: Yup.number()
            .typeError("vehicle.form_validations.fuelRangeWithFullTank.not_a_number")
            .min(0, T.translate("vehicle.form_validations.fuelRangeWithFullTank.min", { capacity: 0 }))
            .max(1000, T.translate("vehicle.form_validations.fuelRangeWithFullTank.max", { capacity: 1000 }))
    };
}

/**
 * Basic Info -> Capacity validators
 * @param {*} T 
 */
export function basicInfoCapacityFormValidationsGenerator(T) {
    return {
        seated: Yup.number()
            .typeError("vehicle.form_validations.capacity.seated.not_a_number")
            .min(0, T.translate("vehicle.form_validations.capacity.seated.min", { capacity: 0 }))
            .max(500, T.translate("vehicle.form_validations.capacity.seated.max", { capacity: 500 })),
        standing: Yup.number()
            .typeError("vehicle.form_validations.capacity.standing.not_a_number")
            .min(0, T.translate("vehicle.form_validations.capacity.standing.min", { capacity: 0 }))
            .max(500, T.translate("vehicle.form_validations.capacity.standing.max", { capacity: 500 }))
    };
}


/**
 * Aggregate BasicInfo form
 * @param {{dataSource,T}} props 
 */
export function BasicInfo(props) {
    const { dataSource: form, T, onChange, errors, touched, canWrite, setFieldValue, errorModel, setErrorModel, errorDeviceId, setErrorDeviceId, errorChasisNumber, setErrorChasisNumber, errorInternalNumber, setErrorInternalNumber, errorEngineNumber, setErrorEngineNumber, setForm, companyOptions, companyId, setCompanyId, queryCompaniesResult, loggedUser, errorBodyworkBrand, setErrorBodyworkBrand } = props;
    const dispatch = useDispatch();
    const classes = useStyles();

    const capacityErrors = (fieldName) => {
        if (errors.capacity && touched.capacity) {
            return errors.capacity[fieldName] && touched.capacity[fieldName];
        }
    }

    const capacityTouched = (fieldName) => {
        if (errors.capacity && touched.capacity) {
            return (errors.capacity[fieldName] && touched.capacity[fieldName]) && errors.capacity[fieldName];
        }
    }

    function companyIdModified(selected) {
        const value = selected ? selected.id : undefined;
        setFieldValue("companyId", value);
        setCompanyId(value);
    }

    function handleModelChange(event) {
        const newVal = event.target.value.trim();
        const nameRegex = /^[ _\-A-Z0-9]+$/;
        if (!newVal || newVal === "") {
            setErrorModel(undefined);
        }
        else if (!nameRegex.test(newVal)) {
            setErrorModel(T.translate("vehicle.form_validations.model.invalid_format"));
        }
        else {
            setErrorModel(undefined);
        }
        onChange("model")(event)
    }

    function handleChassisNumber(event) {
        const newVal = event.target.value.trim();
        const nameRegex = /^[ _\-A-Z0-9]+$/;
        if (!newVal || newVal === "") {
            setErrorChasisNumber(undefined);
        }
        else if (!nameRegex.test(newVal)) {
            setErrorChasisNumber(T.translate("vehicle.form_validations.chasisNumber.invalid_format"));
        }
        else {
            setErrorChasisNumber(undefined);
        }
        onChange("chasisNumber")(event)
    }

    function handleInternalNumber(event) {
        const newVal = event.target.value.trim();
        const nameRegex = /^[ _\-A-Z0-9]+$/;
        if (!newVal || newVal === "") {
            setErrorInternalNumber(undefined);
        }
        else if (!nameRegex.test(newVal)) {
            setErrorInternalNumber(T.translate("vehicle.form_validations.internalNumber.invalid_format"));
        }
        else {
            setErrorInternalNumber(undefined);
        }
        onChange("internalNumber")(event)
    }

    function handleBodyworkBrand(event) {
        const newVal = event.target.value.trim().toUpperCase();
        const nameRegex = /^[A-Z0-9-_ .,]{0,50}$/gm;
        if (!newVal || newVal === "") {
            setErrorBodyworkBrand(undefined);
        }
        else if (!nameRegex.test(newVal)) {
            setErrorBodyworkBrand(T.translate("vehicle.form_validations.bodyworkBrand.invalid_format"));
        }
        else {
            setErrorBodyworkBrand(undefined);
        }
        onChange("bodyworkBrand")(event)
    }

    function handleEngineNumber(event) {
        const newVal = event.target.value.trim();
        const nameRegex = /^[ _\-A-Z0-9]+$/;
        if (!newVal || newVal === "") {
            setErrorEngineNumber(undefined);
        }
        else if (!nameRegex.test(newVal)) {
            setErrorEngineNumber(T.translate("vehicle.form_validations.engineNumber.invalid_format"));
        }
        else {
            setErrorEngineNumber(undefined);
        }
        onChange("engineNumber")(event)
    }

    function handleDeviceId(event) {
        const newVal = event.target.value.trim();
        const nameRegex = /^([A-Z0-9\-\_]+)$/;
        if (!newVal || newVal === "") {
            setErrorDeviceId(undefined);
        }
        else if (!nameRegex.test(newVal)) {
            setErrorDeviceId(T.translate("vehicle.form_validations.deviceId.invalid_format"));
        }
        else {
            setErrorDeviceId(undefined);
        }
        onChange("deviceId")(event)
    }

    /**
     * Handles contract selection change
     * @param {*} evt 
     * @param {*} selectedContracts 
     */
    function handleCompanyChange(evt, selected) {
        if (!canWrite()) return;
        if (companyId) {
            dispatch(AppActions.openDialog({
                children: (
                    <React.Fragment>
                        <DialogTitle id="alert-dialog-title">{T.translate("vehicle.change_company_tittle")}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                {T.translate("vehicle.change_company_description")}
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => { dispatch(AppActions.closeDialog()); }} color="primary">
                                {T.translate("vehicle.change_company_no")}
                            </Button>
                            <Button onClick={() => { dispatch(AppActions.closeDialog()); companyIdModified(selected) }} color="primary" autoFocus>
                                {T.translate("vehicle.change_company_yes")}
                            </Button>
                        </DialogActions>
                    </React.Fragment>
                )
            }));
        } else {
            companyIdModified(selected);
        }
    };

    //Responsive className
    const full_half_quarter = "mt-8 mb-16 w-full p-2 sm:w-1/2 md:w-1/4";

    // color filter options
    const colorFilterOptions = createFilterOptions({
        stringify: color => T.translate(`vehicle.colors.${color}`),
    });

    return (

        <div>
            <form autoComplete="off">
                <TextField
                    className={`${full_half_quarter} ${classes.textForm}`}
                    helperText={errors.plate}
                    error={errors.plate}
                    required
                    label={T.translate("vehicle.plate")}
                    id="plate"
                    name="plate"
                    value={form.plate}
                    onChange={onChange("plate")}
                    onBlur={onChange("plate")}
                    variant="outlined"
                    InputProps={{
                        readOnly: !canWrite(),
                    }}
                />

                <FormControl variant="outlined" className={full_half_quarter} >
                    <InputLabel htmlFor="ownership">
                        {T.translate("vehicle.ownership")}
                    </InputLabel>
                    <Select
                        disabled={!canWrite()}
                        labelWidth={130}
                        value={form.ownership}
                        onChange={({ target: { value } }) => { setFieldValue("ownership", value); setForm({ ...form, ownership: value }); }}
                    >
                        {
                            OWNERSHIPS.map(i => <MenuItem key={i} value={i}> {T.translate(`vehicle.ownerships.${i}`)} </MenuItem>)
                        }
                    </Select>
                </FormControl>

                <FormControl variant="outlined"
                    className={full_half_quarter} >
                    <InputLabel htmlFor="type">
                        {T.translate("vehicle.type")}
                    </InputLabel>
                    <Select
                        disabled={!canWrite()}
                        labelWidth={70}
                        value={form.type}
                        onChange={({ target: { value } }) => { setFieldValue("type", value); setForm({ ...form, type: value }) }}
                    >
                        {
                            TYPES.map(i => <MenuItem key={i} value={i}> {T.translate(`vehicle.types.${i}`)} </MenuItem>)
                        }
                    </Select>
                </FormControl>



                <FormControl variant="outlined" className={full_half_quarter} >
                    <InputLabel htmlFor="manufacturer">
                        {T.translate("vehicle.manufacturer")}
                    </InputLabel>
                    <Select
                        disabled={!canWrite()}
                        labelWidth={70}
                        value={form.manufacturer}
                        onChange={({ target: { value } }) => { setFieldValue("manufacturer", value); setForm({ ...form, manufacturer: value }); }}
                    >
                        {
                            MANUFACTURERS.map(i => <MenuItem key={i} value={i}> {i} </MenuItem>)
                        }
                    </Select>
                </FormControl>



                <TextField
                    className={full_half_quarter}
                    helperText={errorModel}
                    error={errorModel}
                    label={T.translate("vehicle.model")}
                    id="model"
                    name="model"
                    value={(form.model || '').trim()}
                    onChange={handleModelChange}
                    onBlur={handleModelChange}
                    variant="outlined"

                    InputProps={{
                        readOnly: !canWrite(),
                    }}
                />


                <TextField
                    className={full_half_quarter}
                    helperText={(errors.year && touched.year) && errors.year}
                    error={errors.year && touched.year}
                    type="number"
                    label={T.translate("vehicle.year")}
                    id="year"
                    name="year"
                    value={form.year}
                    onChange={onChange("year")}
                    onBlur={onChange("year")}
                    variant="outlined"

                    InputProps={{
                        readOnly: !canWrite(),
                    }}
                />


                <FormControl variant="outlined" className={full_half_quarter}  >
                    <InputLabel htmlFor="fuelTypes">
                        {T.translate("vehicle.fuelType")}
                    </InputLabel>
                    <Select
                        disabled={!canWrite()}
                        labelWidth={140}
                        value={form.fuelType}
                        onChange={({ target: { value } }) => { setFieldValue("fuelType", value); setForm({ ...form, fuelType: value }); }}
                    >
                        {
                            FUEL_TYPES.map(i => <MenuItem key={i} value={i}> {T.translate(`vehicle.fuelTypes.${i}`)} </MenuItem>)
                        }
                    </Select>
                </FormControl>

                <FormControl variant="outlined" className={full_half_quarter}  >
                    <InputLabel htmlFor="emissionsStandard">
                        {T.translate("vehicle.emissionsStandard")}
                    </InputLabel>
                    <Select
                        disabled={!canWrite()}
                        labelWidth={140}
                        value={form.emissionsStandard}
                        onChange={({ target: { value } }) => { setFieldValue("emissionsStandard", value); setForm({ ...form, emissionsStandard: value }); }}
                    >
                        {
                            EMISSIONS_STANDARDS.map(i => <MenuItem key={i} value={i}> {i} </MenuItem>)
                        }
                    </Select>
                </FormControl>



                <FormControl variant="outlined" className={full_half_quarter}  >
                    <InputLabel htmlFor="schemaType">
                        {T.translate("vehicle.schemaType")}
                    </InputLabel>
                    <Select
                        disabled={!canWrite()}
                        labelWidth={100}
                        value={form.schemaType}
                        onChange={({ target: { value } }) => { setFieldValue("schemaType", value); setForm({ ...form, schemaType: value }); }}
                    >
                        {
                            SCHEMA_TYPES.map(i => <MenuItem key={i} value={i}> {T.translate(`vehicle.schemaTypes.${i}`)} </MenuItem>)
                        }
                    </Select>
                </FormControl>


                <TextField
                    className={full_half_quarter}
                    helperText={errorChasisNumber}
                    error={errorChasisNumber}
                    label={T.translate("vehicle.chassisNumber")}
                    id="chassisNumber"
                    name="chassisNumber"
                    value={(form.chassisNumber || '').trim()}
                    onChange={handleChassisNumber}
                    onBlur={handleChassisNumber}
                    variant="outlined"

                    InputProps={{
                        readOnly: !canWrite(),
                    }}
                />



                <TextField
                    className={full_half_quarter}
                    helperText={errorEngineNumber}
                    error={errorEngineNumber}
                    label={T.translate("vehicle.engineNumber")}
                    id="engineNumber"
                    name="engineNumber"
                    value={(form.engineNumber || '').trim()}
                    onChange={handleEngineNumber}
                    onBlur={handleEngineNumber}
                    variant="outlined"

                    InputProps={{
                        readOnly: !canWrite(),
                    }}
                />


                <TextField
                    className={full_half_quarter}
                    helperText={capacityTouched("seated")}
                    error={capacityErrors("seated")}
                    type="number"
                    label={T.translate("vehicle.capacity.seated")}
                    id="capacity.seated"
                    name="capacity.seated"
                    value={form.capacity.seated}
                    onChange={onChange("capacity.seated")}
                    onBlur={onChange("capacity.seated")}
                    variant="outlined"

                    InputProps={{
                        readOnly: !canWrite(),
                    }}
                />


                <TextField
                    className={full_half_quarter}
                    helperText={capacityTouched("standing")}
                    error={capacityErrors("standing")}
                    type="number"
                    label={T.translate("vehicle.capacity.standing")}
                    id="capacity.standing"
                    name="capacity.standing"
                    value={form.capacity.standing}
                    onChange={onChange("capacity.standing")}
                    onBlur={onChange("capacity.standing")}
                    variant="outlined"

                    InputProps={{
                        readOnly: !canWrite(),
                    }}
                />

                <TextField
                    className={full_half_quarter}
                    helperText={errorInternalNumber}
                    error={errorInternalNumber}
                    label={T.translate("vehicle.internalNumber")}
                    id="internalNumber"
                    name="internalNumber"
                    value={(form.internalNumber || '').trim()}
                    onChange={handleInternalNumber}
                    onBlur={handleInternalNumber}
                    variant="outlined"

                    InputProps={{
                        readOnly: !canWrite(),
                    }}
                />

                <TextField
                    className={full_half_quarter}
                    helperText={errorDeviceId}
                    error={errorDeviceId}
                    label={T.translate("vehicle.deviceId")}
                    id="devSerial"
                    name="devSerial"
                    value={(form.devSerial || "")}
                    variant="outlined"
                    InputProps={{
                        readOnly: true,
                    }}
                />

                <TextField
                    className={full_half_quarter}
                    helperText={errorDeviceId}
                    error={errorDeviceId}
                    label={T.translate("vehicle.platformId")}
                    id="deviceId"
                    name="deviceId"
                    value={form.deviceId}
                    variant="outlined"
                    InputProps={{
                        readOnly: true,
                    }}
                />

                <TextField
                    className={full_half_quarter}
                    helperText={(errors.fuelRangeWithFullTank && touched.fuelRangeWithFullTank) && errors.fuelRangeWithFullTank}
                    error={errors.fuelRangeWithFullTank && touched.fuelRangeWithFullTank}
                    type="number"
                    label={T.translate("vehicle.fuelRangeWithFullTank")}
                    id="fuelRangeWithFullTank"
                    name="fuelRangeWithFullTank"
                    value={form.fuelRangeWithFullTank}
                    onChange={onChange("fuelRangeWithFullTank")}
                    onBlur={onChange("fuelRangeWithFullTank")}
                    variant="outlined"

                    InputProps={{
                        readOnly: !canWrite(),
                    }}
                />

                <div className='w-full'>
                    <Autocomplete
                        className={`w-full sm:w-2/4 sm:pr-4 sm:pl-4 mb-16 inline-flex`}
                        multiple filterSelectedOptions
                        id="colors" getOptionLabel={option => T.translate(`vehicle.colors.${option}`)}
                        filterOptions={colorFilterOptions}
                        options={COLORS}
                        value={form.colors}
                        onChange={(evt, selectedColors) => { if (!canWrite()) return; setFieldValue("colors", selectedColors); setForm({ ...form, colors: selectedColors }); }}
                        disabled={!canWrite()}
                        renderInput={params => (
                            <TextField
                                fullWidth
                                {...params} variant="outlined" margin="normal"
                                placeholder={T.translate("vehicle.colorsLabel")}
                            />
                        )}
                    />

                    <TextField
                        className={`w-full sm:w-2/4 sm:pr-4 sm:pl-4 mt-5 mb-16 inline-flex ${classes.textForm}`}
                        helperText={errorBodyworkBrand}
                        error={errorBodyworkBrand}
                        label={T.translate("vehicle.bodyworkBrand")}
                        id="bodyworkBrand"
                        name="bodyworkBrand"
                        value={form.bodyworkBrand}
                        onChange={handleBodyworkBrand}
                        onBlur={handleBodyworkBrand}
                        variant="outlined"

                        InputProps={{
                            readOnly: !canWrite(),
                        }}
                    />
                </div>

                <Typography className="mt-8  text-16 sm:text-20 truncate" color="inherit">
                    {T.translate("vehicle.company")}
                </Typography>
                <FormControl className="w-full mt-8 mb-8">
                    {(queryCompaniesResult.loading) ? (<LinearProgress className="m-8 mt-32" />) : (
                        <Autocomplete
                            id="companyId"
                            options={companyOptions}
                            className="w-full"
                            getOptionLabel={option => option.name}
                            value={companyId}
                            onChange={handleCompanyChange}
                            renderInput={
                                params => {
                                    params.inputProps.autoComplete = "off";
                                    params.inputProps.value = ((companyOptions || []).find(x => x.id === companyId) || { name: params.inputProps.value }).name;
                                    if (companyId && companyId.length > 0) {
                                        params.helperText = "";
                                        params.error = false;
                                    }
                                    else {
                                        params.helperText = T.translate("vehicle.form_validations.company.required");
                                        params.error = true
                                    }

                                    return (<TextField {...params}
                                        variant="outlined" fullWidth />)
                                }
                            }
                        />)}
                </FormControl>
                
                <FormControlLabel
                    control={
                        <Switch
                            checked={form.hasDriverDoor}
                            onChange={onChange("hasDriverDoor")}
                            id="hasDriverDoor"
                            name="hasDriverDoor"
                            value={ form.hasDriverDoor == null ? false : form.hasDriverDoor }
                            inputProps={{ 'aria-label': 'primary checkbox' }}
                            variant="outlined"
                            disabled={!canWrite()}
                        />
                    }
                    label={T.translate("vehicle.hasDriverDoor")}
                />

                <FormControlLabel
                    control={
                        <Switch
                            checked={form.active}
                            onChange={onChange("active")}
                            id="active"
                            name="active"
                            value={form.active}
                            inputProps={{ 'aria-label': 'primary checkbox' }}
                            variant="outlined"
                            disabled={!canWrite()}
                        />
                    }
                    label={T.translate("vehicle.active")}
                />

            </form>
        </div>
    );
}

