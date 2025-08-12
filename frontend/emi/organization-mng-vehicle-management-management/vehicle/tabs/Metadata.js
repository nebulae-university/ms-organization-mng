
import React from 'react';
import { TextField } from '@material-ui/core';



/**
 * Aggregate Metadata read-only form
 * @param {{dataSource,T}} props 
 */
function Metadata(props) {
    const { dataSource , T, } = props;
    //Responsive className
    const full_half = "mt-8 mb-16 w-full p-2 sm:w-1/2";

    return (
        <div>
            <TextField
                className={full_half}
                label={T.translate("vehicle.metadata.createdBy")}
                id="createdBy"
                name="createdBy"
                value={!dataSource.metadata ? "" : dataSource.metadata.createdBy}
                variant="outlined"
                InputProps={{
                    readOnly: true,
                }}
            />

            <TextField
                className={full_half}
                label={T.translate("vehicle.metadata.createdAt")}
                id="createdAt"
                name="createdAt"
                value={!dataSource.metadata ? "" : new Date(dataSource.metadata.createdAt).toLocaleString()}
                variant="outlined"
                InputProps={{
                    readOnly: true,
                }}
            />

            <TextField
                className={full_half}
                label={T.translate("vehicle.metadata.updatedBy")}
                id="updatedBy"
                name="updatedBy"
                value={!dataSource.metadata ? "" : dataSource.metadata.updatedBy}
                variant="outlined"
                InputProps={{
                    readOnly: true,
                }}
            />


            <TextField
                className={full_half}
                label={T.translate("vehicle.metadata.updatedAt")}
                id="updatedAt"
                name="updatedAt"
                value={!dataSource.metadata ? "" : new Date(dataSource.metadata.updatedAt).toLocaleString()}
                variant="outlined"
                InputProps={{
                    readOnly: true,
                }}
            />

        </div>
    );
}

export default Metadata;

