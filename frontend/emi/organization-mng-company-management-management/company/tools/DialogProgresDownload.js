import _ from '@lodash';
import React, { useState, useEffect } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Typography,
    FormControl,
    LinearProgress,
    TextField
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

const useStyles = makeStyles((theme) =>
    createStyles({
        dialog: {
            '& h2': {
                color: '#049be5',
                lineHeight: 'normal'
            }
        },
    }),
);

export function DialogProgresDownload(props) {

    const { T, currentProgress, openDialogDownload, setOpenDialogDownload } = props
    const classes = useStyles();

    const handleClose = () => {
        setOpenDialogDownload(false);
    };

    return (
        <Dialog
            key="dialogprogressDownload"
            open={openDialogDownload}
            onClose={handleClose}
            disableBackdropClick={true}
            disableEscapeKeyDown={true}
            className={`${classes.dialog}`}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">{T.translate("company.download_document_tittle")}</DialogTitle>
            <DialogContent dividers>
                <LinearProgress variant="determinate" value={currentProgress} />
            </DialogContent>
        </Dialog>
    )
}