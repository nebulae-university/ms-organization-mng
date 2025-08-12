import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography, makeStyles } from '@material-ui/core';
import { FuseAnimate } from '@fuse';
import { MDText } from 'i18n-react';
import i18n from "../i18n";
import * as Yup from "yup";
import { Formik } from 'formik';

import typeVia from "../organization/DataExtension/TypeVia"
import contentLetter from "../organization/DataExtension/ContentLetters"
import Complements from "../organization/DataExtension/Complement"

import Autocomplete from '@material-ui/lab/Autocomplete';

export function addressDialogFormValidationsGenerator(T) {
    return {
        finalComplement: Yup.string()
            .max(100, T.translate('organization.form_validations.name.maxLength', { len: 100 }))
    };
}

const useStyles = makeStyles((theme) => ({
    dialogStyle: {
        '& .MuiDialog-paperScrollPaper': {
            width: '80%',
            maxWidth: 'none !important'
        },
        ['@media(max-width: 385px)']: {
            '& .MuiDialog-paperScrollPaper': {
                width: '90%',
                margin: '0',
            },
        }
    },
    title: {
        '& h2': {
            color: '#039be5',
            lineHeight: '1em',
        }
    },
    contentForm: {
        '& h3': {
            padding: '10px 0',
            borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
            color: '#039be5',
            fontSize: '2rem',
            fontWeight: '600',
            marginBottom: '15px',
        },
        '& .MuiAutocomplete-root': {
            width: '23%',
            margin: '5px 0 15px',
            '& > div': {
                width: '100%',
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
        '& .MuiFormControl-root': {
            width: '23%',
            margin: '5px 0 15px',
        },
        ['@media(max-width: 790px)']: {
            '& .MuiAutocomplete-root': {
                width: '48.8%',
                '& > div': {
                    width: '100%',
                }
            },
            '& .MuiFormControl-root': {
                width: '48.8%',
            },
        },
        ['@media(max-width: 510px)']: {
            '& .MuiAutocomplete-root': {
                width: '100%',
            },
            '& .MuiFormControl-root': {
                width: '100%',
            },
        },
        '& input[type = number]::-webkit-inner-spin-button, input[type = number]::-webkit-outer-spin-button': {
            '-webkit-appearance': 'none',
            margin: '0',
        }

    },
    addInfo: {
        margin: '5px 0 10px',
        '& .MuiFormControl-root': {
            width: '48.8%',
            margin: '0',
        },
        '& > div': {
            width: '48.8%',
        },
        '& h4': {
            color: '#039be5',
            width: '100%'
        },
        ['@media(max-width: 510px)']: {
            '& .MuiFormControl-root': {
                width: '100%',
            },
            '& > div': {
                width: '100%',
                marginTop: '10px',
            },
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
    buttonClose: {
        background: '#f44336',
        color: 'white',
        fontWeight: 'bold',
        '&:hover': {
            color: 'rgb(0 0 0 / 87%)',
        }
    }
}));



export default function AddressDialog(props) {

    const { handleClose, open, form, setForm, setAddressComplete, canWrite } = props;

    const logedUser = useSelector(({ auth }) => auth.user);
    const T = new MDText(i18n.get(logedUser.locale));
    const classes = useStyles();
    const [number, setNumber] = useState();
    const [secondNumber, setSecondNumber] = useState();
    const [thirdNumber, setThirdNumber] = useState();
    const [finalComplement, setFinalcomplement] = useState();
    const [dialogAddress, SetDialogAddress] = useState();
    const [addressForm, setAddressForm] = useState();
    const [typeLine, setTypeLine] = useState();
    const [letter, setLetter] = useState();
    const [secondLetter, setSecondLetter] = useState();
    const [complement, setComplement] = useState();
    const [secondComplement, setSecondComplement] = useState();


    function handleNumberchange(evt) {
        setNumber(evt.target.value)
    }
    function handleSecondNumberchange(evt) {
        setSecondNumber(evt.target.value)
    }
    function handleThirdNumberchange(evt) {
        setThirdNumber(evt.target.value)
    }
    function handleTypeViaChange(evt, option) {
        setTypeLine(option)
    }
    function handleLetterChange(evt, option) {
        setLetter(option)
    }
    function handleSecondLetterChange(evt, option) {
        setSecondLetter(option)

    }
    function handleComplementChange(evt, option) {
        setComplement(option)
    }
    function handleSecondComplementChange(evt, option) {
        setSecondComplement(option)
    }
    function handleFinalComplementChange(evt) {
        setFinalcomplement(evt.target.value)
    }

    function canBeSubmitted() {
        return (
            canWrite()
            && typeLine
            && number
            && secondNumber
            && thirdNumber
        );
    }

    useEffect(() => {
        const secondNumberExtended = secondNumber ? "#" + secondNumber : '';
        const thirdNumberExtended = thirdNumber ? `- ${thirdNumber}` : '';
        const address = `${(typeLine || '').abbreviation || ''} ${number || ''}${(letter || '').letter || ''} ${(complement || '').complement || ''} ${secondNumberExtended}${(secondLetter || '').letter || ''} ${(secondComplement || '').complement || ''} ${thirdNumberExtended} ${finalComplement || ''}`
        const addressForm = { ...form, contactInformation: { ...form.contactInformation, address: address } };
        setAddressForm(addressForm)
        SetDialogAddress(address)
    }, [form, number, secondNumber, thirdNumber, finalComplement, typeLine, letter, secondLetter, complement, secondComplement])

    return (

        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
            className={`${classes.dialogStyle}`}
        >
            <DialogTitle id="form-dialog-title" className={`${classes.title}`}>
                {T.translate("organization.basicInfo.correspondenceAddress")}
            </DialogTitle>
            <DialogContent dividers>
                <div className={`mb-5`}>
                    <p>{T.translate("organization.basicInfo.toEnterAddress")}</p>
                    <p className={`mt-5`}><b>{T.translate("organization.basicInfo.example")}:</b> CL 7A SUR # 42B OESTE 70</p>
                </div>
                <div className={`${classes.contentForm}`}>
                    <h3>{T.translate("organization.basicInfo.address")}</h3>

                    <div className={`flex flex-wrap justify-between`}>
                        <Autocomplete
                            id="typeVia"
                            options={typeVia}
                            onChange={handleTypeViaChange}
                            getOptionLabel={(option) => {
                                if (!option) return "null"
                                return option.typeVia;
                            }}
                            value={typeLine || ''}
                            className={`${typeLine ? classes.active : ''}`}
                            renderInput={(params) => {
                                const typeVias = typeLine;
                                params.inputProps.autoComplete = "off"
                                if (typeVias) {
                                    params.inputProps.value = typeVias ? typeVias.typeVia : "";
                                }
                                return (
                                    <TextField {...params} label={T.translate("organization.basicInfo.typeVia")} variant="outlined" />
                                )
                            }}
                        />

                        <TextField
                            required
                            type='number'
                            label={T.translate("organization.basicInfo.number")}
                            onChange={handleNumberchange}
                            id="number"
                            name="number"
                            value={number}
                            variant="outlined"
                            autoComplete={'off'}
                        />

                        <Autocomplete
                            id="letter"
                            options={contentLetter}
                            autoComplete={'off'}
                            onChange={handleLetterChange}
                            getOptionLabel={(option) => {
                                if (!option) return "null";
                                return option.letter;
                            }}
                            value={letter || ''}
                            className={`${letter ? classes.active : ''}`}
                            renderInput={(params) => {
                                const letters = letter;
                                params.inputProps.autoComplete = "off"
                                if (letters) {
                                    params.inputProps.value = letters ? letters.letter : "";
                                }
                                return (
                                    <TextField {...params} label={T.translate("organization.basicInfo.letter")} variant="outlined" />
                                )
                            }}
                        />

                        <Autocomplete
                            id="complement"
                            options={Complements}
                            autoComplete={'off'}
                            onChange={handleComplementChange}
                            getOptionLabel={(option) => {
                                if (!option) return "null"
                                return option.complement;
                            }}
                            value={complement || ''}
                            className={`${complement ? classes.active : ''}`}
                            renderInput={(params) => {
                                const complements = complement;
                                params.inputProps.autoComplete = "off"
                                if (complements) {
                                    params.inputProps.value = complements ? complements.complement : "";
                                }
                                return (
                                    <TextField {...params} label={T.translate("organization.basicInfo.complement")} variant="outlined" />
                                )

                            }}
                        />

                        <TextField
                            type='number'
                            label={T.translate("organization.basicInfo.number")}
                            onChange={handleSecondNumberchange}
                            id="secondNumber"
                            name="secondNumber"
                            value={secondNumber}
                            variant="outlined"
                            autoComplete={'off'}
                        />

                        <Autocomplete
                            id="letter"
                            options={contentLetter}
                            autoComplete={'off'}
                            onChange={handleSecondLetterChange}
                            getOptionLabel={(option) => {
                                if (!option) return "null";
                                return option.letter;
                            }}
                            value={secondLetter || ''}
                            className={`${secondLetter ? classes.active : ''}`}
                            renderInput={(params) => {
                                const letters = secondLetter;
                                params.inputProps.autoComplete = "off"
                                if (letters) {
                                    params.inputProps.value = letters ? letters.letter : "";
                                }
                                return (
                                    <TextField {...params} label={T.translate("organization.basicInfo.letter")} variant="outlined" />
                                )
                            }}
                        />


                        <Autocomplete
                            id="complement"
                            options={Complements}
                            autoComplete={'off'}
                            onChange={handleSecondComplementChange}
                            getOptionLabel={(option) => {
                                if (!option) return "null"
                                return option.complement;
                            }}
                            value={secondComplement || ''}
                            className={`${secondComplement ? classes.active : ''}`}
                            renderInput={(params) => {
                                const complements = secondComplement;
                                params.inputProps.autoComplete = "off"
                                if (complements) {
                                    params.inputProps.value = complements ? complements.complement : "";
                                }
                                return (
                                    <TextField {...params} label={T.translate("organization.basicInfo.complement")} variant="outlined" />
                                )

                            }}
                        />

                        <TextField
                            type='number'
                            label={T.translate("organization.basicInfo.number")}
                            onChange={handleThirdNumberchange}
                            id="number"
                            name="number"
                            value={thirdNumber}
                            variant="outlined"
                            autoComplete={'off'}
                        />
                    </div>
                    <Formik
                        initialValues={{ ...form }}
                        enableReinitialize
                        validationSchema={Yup.object().shape({
                            ...addressDialogFormValidationsGenerator(T)
                        })}>
                        {(props) => {
                            const errors = props;
                            return <div className={`${classes.addInfo} flex flex-wrap justify-between`}>
                                <TextField
                                    label={T.translate("organization.basicInfo.complement")}
                                    error={errors && errors.finalComplement}
                                    helperText={errors.finalComplement}
                                    id="finalComplement"
                                    name="finalComplement"
                                    onChange={handleFinalComplementChange}
                                    value={finalComplement}
                                    variant="outlined"
                                    placeholder="Ejemplo: Apto 401 , torre 2"
                                    autoComplete={'off'}
                                />

                                <div className={`flex flex-wrap`}>
                                    <h4>{T.translate("organization.basicInfo.addressEntered")}</h4>
                                    <p>{dialogAddress}</p>
                                </div>
                            </div>
                        }}
                    </Formik>
                </div>
            </DialogContent>
            <DialogActions>

                <Button variant="contained" color="primary" onClick={() => {
                    handleClose();
                    setAddressComplete(dialogAddress)
                    setForm(addressForm)
                }}
                    disabled={!canBeSubmitted()}>
                    {T.translate("organization.basicInfo.save")}
                </Button>
                <Button className={`${classes.buttonClose}`} onClick={handleClose}>
                    {T.translate("organization.basicInfo.cancel")}
                </Button>
            </DialogActions>
        </Dialog>

    );
}
