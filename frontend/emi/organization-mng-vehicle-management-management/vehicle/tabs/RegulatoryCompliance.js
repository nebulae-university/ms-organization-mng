
import React, { useEffect, useState } from 'react';
import { TextField, Typography } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import * as Yup from "yup";
import _ from '@lodash';
import enLocale from "date-fns/locale/en-US";
import esLocale from "date-fns/locale/es";

const localeMap = {
    en_US: enLocale,
    es_CO: esLocale,
};

/**
 * Basic Info validators
 * @param {*} T 
 */
export function regulatoryComplianceFormValidationsGenerator(T) {
    return {
    };
}


/**
 * Aggregate RegulatoryCompliance form
 * @param {{dataSource,T}} props 
 */
export function RegulatoryCompliance(props) {
    const { dataSource: form, T, onChange, setRegulatoryComplianceWithErrors, errors, touched, canWrite, customCanWrite, setFieldValue, setForm, loggedUser } = props;
    const [errorCardExpeditionDate, setErrorCardExpeditionDate] = useState();
    const [errorCardExpirationDate, setErrorCardExpirationDate] = useState();

    const [errorMandatoryInsuranceExpeditionDate, setErrorMandatoryInsuranceExpeditionDate] = useState();
    const [errorMandatoryInsuranceExpirationDate, setErrorMandatoryInsuranceExpirationDate] = useState();

    const [errorTechnomechanicalExpeditionDate, setErrorTechnomechanicalExpeditionDate] = useState();
    const [errorTechnomechanicalExpirationDate, setErrorTechnomechanicalExpirationDate] = useState();

    const [errorcarInsuranceExpeditionDate, setErrorcarInsuranceExpeditionDate] = useState();
    const [errorcarInsuranceExpirationDate, setErrorcarInsuranceExpirationDate] = useState();
    
    const regulatoryComplianceErrors = (fieldName) => {
        if (errors.regulatoryCompliance && touched.regulatoryCompliance) {
            return errors.regulatoryCompliance[fieldName] && touched.regulatoryCompliance[fieldName];
        }
    }; 

    const regulatoryComplianceTouched = (fieldName) => {
        if (errors.regulatoryCompliance && touched.regulatoryCompliance) {
            return (errors.regulatoryCompliance[fieldName] && touched.regulatoryCompliance[fieldName]) && errors.regulatoryCompliance[fieldName];
        }
    }

    function handleCardExpeditionDateChange(date) {
        if (date && !isNaN(date.getTime())) {
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            const expirationDate = new Date(date.getFullYear()+1 , date.getMonth(), date.getDate());
            setFieldValue("regulatoryCompliance.operationCardExpeditionDate", date.getTime());
            setForm({ ...form, regulatoryCompliance: { ...form.regulatoryCompliance, operationCardExpeditionDate: date.getTime(), operationCardExpirationDate: expirationDate.getTime() } });
            setErrorCardExpeditionDate(undefined);
            setErrorCardExpirationDate(undefined);
        } else {
            setErrorCardExpeditionDate(T.translate("vehicle.invalid_date"));
        }
    }

    function handleCardExpirationDateChange(date) {
        if (date && !isNaN(date.getTime())) {
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            if(date.getTime()<= (((form || {}).regulatoryCompliance || {}).operationCardExpeditionDate || 0)){
                setErrorCardExpirationDate(T.translate("vehicle.lower_than_expedition_date"));    
            }else{ 
                setErrorCardExpirationDate(undefined);
            }
            setFieldValue("regulatoryCompliance.operationCardExpirationDate", date.getTime());
            setForm({ ...form, regulatoryCompliance: { ...form.regulatoryCompliance, operationCardExpirationDate: date.getTime() } });
        } 
        else {
            setErrorCardExpirationDate(T.translate("vehicle.invalid_date"));
        }
    }


    function handleMandatoryInsuranceExpeditionDateChange(date) {
        if (date && !isNaN(date.getTime())) {
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            const expirationDate = new Date(date.getFullYear()+1 , date.getMonth(), date.getDate());
            setFieldValue("regulatoryCompliance.mandatoryInsuranceExpeditionDate", date.getTime());
            setForm({ ...form, regulatoryCompliance: { ...form.regulatoryCompliance, mandatoryInsuranceExpeditionDate: date.getTime(), mandatoryInsuranceExpirationDate: expirationDate.getTime() } });
            setErrorMandatoryInsuranceExpeditionDate(undefined);
            setErrorMandatoryInsuranceExpirationDate(undefined);
        } else {
            setErrorMandatoryInsuranceExpeditionDate(T.translate("vehicle.invalid_date"));
        }
    }

    function handleMandatoryInsuranceExpirationDateChange(date) {
        if (date && !isNaN(date.getTime())) {
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            if(date.getTime()<= (((form || {}).regulatoryCompliance || {}).mandatoryInsuranceExpeditionDate || 0)){
                setErrorMandatoryInsuranceExpirationDate(T.translate("vehicle.lower_than_expedition_date"));    
            }else{ 
                setErrorMandatoryInsuranceExpirationDate(undefined);
            }
            setFieldValue("regulatoryCompliance.mandatoryInsuranceExpirationDate", date.getTime());
            setForm({ ...form, regulatoryCompliance: { ...form.regulatoryCompliance, mandatoryInsuranceExpirationDate: date.getTime() } });
        } 
        else {
            setErrorMandatoryInsuranceExpirationDate(T.translate("vehicle.invalid_date"));
        }
    }

    
    function handleTechnomechanicalExpeditionDateChange(date) {
        if (date && !isNaN(date.getTime())) {
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            const expirationDate = new Date(date.getFullYear()+1 , date.getMonth(), date.getDate());
            setFieldValue("regulatoryCompliance.technomechanicalExpeditionDate", date.getTime());
            setForm({ ...form, regulatoryCompliance: { ...form.regulatoryCompliance, technomechanicalExpeditionDate: date.getTime(), technomechanicalExpirationDate: expirationDate.getTime() } });
            setErrorTechnomechanicalExpeditionDate(undefined);
            setErrorTechnomechanicalExpirationDate(undefined);
        } else {
            setErrorTechnomechanicalExpeditionDate(T.translate("vehicle.invalid_date"));
        }
    }

    function handleTechnomechanicalExpirationDateChange(date) {
        if (date && !isNaN(date.getTime())) {
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            if(date.getTime()<= (((form || {}).regulatoryCompliance || {}).technomechanicalExpeditionDate || 0)){
                setErrorTechnomechanicalExpirationDate(T.translate("vehicle.lower_than_expedition_date"));    
            }else{ 
                setErrorTechnomechanicalExpirationDate(undefined);
            }
            setFieldValue("regulatoryCompliance.technomechanicalExpirationDate", date.getTime());
            setForm({ ...form, regulatoryCompliance: { ...form.regulatoryCompliance, technomechanicalExpirationDate: date.getTime() } });
        } 
        else {
            setErrorTechnomechanicalExpirationDate(T.translate("vehicle.invalid_date"));
        }
    }

    function handlecarInsuranceExpeditionDateChange(date) {
        if (date && !isNaN(date.getTime())) {
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            const expirationDate = new Date(date.getFullYear()+1 , date.getMonth(), date.getDate());
            setFieldValue("regulatoryCompliance.carInsuranceExpeditionDate", date.getTime());
            setForm({ ...form, regulatoryCompliance: { ...form.regulatoryCompliance, carInsuranceExpeditionDate: date.getTime(), carInsuranceExpirationDate: expirationDate.getTime() } });
            setErrorcarInsuranceExpeditionDate(undefined);
            setErrorcarInsuranceExpirationDate(undefined);
        } else {
            setErrorcarInsuranceExpeditionDate(T.translate("vehicle.invalid_date"));
        }
    }

    function handlecarInsuranceExpirationDateChange(date) {
        if (date && !isNaN(date.getTime())) {
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            if(date.getTime()<= (((form || {}).regulatoryCompliance || {}).carInsuranceExpeditionDate || 0)){
                setErrorcarInsuranceExpirationDate(T.translate("vehicle.lower_than_expedition_date"));    
            }else{ 
                setErrorcarInsuranceExpirationDate(undefined);
            }
            setFieldValue("regulatoryCompliance.carInsuranceExpirationDate", date.getTime());
            setForm({ ...form, regulatoryCompliance: { ...form.regulatoryCompliance, carInsuranceExpirationDate: date.getTime() } });
        } 
        else {
            setErrorcarInsuranceExpirationDate(T.translate("vehicle.invalid_date"));
        }
    }

    useEffect(() => {
        setRegulatoryComplianceWithErrors(
            errorTechnomechanicalExpirationDate || errorCardExpirationDate || errorMandatoryInsuranceExpirationDate || errorTechnomechanicalExpeditionDate || errorCardExpeditionDate || errorMandatoryInsuranceExpeditionDate || errorcarInsuranceExpeditionDate || errorcarInsuranceExpirationDate ? true : false
            )
    }, [errorTechnomechanicalExpirationDate, errorCardExpirationDate, errorMandatoryInsuranceExpirationDate, errorTechnomechanicalExpeditionDate, errorCardExpeditionDate, errorMandatoryInsuranceExpeditionDate, errorcarInsuranceExpeditionDate, errorcarInsuranceExpirationDate])
    const getLocale = () => {
        return loggedUser ? localeMap[loggedUser.locale] : enLocale
    }

    //Responsive className
    const full_half = "mt-8 mb-16 w-full p-2 sm:w-1/2";

    return (

        <div>

            <Typography className="mt-8  text-16 sm:text-20 truncate" color="inherit">
                {T.translate("vehicle.regulatoryCompliance.operationCard")}
            </Typography>

            <TextField
                className={full_half}
                disabled={!customCanWrite()}
                helperText={regulatoryComplianceTouched("operationCardNumber")}
                error={regulatoryComplianceErrors("operationCardNumber")}
                label={T.translate("vehicle.regulatoryCompliance.operationCardNumber")}
                id="regulatoryCompliance.operationCardNumber"
                name="regulatoryCompliance.operationCardNumber"
                value={form.regulatoryCompliance.operationCardNumber}
                onChange={onChange("regulatoryCompliance.operationCardNumber")}
                onBlur={onChange("regulatoryCompliance.operationCardNumber")}
                variant="outlined"
            />
            <TextField
                className={full_half}
                disabled={!customCanWrite()}
                helperText={regulatoryComplianceTouched("operationCardCompany")}
                error={regulatoryComplianceErrors("operationCardCompany")}
                label={T.translate("vehicle.regulatoryCompliance.operationCardCompany")}
                id="regulatoryCompliance.operationCardCompany"
                name="regulatoryCompliance.operationCardCompany"
                value={form.regulatoryCompliance.operationCardCompany}
                onChange={onChange("regulatoryCompliance.operationCardCompany")}
                onBlur={onChange("regulatoryCompliance.operationCardCompany")}
                variant="outlined"
            />
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={getLocale()}>
                <KeyboardDatePicker
                    className={full_half}
                    margin="normal"
                    disabled={!customCanWrite()}
                    id="regulatoryCompliance.operationCardExpeditionDate"
                    label={T.translate("vehicle.regulatoryCompliance.operationCardExpeditionDate")}
                    required
                    error={errorCardExpeditionDate}
                    helperText={errorCardExpeditionDate}
                    format="MM/dd/yyyy"
                    value={new Date().setTime(form.regulatoryCompliance.operationCardExpeditionDate)}
                    onChange={handleCardExpeditionDateChange}
                    KeyboardButtonProps={{
                        'aria-label': 'change date',
                    }}
                />
            </MuiPickersUtilsProvider>
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={getLocale()}>
                <KeyboardDatePicker
                    disabled={!customCanWrite()}
                    className={full_half}
                    margin="normal"
                    id="regulatoryCompliance.operationCardExpirationDate"
                    label={T.translate("vehicle.regulatoryCompliance.operationCardExpirationDate")}
                    required
                    error={errorCardExpirationDate}
                    helperText={errorCardExpirationDate}
                    format="MM/dd/yyyy"
                    value={new Date().setTime(form.regulatoryCompliance.operationCardExpirationDate)}
                    onChange={handleCardExpirationDateChange}
                    KeyboardButtonProps={{
                        'aria-label': 'change date',
                    }}
                />
            </MuiPickersUtilsProvider>
            <TextField
                className={full_half}
                disabled={!customCanWrite()}
                helperText={regulatoryComplianceTouched("operationCardInternalNumber")}
                error={regulatoryComplianceErrors("operationCardInternalNumber")}
                label={T.translate("vehicle.regulatoryCompliance.operationCardInternalNumber")}
                id="regulatoryCompliance.operationCardInternalNumber"
                name="regulatoryCompliance.operationCardInternalNumber"
                value={form.regulatoryCompliance.operationCardInternalNumber}
                onChange={onChange("regulatoryCompliance.operationCardInternalNumber")}
                onBlur={onChange("regulatoryCompliance.operationCardInternalNumber")}
                variant="outlined"
            />


            <Typography className="mt-8  text-16 sm:text-20 truncate" color="inherit">
                {T.translate("vehicle.regulatoryCompliance.mandatoryInsurance")}
            </Typography>

            <TextField
                className={full_half}
                disabled={!customCanWrite()}
                helperText={regulatoryComplianceTouched("mandatoryInsuranceNumber")}
                error={regulatoryComplianceErrors("mandatoryInsuranceNumber")}
                label={T.translate("vehicle.regulatoryCompliance.mandatoryInsuranceNumber")}
                id="regulatoryCompliance.mandatoryInsuranceNumber"
                name="regulatoryCompliance.mandatoryInsuranceNumber"
                value={form.regulatoryCompliance.mandatoryInsuranceNumber}
                onChange={onChange("regulatoryCompliance.mandatoryInsuranceNumber")}
                onBlur={onChange("regulatoryCompliance.mandatoryInsuranceNumber")}
                variant="outlined"
            />
            <TextField
                className={full_half}
                disabled={!customCanWrite()}
                helperText={regulatoryComplianceTouched("mandatoryInsuranceIssuer")}
                error={regulatoryComplianceErrors("mandatoryInsuranceIssuer")}
                label={T.translate("vehicle.regulatoryCompliance.mandatoryInsuranceIssuer")}
                id="regulatoryCompliance.mandatoryInsuranceIssuer"
                name="regulatoryCompliance.mandatoryInsuranceIssuer"
                value={form.regulatoryCompliance.mandatoryInsuranceIssuer}
                onChange={onChange("regulatoryCompliance.mandatoryInsuranceIssuer")}
                onBlur={onChange("regulatoryCompliance.mandatoryInsuranceIssuer")}
                variant="outlined"
            />
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={getLocale()}>
                <KeyboardDatePicker
                    disabled={!customCanWrite()}
                    className={full_half}
                    margin="normal"
                    id="regulatoryCompliance.mandatoryInsuranceExpeditionDate"
                    label={T.translate("vehicle.regulatoryCompliance.mandatoryInsuranceExpeditionDate")}
                    required
                    error={errorMandatoryInsuranceExpeditionDate}
                    helperText={errorMandatoryInsuranceExpeditionDate}
                    format="MM/dd/yyyy"
                    value={new Date().setTime(form.regulatoryCompliance.mandatoryInsuranceExpeditionDate)}
                    onChange={handleMandatoryInsuranceExpeditionDateChange}
                    KeyboardButtonProps={{
                        'aria-label': 'change date',
                    }}
                />
            </MuiPickersUtilsProvider>
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={getLocale()}>
                <KeyboardDatePicker
                    disabled={!customCanWrite()}
                    className={full_half}
                    margin="normal"
                    id="regulatoryCompliance.mandatoryInsuranceExpirationDate"
                    label={T.translate("vehicle.regulatoryCompliance.mandatoryInsuranceExpirationDate")}
                    required
                    error={errorMandatoryInsuranceExpirationDate}
                    helperText={errorMandatoryInsuranceExpirationDate}
                    format="MM/dd/yyyy"
                    value={new Date().setTime(form.regulatoryCompliance.mandatoryInsuranceExpirationDate)}
                    onChange={handleMandatoryInsuranceExpirationDateChange}
                    KeyboardButtonProps={{
                        'aria-label': 'change date',
                    }}
                />
            </MuiPickersUtilsProvider>


            <Typography className="mt-8 text-16 sm:text-20 truncate" color="inherit">
                {T.translate("vehicle.regulatoryCompliance.technomechanical")}
            </Typography>


            <TextField
                className={full_half}
                disabled={!customCanWrite()}
                helperText={regulatoryComplianceTouched("technomechanicalNumber")}
                error={regulatoryComplianceErrors("technomechanicalNumber")}
                label={T.translate("vehicle.regulatoryCompliance.technomechanicalNumber")}
                id="regulatoryCompliance.technomechanicalNumber"
                name="regulatoryCompliance.technomechanicalNumber"
                value={form.regulatoryCompliance.technomechanicalNumber}
                onChange={onChange("regulatoryCompliance.technomechanicalNumber")}
                onBlur={onChange("regulatoryCompliance.technomechanicalNumber")}
                variant="outlined"
            />
            <TextField
                className={full_half}
                disabled={!customCanWrite()}
                helperText={regulatoryComplianceTouched("technomechanicalIssuer")}
                error={regulatoryComplianceErrors("technomechanicalIssuer")}
                label={T.translate("vehicle.regulatoryCompliance.technomechanicalIssuer")}
                id="regulatoryCompliance.technomechanicalIssuer"
                name="regulatoryCompliance.technomechanicalIssuer"
                value={form.regulatoryCompliance.technomechanicalIssuer}
                onChange={onChange("regulatoryCompliance.technomechanicalIssuer")}
                onBlur={onChange("regulatoryCompliance.technomechanicalIssuer")}
                variant="outlined"
            />
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={getLocale()}>
                <KeyboardDatePicker
                    disabled={!customCanWrite()}
                    className={full_half}
                    margin="normal"
                    id="regulatoryCompliance.technomechanicalExpeditionDate"
                    label={T.translate("vehicle.regulatoryCompliance.technomechanicalExpeditionDate")}
                    required 
                    error={errorTechnomechanicalExpeditionDate}
                    helperText={errorTechnomechanicalExpeditionDate}
                    format="MM/dd/yyyy"
                    value={new Date().setTime(form.regulatoryCompliance.technomechanicalExpeditionDate)}
                    onChange={handleTechnomechanicalExpeditionDateChange}
                    KeyboardButtonProps={{
                        'aria-label': 'change date',
                    }}
                />
            </MuiPickersUtilsProvider>
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={getLocale()}>
                <KeyboardDatePicker
                    disabled={!customCanWrite()}
                    className={full_half}
                    margin="normal"
                    id="regulatoryCompliance.technomechanicalExpirationDate"
                    label={T.translate("vehicle.regulatoryCompliance.technomechanicalExpirationDate")}
                    format="MM/dd/yyyy"
                    required
                    error={errorTechnomechanicalExpirationDate}
                    helperText={errorTechnomechanicalExpirationDate}
                    value={new Date().setTime(form.regulatoryCompliance.technomechanicalExpirationDate)}
                    onChange={handleTechnomechanicalExpirationDateChange}
                    KeyboardButtonProps={{
                        'aria-label': 'change date',
                    }}
                />
            </MuiPickersUtilsProvider>

            <Typography className="mt-8 text-16 sm:text-20 truncate" color="inherit">
                {T.translate("vehicle.regulatoryCompliance.carInsurance")}
            </Typography>


            <TextField
                className={full_half}
                disabled={!customCanWrite()}
                helperText={regulatoryComplianceTouched("carInsuranceNumber")}
                error={regulatoryComplianceErrors("carInsuranceNumber")}
                label={T.translate("vehicle.regulatoryCompliance.carInsuranceNumber")}
                id="regulatoryCompliance.carInsuranceNumber"
                name="regulatoryCompliance.carInsuranceNumber"
                value={form.regulatoryCompliance.carInsuranceNumber}
                onChange={onChange("regulatoryCompliance.carInsuranceNumber")}
                onBlur={onChange("regulatoryCompliance.carInsuranceNumber")}
                variant="outlined"
            />
            <TextField
                className={full_half}
                disabled={!customCanWrite()}
                helperText={regulatoryComplianceTouched("carInsuranceIssuer")}
                error={regulatoryComplianceErrors("carInsuranceIssuer")}
                label={T.translate("vehicle.regulatoryCompliance.carInsuranceIssuer")}
                id="regulatoryCompliance.carInsuranceIssuer"
                name="regulatoryCompliance.carInsuranceIssuer"
                value={form.regulatoryCompliance.carInsuranceIssuer}
                onChange={onChange("regulatoryCompliance.carInsuranceIssuer")}
                onBlur={onChange("regulatoryCompliance.carInsuranceIssuer")}
                variant="outlined"
            />
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={getLocale()}>
                <KeyboardDatePicker
                    disabled={!customCanWrite()}
                    className={full_half}
                    margin="normal"
                    id="regulatoryCompliance.carInsuranceExpeditionDate"
                    label={T.translate("vehicle.regulatoryCompliance.carInsuranceExpeditionDate")}
                    required 
                    error={errorcarInsuranceExpeditionDate}
                    helperText={errorcarInsuranceExpeditionDate}
                    format="MM/dd/yyyy"
                    value={new Date().setTime(form.regulatoryCompliance.carInsuranceExpeditionDate)}
                    onChange={handlecarInsuranceExpeditionDateChange}
                    KeyboardButtonProps={{
                        'aria-label': 'change date',
                    }}
                />
            </MuiPickersUtilsProvider>
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={getLocale()}>
                <KeyboardDatePicker
                    disabled={!customCanWrite()}
                    className={full_half}
                    margin="normal"
                    id="regulatoryCompliance.carInsuranceExpirationDate"
                    label={T.translate("vehicle.regulatoryCompliance.carInsuranceExpirationDate")}
                    format="MM/dd/yyyy"
                    required
                    error={errorcarInsuranceExpirationDate}
                    helperText={errorcarInsuranceExpirationDate}
                    value={new Date().setTime(form.regulatoryCompliance.carInsuranceExpirationDate)}
                    onChange={handlecarInsuranceExpirationDateChange}
                    KeyboardButtonProps={{
                        'aria-label': 'change date',
                    }}
                />
            </MuiPickersUtilsProvider>
        </div>
    );
}

