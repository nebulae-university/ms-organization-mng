import React from 'react';
import { useSelector } from 'react-redux';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@material-ui/core';
import { FuseAnimate } from '@fuse';
import { MDText } from 'i18n-react';
import i18n from "../i18n";

import { makeStyles, createStyles } from '@material-ui/core/styles';

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

export default function CreateAuthDialog(props) {
    // current logged user
    const logedUser = useSelector(({ auth }) => auth.user);

    //UI control states
    const [open, setOpen] = React.useState(false);
    const [username, setUsername] = React.useState("");
    const [usernameError, setUsernameError] = React.useState(true);
    const T = new MDText(i18n.get(logedUser.locale));

    const classes = useStyles();

    //Regex validator
    var regexConst = new RegExp('^(?=.{8,50}$)(?![.-])(?!.*[.-]{2})[a-zA-Z0-9-._@]+$');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    function handleUsernameChange({ target: { value } }) {
        const regexTestResult = Boolean(regexConst.test(value));
        setUsernameError(!regexTestResult);
        setUsername(value);
    }

    return (
        <div>
            <FuseAnimate delay={200}>
                <Typography variant="h6" color="textSecondary" className="mb-16">
                    {T.translate("user.create_auth_dialog.user_has_no_auth")}
                </Typography>
            </FuseAnimate>
            <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                {T.translate("user.create_auth_dialog.create_button")}
            </Button >
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" className={`${classes.dialog}`}>
                <DialogTitle id="form-dialog-title">{T.translate("user.create_auth_dialog.dialog_title")}</DialogTitle>
                <DialogContent dividers>
                    <DialogContentText>
                        {T.translate("user.create_auth_dialog.dialog_body")}
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label={T.translate("user.create_auth_dialog.username")}
                        type="email"
                        fullWidth
                        value={username}
                        onChange={handleUsernameChange}
                        error={usernameError}
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={handleClose} className={`${classes.buttonClose}`}>
                        {T.translate("user.create_auth_dialog.cancel")}
                    </Button>
                    <Button variant="contained" onClick={()=>{handleClose(); props.handleAuthCreation(username)}} color="primary" disabled={usernameError}>
                        {T.translate("user.create_auth_dialog.create")}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
