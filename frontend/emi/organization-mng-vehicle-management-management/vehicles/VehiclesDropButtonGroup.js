import _ from '@lodash';
import React, { useEffect, useState, useRef } from 'react';
import { useEventCallback } from 'rxjs-hooks';
import { debounceTime } from "rxjs/operators";
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Button, Grid, ButtonGroup, Grow, Paper, Popper, Popover, MenuItem, MenuList, IconButton, ListItemIcon, TextField } from '@material-ui/core';
import { Link } from 'react-router-dom';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

const useStyles = makeStyles((theme) =>
    createStyles({
        button: {
            border: '1px solid white',
            '& .MuiButton-label-664': {
                lineHeight: 'normal'
            }
        },
        menulistButton: {
            '& .MuiButton-label-673': {
                lineHeight: 'normal'
            }
        },
        boxPrin: {
            margin: '0 5px',
        },
        buttonIcon: {
            minWidth: 'auto',
            color: '#ff9c9c',
            '& .MuiSvgIcon-root-692': {
                fontSize: '1.9rem',
            }
        },
        textField: {
            margin: '0 0 0 2px',
            width: 50,
        },
        menu: {
            position: "absolute"
        }
    }),
);

export function SplitButton(props) {

    const { options, T, selectedIndex, setSelectedIndex, handleClickOpen } = props
    const [open, setOpen] = useState(false);

    const classes = useStyles();
    const anchorRef = useRef(null);

    /**FUNCTION BUTON**/
    function handleMenuItemClick(event, index) {
        setSelectedIndex(index);
        setOpen(false);
    }

    function handleToggle() {
        setOpen(prevOpen => !prevOpen);
    }

    function handleClose(event) {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    }

    function handleClick() {
        if (selectedIndex === 0) {
            //window.location.replace('/service-scheduling-mng/service-schedulings/new')
        } else if (selectedIndex === 1) {

        }
    }

    return (
        <div style={{ margin: '0 auto', zIndex: "4" }}>
            <Grid container>
                <Grid item xs={12} align="center">
                    <ButtonGroup variant="contained" ref={anchorRef} aria-label="split button">
                        {selectedIndex === 0
                            ? <Button component={Link} to="/vehicle-mng/vehicles/new" className="whitespace-no-wrap" variant="contained">
                                <p className="text-xs"> {options[selectedIndex]}</p>
                            </Button>
                            : <Button onClick={handleClickOpen} className={`${classes.button} ${classes.menulistButton}`}>
                                <p className="text-xs" > {options[selectedIndex]}</p>
                            </Button>}
                        <Button

                            className={classes.button}
                            size="small"
                            aria-owns={open ? 'menu-list-grow' : undefined}
                            aria-haspopup="true"
                            onClick={handleToggle}>
                            <ArrowDropDownIcon />
                        </Button>
                    </ButtonGroup>
                    <Popper open={open} anchorEl={anchorRef.current} transition disablePortal>
                        {({ TransitionProps, placement }) => (
                            <Grow
                                {...TransitionProps}
                                style={{
                                    transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                                }}
                            >
                                <Paper id="menu-list-grow">
                                    <ClickAwayListener onClickAway={handleClose}>
                                        <MenuList>
                                            {options.map((option, index) => (
                                                <MenuItem
                                                    key={option}
                                                    selected={index === selectedIndex}
                                                    onClick={event => handleMenuItemClick(event, index)}
                                                >
                                                    {option}
                                                </MenuItem>
                                            ))}
                                        </MenuList>
                                    </ClickAwayListener>
                                </Paper>
                            </Grow>
                        )}
                    </Popper>
                </Grid>
            </Grid>
        </div>
    )
}