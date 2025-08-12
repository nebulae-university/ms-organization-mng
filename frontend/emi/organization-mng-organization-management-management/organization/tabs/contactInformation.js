
import React, { useEffect, useState } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { TextField, Grid, Typography, MenuItem, Button, makeStyles } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker, DatePicker } from '@material-ui/pickers';
import * as Yup from "yup";
import _ from '@lodash';
import CITIES from "../DataExtension/DaneLocation";
import CreateIcon from '@material-ui/icons/Create';

import AddressDialog from '../../dialog/AddressDialog';
const full_half = "mt-8 mb-16 w-full sm:w-1/2";

const DOCUMENT_TYPE = {
    PASSPORT_NUMBER: 'PASSPORT_NUMBER',
    IDENTITY_CARD: 'IDENTITY_CARD',
    CITIZENSHIP_CARD: 'CITIZENSHIP_CARD',
    FOREIGNER_IDENTITY: 'FOREIGNER_IDENTITY',
    NIP: 'NIP',
    NIUP: 'NIUP',
    NIT: 'NIT'
};

const useStyles = makeStyles((theme) => ({
    contentForm: {
        marginTop: '15px',
        '& .MuiAutocomplete-root': {
            '& > div': {
                margin: '0',
            },
        },

        '& .MuiAutocomplete-root.Mui-focused': {
            '& .MuiInputLabel-outlined': {
                transform: 'translate(14px, -6px) scale(0.75)',
                background: 'white',
                color: 'black',
                padding: '0 5px',
            }
        },
        '& input[type = number]::-webkit-inner-spin-button, input[type = number]::-webkit-outer-spin-button': {
            '-webkit-appearance': 'none',
            margin: '0',
        }
    },
    active: {
        '& .MuiInputLabel-outlined': {
            transform: 'translate(14px, -6px) scale(0.75)',
            background: 'white',
            color: 'black',
            padding: '0 5px',
        }
    },
    disabledTextField: {
        '& .MuiInputBase-root.Mui-disabled': {
            color: 'rgb(0 0 0 / 100%)',
        }
    },
    buttonHeigth: {
        height: "54px"
    }

}));


/**
 * Aggregate BasicInfo form
 * @param {{dataSource,T}} props 
 */
