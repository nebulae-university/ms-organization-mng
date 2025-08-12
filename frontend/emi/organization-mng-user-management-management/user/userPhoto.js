import React from 'react';
import { useSelector } from 'react-redux';
import { FormControl, Typography, Icon } from '@material-ui/core';
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
        },
        large: {
            width: '90px',
            height: '90px',
        }
    }),
);

export function Photo(props) {
    // current logged user
    const logedUser = useSelector(({ auth }) => auth.user);
    const { profilePicture, fileProcessor } = props;
    //UI control states
    const [open, setOpen] = React.useState(false);
    const [username, setUsername] = React.useState("");
    const [usernameError, setUsernameError] = React.useState(true);
    const T = new MDText(i18n.get(logedUser.locale));

    const classes = useStyles();

    //Regex validator
    var regexConst = new RegExp('^(?=.{8,50}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._@]+$');

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
        <div className='w-full mt-8 mb-10'>
            <FormControl className="w-82">
                <label
                    htmlFor="user-picture"
                    className={`${(profilePicture) ? '' : 'p-10'} rounded-full flex items-center justify-center relative overflow-hidden cursor-pointer shadow hover:shadow-lg w-full`}
                >
                    <input
                        accept="image/png, image/jpeg, image/jpg"
                        className="hidden"
                        id="user-picture"
                        type="file"
                        onChange={fileProcessor}
                    />
                    {profilePicture
                        ? <img src={profilePicture} className={`${classes.large}`} />
                        : <Icon fontSize="large" color="action">
                            cloud_upload
                        </Icon>}
                </label>
            </FormControl>
        </div>
    );
}

function photoPropsAreEqual(prevProps, nextProps) {
    return prevProps.profilePicture === nextProps.profilePicture;
}

const MemoizedMap = React.memo(Photo, photoPropsAreEqual);
export default MemoizedMap;