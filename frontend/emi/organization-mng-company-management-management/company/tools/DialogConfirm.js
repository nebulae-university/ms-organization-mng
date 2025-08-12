import _ from '@lodash';
import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';

const useStyles = makeStyles((theme) =>
    createStyles({
        dialog: {
            '& h2': {
                color: '#049be5',
                lineHeight: 'normal'
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
    }),
);

export function DialogConfirm(props) {

    const { T, openConfirmDialog, setOpenConfirmDialog, uploadDocument, setOpenDialogProcess, fileToUpload, dataSource } = props
    const classes = useStyles();
    const handleClose = () => {
        setOpenConfirmDialog(false);
    };
    const handleUploadFile = () => {
        uploadDocument({
            variables: {
                organizationId: dataSource.organizationId,
                companyId: dataSource.id, fileName: fileToUpload.name, file: fileToUpload
            }
        });
        setOpenConfirmDialog(false);
        setOpenDialogProcess(true);
    }

    return (
        <Dialog
            key="dialogconfirm"
            open={openConfirmDialog}
            onClose={handleClose}
            className={`${classes.dialog}`}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description">
            <DialogContent key="dialogconfirmcontent" dividers>
                <DialogContentText id="alert-dialog-description" key="dialogconfirmcontenttext">
                    {T.translate('company.confirmActions')}
                </DialogContentText>
            </DialogContent>
            <DialogActions key="dialogconfirmactions">
                <Button variant="contained" onClick={handleUploadFile} color="primary" key="dialogconfirmexec">
                    Ok
                </Button>
                <Button variant="contained" onClick={handleClose} key="dialogconfirmcancel" autoFocus className={`${classes.buttonClose}`}>
                    {T.translate('company.cancel')}
                </Button>
            </DialogActions>
        </Dialog>
    )
}