import React from 'react';
import { useEffect, useState } from 'react';
import { TextField, FormControlLabel, Switch, makeStyles } from '@material-ui/core';
import { CustomJsonEditor } from '../tools/jsonEditor'
import * as Yup from "yup";
import _ from '@lodash';

const useStyles = makeStyles((theme) => ({
    disabledTextField: {
        '& .MuiInputBase-root.Mui-disabled': {
            color: 'rgb(0 0 0 / 100%)',
        }
    },
    disabledTextForm: {
        '& .MuiInputBase-root.Mui-disabled': {
            color: 'rgb(0 0 0 / 100%)',
        },
        '& input':{
            textTransform: "uppercase"
        }
    }

}));

export function InteroperableProfileMap(props) {
    const {dataSource: form, T, setInteroperableProfileMap, setInteroperableProfileMapUpdated, setInteroperableProfileMapErrorValidate, tabValue} = props;
    const classes = useStyles();

    function handleSpecsUpdated(specs, json) {
        setInteroperableProfileMap({ ...json });
    }

    return (
        <CustomJsonEditor {...{ T, setSpecsUpdated: setInteroperableProfileMapUpdated, handleSpecsUpdated, dataSource: form.interoperableProfileMap, readOnly: false,  setErrorValidate: setInteroperableProfileMapErrorValidate, tabValue}}></CustomJsonEditor>
    )
}