import React, { useState, useEffect } from 'react';
import JSONEditor from 'jsoneditor';
import 'jsoneditor/dist/jsoneditor.css';
import _ from '@lodash';
import { read } from 'fs';

const jsonEditorStyles = {
    height: '500px',
}

export const defaultDataFormData = {
    data: ''
}

export const CustomJsonEditor = props => {

    //Destruct items from porps
    const { T, dataSource, setSpecsUpdated, handleSpecsUpdated, readOnly, setErrorValidate } = props;
    const [container, setContainer] = useState(null);
    const [containerReadOnly, setContainerReadOnly] = useState(null);
    const [jsonEditor, setJsonEditor] = useState(null);
    const [jsonEditorReadOnly, setJsonEditorReadOnly] = useState(null);

    const options = {
        mode: 'code',
        modes: ['code', 'text', 'tree', 'preview'],
        onValidationError: function (errors) {
            if (errors.length > 0) {
                setErrorValidate(errors);
                setSpecsUpdated(false);
                //setFieldError('event.data',translator.translate("business_object_data.data.notValidJSON"));
            } else {
                setErrorValidate([]);
            }
        },
        onValidate: function (json) {
            const keys = Object.entries(json);
            const errors = validateJson([], keys);

            if (errors.length > 0) {
                setErrorValidate(errors);
                setSpecsUpdated(false);
            } else {
                setErrorValidate([]);
                handleSpecsUpdated(dataSource, json);
            }

            return errors;
        },
        onEditable: function (node) {
            return true;

        },
    };

    const optionsReadOnly = {
        mode: 'code',
        modes: ['code', 'text', 'tree', 'preview'],
        onValidationError: function (errors) {
            if (errors.length > 0) {
                setSpecsUpdated(false);
                //setFieldError('event.data',translator.translate("business_object_data.data.notValidJSON"));
            }
        },
        onValidate: function (json) {
            const keys = Object.entries(json);
            const errors = validateJson([], keys);

            if (errors.length > 0) {
                setErrorValidate(errors);
                setSpecsUpdated(false);
            } else {
                setErrorValidate([]);
                handleSpecsUpdated(dataSource, json);
            }

            return errors;
        },
        onEditable: function (node) {
            return false;

        },
    };

    useEffect(() => {
        if (containerReadOnly) {
            setJsonEditorReadOnly(new JSONEditor(containerReadOnly, optionsReadOnly));
        }

    }, [containerReadOnly])

    useEffect(() => {
        if (container) {
            setJsonEditor(new JSONEditor(container, options));
        }

    }, [container])

    useEffect(() => {
        if (container && dataSource && jsonEditor) {
            jsonEditor.set(dataSource);
        }

    }, [jsonEditor])

    useEffect(() => {
        if (containerReadOnly && dataSource && jsonEditorReadOnly) {
            jsonEditorReadOnly.set(dataSource);
        }

    }, [jsonEditorReadOnly]);

    function validateJson(errors, keys) {
        const regex = /^[a-zA-Z]+[a-zA-Z0-9-_]*$/;
        const error = errors || [];

        keys.forEach(key => {
            if (!regex.test(key[0])) {
                error.push({
                    path: ['warning'],
                    message: T.translate("company.invalidKey", { key: key[0] })
                });
            }
            if (key[1] && typeof key[1] === "object" && !Array.isArray(key[1])) {
                const keysTwo = Object.entries(key[1]);
                validateJson(error, keysTwo);
            }
            if (Array.isArray(key[1])) {
                const keysThree = Object.entries(key[1]);
                keysThree.forEach(keyThree => {
                    if (keyThree[1] && typeof keyThree[1] === "object" && !Array.isArray(keyThree[1])) {
                        const keysFour = Object.entries(keyThree[1]);
                        validateJson(error, keysFour);
                    }
                });
            }
        });

        return error;
    }

    return (
        <div className="w-full">
            {(!readOnly && process.env.REACT_APP_PLATFORM_TYPE !== "DEPENDENT") &&
                <div className="w-full" style={jsonEditorStyles} ref={elem => setContainer(elem)} />}
            {
                (readOnly || process.env.REACT_APP_PLATFORM_TYPE === "DEPENDENT") &&
                <div className="w-full" style={jsonEditorStyles} ref={elem => setContainerReadOnly(elem)} />
            }
        </div>
    );
}