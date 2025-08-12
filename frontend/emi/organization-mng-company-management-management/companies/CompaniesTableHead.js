import React, { useState } from 'react';
import { TableHead, TableSortLabel, TableCell, TableRow, Checkbox, Tooltip, IconButton, Icon, Menu, MenuList, MenuItem, ListItemIcon, ListItemText, } from '@material-ui/core';
import { Button, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from 'app/store/actions';
import { makeStyles } from '@material-ui/styles';
import { MDText } from 'i18n-react';
import i18n from "../i18n";




const useStyles = makeStyles(theme => ({
    actionsButtonWrapper: {
        background: theme.palette.background.paper
    }
}));

function CompaniesTableHead(props) {
    const dispatch = useDispatch();
    const order = useSelector(({ CompanyManagement }) => CompanyManagement.companies.order);
    const user = useSelector(({ auth }) => auth.user);
    let T = new MDText(i18n.get(user.locale));
    const classes = useStyles(props);
    const [selectedCompaniesMenu, setSelectedCompaniesMenu] = useState(null);


    const rows = [
        {
            id: 'name',
            align: 'left',
            disablePadding: false,
            label: T.translate("companies.table_colums.name"),
            sort: false
        },
        {
            id: 'document',
            align: 'left',
            disablePadding: false,
            label: T.translate("companies.document"),
            sort: false
        },
        {
            id: 'authorityCode',
            align: 'left',
            disablePadding: false,
            label: T.translate(T.translate("companies.authorityCode")),
            sort: false
        },
        {
            id: 'active',
            align: 'right',
            disablePadding: false,
            label: T.translate("companies.table_colums.active"),
            sort: false
        }
    ];

    const createSortHandler = property => event => {
        props.onRequestSort(event, property);
    };

    const removeHandler = () => {
        props.onRequestRemove();
    };

    function openSelectedCompaniesMenu(event) {
        setSelectedCompaniesMenu(event.currentTarget);
    }

    function closeSelectedCompaniesMenu() {
        setSelectedCompaniesMenu(null);
    }

    return (
        <TableHead>
            <TableRow className="h-64">
                {rows.map(row => {
                    return (
                        <TableCell
                            key={row.id}
                            align={row.align}
                            padding={row.disablePadding ? 'none' : 'default'}
                            sortDirection={order.id === row.id ? order.direction : false}
                        >
                            {row.sort && (
                                <Tooltip
                                    title="Sort"
                                    placement={row.align === "right" ? 'bottom-end' : 'bottom-start'}
                                    enterDelay={300}
                                >
                                    <TableSortLabel
                                        active={order.id === row.id}
                                        direction={order.direction}
                                        onClick={createSortHandler(row.id)}
                                    >
                                        {row.label}
                                    </TableSortLabel>
                                </Tooltip>
                            )}
                            {!row.sort && (
                                row.label
                            )}
                        </TableCell>
                    );
                }, this)}
            </TableRow>
        </TableHead>
    );
}

export default CompaniesTableHead;
