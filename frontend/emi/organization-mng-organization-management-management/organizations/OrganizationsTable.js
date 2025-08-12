import React, { useEffect, useState } from 'react';
import { Icon, Table, TableBody, TableCell, TablePagination, TableRow, Checkbox } from '@material-ui/core';
import { FuseScrollbars } from '@fuse';
import { withRouter } from 'react-router-dom';
import OrganizationsTableHead from './OrganizationsTableHead';
import * as Actions from '../store/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useSubscription } from "@apollo/react-hooks";
import { MDText } from 'i18n-react';
import i18n from "../i18n";
import { onOrganizationMngOrganizationModified } from "../gql/Organization";

function OrganizationsTable(props) {    
    const dispatch = useDispatch();
    const organizations = useSelector(({ OrganizationManagement }) => OrganizationManagement.organizations.data);
    const {filters, searchText, rowsPerPage, page, order, totalDataCount} = useSelector(({ OrganizationManagement }) => OrganizationManagement.organizations);
    const user = useSelector(({ auth }) => auth.user);
    const [selected, setSelected] = useState([]);
    const onOrganizationMngOrganizationModifiedData = useSubscription(
        ...onOrganizationMngOrganizationModified({ id: "ANY" })
    );

    useEffect(() => {
        dispatch(Actions.getOrganizations({ filters, searchText, order, page, rowsPerPage }));
    }, [dispatch, filters, searchText, order, page, rowsPerPage, onOrganizationMngOrganizationModifiedData.data]);

    let T = new MDText(i18n.get(user.locale));

    function handleRequestSort(event, property) {
        const id = property;
        let direction = 'desc';

        if (order.id === property && order.direction === 'desc') {
            direction = 'asc';
        }

        dispatch(Actions.setOrganizationsOrder({ direction, id }));
    }


    function handleRequestRemove(event, property) {
        dispatch(Actions.removeOrganizations(selected, { searchText, order, page, rowsPerPage }));
    }

    function handleSelectAllClick(event) {
        if (event.target.checked) {
            setSelected(organizations.map(n => n.id));
            return;
        }
        setSelected([]);
    }

    function handleClick(item) {
        props.history.push('/organization-mng/organizations/' + item.id + '/' + item.name.replace(/[\s_·!@#$%^&*(),.?":{}|<>]+/g, '-').toLowerCase()  );
    }

    function handleCheck(event, id) {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        }
        else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        }
        else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        }
        else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }

        setSelected(newSelected);
    }

    function handleChangePage(event, page) {
        dispatch(Actions.setOrganizationsPage(page));
    }

    function handleChangeRowsPerPage(event) {
        dispatch(Actions.setOrganizationsRowsPerPage(event.target.value));
    }

    return (
        <div className="w-full flex flex-col">

            <FuseScrollbars className="flex-grow overflow-x-auto">

                <Table stickyHeader className="min-w-xs" aria-labelledby="tableTitle">

                    <OrganizationsTableHead
                        numSelected={selected.length}
                        order={order}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        onRequestRemove={handleRequestRemove}
                        rowCount={organizations.length}
                    />

                    <TableBody>
                        {
                            organizations.map(n => {
                                const isSelected = selected.indexOf(n.id) !== -1;
                                return (
                                    <TableRow
                                        className="h-64 cursor-pointer"
                                        hover
                                        role="checkbox"
                                        aria-checked={isSelected}
                                        tabIndex={-1}
                                        key={n.id}
                                        selected={isSelected}
                                        onClick={event => handleClick(n)}
                                    >
                                        <TableCell component="th" scope="row">
                                            {n.name}
                                        </TableCell>

                                        <TableCell component="th" scope="row">
                                            {n.contactInformation ? (n.contactInformation || {}).emailAddress : ""}
                                        </TableCell>

                                        <TableCell component="th" scope="row">
                                            {n.document}
                                        </TableCell>

                                        <TableCell component="th" scope="row">
                                            {n.contactInformation ? `${((n.contactInformation || {}).daneLocation || {}).stateName} - ${((n.contactInformation || {}).daneLocation || {}).cityName}` : ""}
                                        </TableCell>

                                        <TableCell component="th" scope="row">
                                            {(n.contactInformation || {}).address}
                                        </TableCell>

                                        <TableCell component="th" scope="row" align="right">
                                            {n.active ?
                                                (
                                                    <Icon className="text-green text-20">check_circle</Icon>
                                                ) :
                                                (
                                                    <Icon className="text-red text-20">remove_circle</Icon>
                                                )
                                            }
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </FuseScrollbars>

            <TablePagination
                component="div"
                count={totalDataCount}
                rowsPerPage={rowsPerPage}
                page={page}
                backIconButtonProps={{
                    'aria-label': 'Previous Page'
                }}
                nextIconButtonProps={{
                    'aria-label': 'Next Page'
                }}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                labelRowsPerPage={T.translate("organizations.rows_per_page")}
                labelDisplayedRows={({ from, to, count }) => `${from}-${to === -1 ? count : to} ${T.translate("organizations.of")} ${count}`}
            />
        </div>
    );
}

export default withRouter(OrganizationsTable);
