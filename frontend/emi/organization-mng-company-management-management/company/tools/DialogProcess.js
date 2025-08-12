import _ from '@lodash';
import React, { useState, useEffect } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    CircularProgress
} from '@material-ui/core';

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

export function DialogProcess(props) {

    const { T, openDialogProcess, setOpenDialogProcess } = props
    const classes = useStyles();

    const handleClose = () => {
        setOpenDialogProcess(false);
    };

    return (
        <Dialog
            key="dialogprogressDownload"
            open={openDialogProcess}
            onClose={handleClose}
            disableBackdropClick={true}
            disableEscapeKeyDown={true}
            className={`${classes.dialog}`}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">{T.translate("company.processing_action")}</DialogTitle>
            <DialogContent dividers>
                <CircularProgress />
            </DialogContent>
        </Dialog>
    )
}