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

export function Attributes(props) {
    const {dataSource: form, T, setSpecs, specsUpdated, setSpecsUpdated, errorValidate, setErrorValidate, tabValue} = props;
    const classes = useStyles();

    function handleSpecsUpdated(specs, json) {
        setSpecs({ ...json });
    }

    return (
        <CustomJsonEditor {...{ T, setSpecsUpdated, handleSpecsUpdated, dataSource: form.attributes, readOnly: false,  setErrorValidate, tabValue }}></CustomJsonEditor>
    )
}