export function ContactInfo(props) {
    const { form, setForm, T, handleChange, canWrite, valueFocusCleaner, inputValidator } = props;
    const classes = useStyles();
    const [addressComplete, setAddressComplete] = useState();

    function handleDaneLocationChange(evt, option) {
        const dateLocation = { ...form, contactInformation: { ...form.contactInformation, daneLocation: option } };
        setForm(dateLocation);
    }

    // console.log(CITIES)

    const onChange = (fieldName) => (event) => {
        event.persist();
        handleChange(event);
    };

    //#region Dialog

    const [openDialog, setOpenDialog] = useState(false);

    function handleClose() {
        setOpenDialog(false);
    }

    //#endregion

    return (
        <div className={`${classes.contentForm} flex flex-wrap`}>
            <TextField
                select
                className="mt-8 mb-16"
                required
                helperText={(inputValidator("documentType") || {}).msg || ""}
                error={inputValidator("documentType").error}
                label={T.translate("organization.basicInfo.documentType")}
                id="documentType"
                name="documentType"
                value={form.documentType || ''}
                onChange={onChange("documentType")}
                onBlur={onChange("documentType")}
                variant="outlined"
                autoComplete={'off'}
                fullWidth
                InputProps={{
                    readOnly: !canWrite(),
                }}
            >
                {Object.keys(DOCUMENT_TYPE).map(key => (
                    <MenuItem key={key} value={key}>{T.translate(`organization.basicInfo.documentTypes.${DOCUMENT_TYPE[key]}`)}</MenuItem>
                ))}
            </TextField>

            <TextField
                className="mt-8 mb-16"
                required
                helperText={(inputValidator("document") || {}).msg || ""}
                error={inputValidator("document").error}
                label={T.translate("organization.basicInfo.document")}
                id="document"
                name="document"
                value={(form.document && form.document.toUpperCase() || '').trim()}
                onChange={onChange("document")}
                onBlur={onChange("document")}
                variant="outlined"
                autoComplete={'off'}
                fullWidth
                InputProps={{
                    readOnly: !canWrite(),
                }}
            />
            <Autocomplete
                id="daneLocation"
                filterSelectedOptions
                options={CITIES}
                onChange={handleDaneLocationChange}
                value={(form.contactInformation || '').daneLocation || ''}
                getOptionLabel={(option) => {
                    if (!option) return "null";
                    return `${option.stateName} - ${option.cityName}`
                }}
                className={`${full_half} ${(form.contactInformation || '').daneLocation ? classes.active : ''} sm:pr-3`}
                renderInput={(params) => {
                    const daneLoc = (form.contactInformation || '').daneLocation
                    if (daneLoc) {
                        params.inputProps.value = daneLoc ? `${daneLoc.stateName} - ${daneLoc.cityName}` : "";
                    }
                    return (
                        <TextField
                            {...params}
                            variant="outlined"
                            margin="normal"
                            helperText={(inputValidator("contactInformation.daneLocation") || {}).msg || ""}
                            error={inputValidator("contactInformation.daneLocation").error}
                            required
                            fullWidth
                            label={T.translate("organization.basicInfo.municipality")}
                            disabled={ !canWrite()}
                        />
                    )
                }}
            />

            <div className={`mt-8 mb-16 flex w-full sm:w-1/2 sm:pl-3 ${classes.disabledTextField}`}>
                <TextField
                    className={`w-4/5 pr-5`}
                    disabled
                    required
                    helperText={(inputValidator("contactInformation.address") || {}).msg || ""}
                    error={inputValidator("contactInformation.address").error}
                    label={T.translate("organization.basicInfo.address")}
                    id="address"
                    name="address"
                    value={(form.contactInformation || '').address || ''}
                    variant="outlined"
                    autoComplete={'off'}
                    fullWidth
                    InputProps={{
                        readOnly: !canWrite(),
                    }}
                >
                </TextField>
                <div className={`w-1/5`}>
                    <Button className={`w-full felx ${classes.buttonHeigth}`} disabled={!canWrite()} variant="contained" onClick={() => { setOpenDialog(!openDialog) }} >
                        <CreateIcon></CreateIcon>
                    </Button>
                </div>
            </div>
            <TextField
                className={`${full_half} sm:pr-3`}
                required
                helperText={(inputValidator("contactInformation.emailAddress") || {}).msg || ""}
                error={inputValidator("contactInformation.emailAddress").error}
                label={T.translate("organization.basicInfo.emailAddress")}
                id="emailAddress"
                name="contactInformation.emailAddress"
                value={(form && form.contactInformation && form.contactInformation.emailAddress || '').trim()}
                onChange={
                    onChange("emailAddress")
                }
                onBlur={(evt) => {
                    evt.target.value = valueFocusCleaner(evt.target.value)
                    onChange("emailAddress")(evt)
                }}
                variant="outlined"
                fullWidth
                autoComplete={'off'}
                InputProps={{
                    readOnly: !canWrite(),
                }}
            />

            <TextField
                className={`${full_half} sm:pl-3`}
                required
                helperText={(inputValidator("contactInformation.phoneNumber") || {}).msg || ""}
                error={inputValidator("contactInformation.phoneNumber").error}
                label={T.translate("organization.basicInfo.phoneNumber")}
                id="phoneNumber"
                name="contactInformation.phoneNumber"
                value={form && form.contactInformation && form.contactInformation.phoneNumber || ''}
                onChange={
                    onChange("phoneNumber")
                }
                onBlur={(evt) => {
                    evt.target.value = valueFocusCleaner(evt.target.value)
                    onChange("phoneNumber")(evt)
                }}
                variant="outlined"
                fullWidth
                autoComplete={'off'}
                placeholder={T.translate('organization.basicInfo.phoneNumberPlaceholder')}
                InputProps={{
                    readOnly: !canWrite(),
                }}
            />

            <TextField
                className={`${full_half} sm:pr-3`}
                required
                helperText={(inputValidator("contactInformation.mobilePhoneNumber") || {}).msg || ""}
                error={inputValidator("contactInformation.mobilePhoneNumber").error}
                label={T.translate("organization.basicInfo.mobilePhoneNumber")}
                id="mobilePhoneNumber"
                name="contactInformation.mobilePhoneNumber"
                value={form && form.contactInformation && form.contactInformation.mobilePhoneNumber || ''}
                onChange={
                    onChange("emailAddress")
                }
                onBlur={(evt) => {
                    evt.target.value = valueFocusCleaner(evt.target.value)
                    onChange("mobilePhoneNumber")(evt)
                }}
                variant="outlined"
                fullWidth
                autoComplete={'off'}
                placeholder={T.translate("organization.basicInfo.mobilePhoneNumberPlaceholder")}
                InputProps={{
                    readOnly: !canWrite(),
                }}
            />

            {/* DIALOG */}
            <AddressDialog {...{ open: openDialog, handleClose, form, setForm, addressComplete, setAddressComplete, canWrite }} />
        </div>
    );
}

