import _ from '@lodash';
import React, { useState, useEffect } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography, FormControl, Icon, LinearProgress } from '@material-ui/core';
import { useSelector } from 'react-redux';
const useStyles = makeStyles((theme) =>
    createStyles({
        dialog: {
            '& h2': {
                color: '#fff',
                lineHeight: 'normal'
            },

            '& .import': {
                margin: '11px 0',
                '&  div': {
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    textAlign: 'center',
                    width: '50%',
                    padding: '5px',

                    '& span': {
                        fontSize: '14px',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',

                        '& svg': {
                            width: '30px',
                            marginLeft: '5px',

                            '& path': {
                                fill: '#656565',
                            }
                        }
                    }
                }
            },

            '& .selector': {
                '& > p': {
                    marginRight: '10px',
                },
                '& > div': {
                    width: '100%',
                    '& > div': {
                        width: '100%',
                        '&.Mui-focused fieldset': {
                            borderColor: 'white !important',
                        }
                    }
                },
                '& input': {
                    padding: '10.5px 6px',
                    width: '100%',
                },
            },

            '& .planningName': {
                marginTop: "10px",
                '& > p': {
                    marginRight: '37px',
                },
                '& > div': {
                    width: '100%',
                    '& > div': {
                        width: '100%',
                        '&.Mui-focused fieldset': {
                            borderColor: 'white !important',
                        }
                    }
                },
                '& input': {
                    padding: '10.5px 6px',
                    width: '100%',
                },
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
        textField: {
            margin: '0 0 0 10px',
            width: '100%',
            '& > div': {
                width: '100%',

                '& > div': {
                    padding: '0 !important',
                }
            }
        },
        inputFile: {
            background: '#f3f3f3',
        },
        warningTitle: {
            color: '#f44336',
            fontSize: '2rem',
            fontWeight: 'bold',
        },
        loadingTitle: {
            textAlign: 'center',
            fontSize: '2rem',
            fontWeight: 'bold',
        },
        widthLoading: {
            width: '500px'
        }
    }),
);

const UploadIcon = ({
    color = 'currentColor',
    width = '41px',
    height = '30px',
}) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            viewBox="0 0 40.909 30"
        >
            <g id="cloud-storage-uploading-option" transform="translate(0 -73.091)">
                <path
                    id="Path_2125"
                    data-name="Path 2125"
                    d="M39.129,89.827A8.064,8.064,0,0,0,34.58,86.94,5.446,5.446,0,0,0,30,78.546a5.207,5.207,0,0,0-3.537,1.321,10.921,10.921,0,0,0-10.1-6.776,10.511,10.511,0,0,0-7.713,3.2A10.508,10.508,0,0,0,5.454,84q0,.277.043.916A9.528,9.528,0,0,0,0,93.546a9.193,9.193,0,0,0,2.8,6.743,9.191,9.191,0,0,0,6.744,2.8H32.728a8.172,8.172,0,0,0,6.4-13.264Zm-12.06-.575a.656.656,0,0,1-.479.2H21.818v7.5a.691.691,0,0,1-.681.681H17.045a.691.691,0,0,1-.682-.681v-7.5H11.59a.655.655,0,0,1-.681-.681.8.8,0,0,1,.213-.512L18.6,80.783a.722.722,0,0,1,.98,0l7.5,7.5a.663.663,0,0,1,.191.49A.656.656,0,0,1,27.07,89.252Z"
                    transform="translate(0)"
                    fill="#e6e6e6"
                />
            </g>
        </svg>
    );
};

export function DialogVehiclesImport(props) {

    const { T, open, handleClose, nameFile, handleFile, handleImportVehicle, importVehicleResult } = props;
    const classes = useStyles();

    return (<Dialog
        open={open}
        onClose={handleClose}
        className={`${classes.dialog}`}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title">{T.translate('Importar vehículos')}</DialogTitle>
        <DialogContent dividers>
            {importVehicleResult.loading ? (
                <div className={classes.widthLoading}>
                    <Typography className={`${classes.loadingTitle}`}>{T.translate('Cargando...')}</Typography>
                    <LinearProgress className="m-8 mt-32 w-full" />
                </div>
            ) : <div className="w-full">
                <Typography>{T.translate('vehicles.import.infoMessage')}</Typography>
                <div className='import'>

                    <Button
                        variant="contained"
                        component="label"
                        className="w-full mt-5"
                    >
                        {nameFile || "No hay archivo"}
                        <input type="file"
                            multiple={false} accept={".csv"}
                            style={{ display: "none" }}
                            required
                            onChange={(e) => {
                                handleFile(e.target.files[0], e.target.value);
                            }}
                        />
                    </Button>
                </div>
            </div>}
        </DialogContent>
        <DialogActions>
            <Button
                variant="contained"
                color="primary"
                onClick={handleImportVehicle}
                disabled={!nameFile || importVehicleResult.loading}
            >
                {T.translate('ok')}
            </Button>
            <Button
                variant="contained"
                onClick={handleClose}
                className={`${classes.buttonClose}`}
                disabled={importVehicleResult.loading}
            >
                {T.translate('cancelar')}
            </Button>
        </DialogActions>
    </Dialog>
    )
}