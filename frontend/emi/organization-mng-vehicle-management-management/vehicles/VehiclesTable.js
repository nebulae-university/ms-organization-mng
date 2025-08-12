import React, { useEffect, useState } from 'react';
import { Icon, Table, TableBody, TableCell, TablePagination, TableRow, Checkbox } from '@material-ui/core';
import { FuseScrollbars } from '@fuse';
import { withRouter } from 'react-router-dom';
import VehiclesTableHead from './VehiclesTableHead';
import * as Actions from '../store/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useSubscription, useLazyQuery } from "@apollo/react-hooks";
import { MDText } from 'i18n-react';
import i18n from "../i18n";
import * as AppActions from 'app/store/actions';
import { onOrganizationMngVehicleModified } from "../gql/Vehicle";
import { UserMngCompanyListing } from "../gql/User";

function VehiclesTable(props) {
    const dispatch = useDispatch();
    const vehicles = useSelector(({ VehicleManagement }) => VehicleManagement.vehicles.data);
    const errors = useSelector(({ VehicleManagement }) => VehicleManagement.vehicles.errors);
    const { filters, rowsPerPage, page, order, totalDataCount } = useSelector(({ VehicleManagement }) => VehicleManagement.vehicles);
    const user = useSelector(({ auth }) => auth.user);
    const [selected, setSelected] = useState([]);
    const T = new MDText(i18n.get(user.locale));

    const onOrganizationMngVehicleModifiedData = useSubscription(...onOrganizationMngVehicleModified({ id: "ANY" }));

    useEffect(() => {
        if (errors && errors.code === 2) {
            dispatch(AppActions.showMessage({ message: T.translate("vehicles.errors.2"), variant: 'error' }));
        }
       
    }, [errors]);

    useEffect(() => {
        dispatch(Actions.setVehiclesFilterOrganizationId(user.selectedOrganization.id));
    }, [user.selectedOrganization]);
    useEffect(() => {
        if (filters) {
            dispatch(Actions.getVehicles({ filters, order, page, rowsPerPage }));
        }
        
    }, [dispatch, filters, order, page, rowsPerPage, onOrganizationMngVehicleModifiedData.data]);

    useEffect(() => {
        setSelected([]);
    }, [filters.company])

    function handleRequestSort(event, property) {
        const id = property;
        let direction = 'desc';

        if (order.id === property && order.direction === 'desc') {
            direction = 'asc';
        }

        dispatch(Actions.setVehiclesOrder({ direction, id }));
    }


    function handleRequestRemove(event, property) {
        if ((filters && filters.company && filters.company.id && filters.company.id !== "ALL_COMPANIES" && filters.company.id !== "NO_COMPANY") || (user && user.data && user.data.companyId)) {
            dispatch(Actions.removeVehicles(selected, { filters, order, page, rowsPerPage, organizationId: user.selectedOrganization.id, companyId: filters.company.id || user.data.companyId }));
        } else {
            dispatch(AppActions.showMessage({ message: T.translate("vehicles.errorDelete"), variant: 'error' }));
        }

        //dispatch(Actions.removeVehicles(selected, { filters, order, page, rowsPerPage }));
    }

    function handleSelectAllClick(event) {
        if (event.target.checked) {
            setSelected(vehicles.map(n => n.id));
            return;
        }
        setSelected([]);
    }

    function handleClick(item) {
        props.history.push('/vehicle-mng/vehicles/' + item.id + '/' + item.plate.replace(/[\s_·!@#$%^&*(),.?":{}|<>]+/g, '-').toLowerCase());
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
        dispatch(Actions.setVehiclesPage(page));
    }

    function handleChangeRowsPerPage(event) {
        dispatch(Actions.setVehiclesRowsPerPage(event.target.value));
    }

    //#region *******listing company ******
    const gqlCompaniesListing = UserMngCompanyListing({});
    const [queryCompanies, queryCompaniesResult] = useLazyQuery(gqlCompaniesListing.query, { fetchPolicy: gqlCompaniesListing.fetchPolicy });
    const [companyOptions, setCompanyOptions] = useState();

    useEffect(() => {
        if (user.selectedOrganization)
            queryCompanies({ variables: { paginationInput: { page: 0, count: 100, queryTotalResultCount: false }, filterInput: { active: true, organizationId: user.selectedOrganization.id } } });
    }, [user]);

    useEffect(() => {
        if (!queryCompaniesResult.loading && queryCompaniesResult.data) {
            const options = [...queryCompaniesResult.data.UserMngCompanyListing.listing.map(({ id, name, number, active }) => ({ id, name, number, active }))];
            options.unshift({ id: "NO_COMPANY", name: "Sin operador"})
            setCompanyOptions(options);
        }
    }, [queryCompaniesResult]);

    //#endregion

    return (
        <div className="w-full flex flex-col">
            
            <FuseScrollbars className="flex-grow overflow-x-auto">

                <Table stickyHeader className="min-w-xs" aria-labelledby="tableTitle">

                    <VehiclesTableHead
                        numSelected={selected.length}
                        order={order}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        onRequestRemove={handleRequestRemove}
                        rowCount={vehicles.length}
                    />

                    <TableBody>
                        {
                            vehicles.map(n => {
                                const isSelected = selected.indexOf(n.id) !== -1;
                                const company = companyOptions && companyOptions.length > 0 && companyOptions.find(company => company.id === (n.companyId || 'NO_COMPANY'));

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
                                        <TableCell className="w-48 px-4 sm:px-12" padding="checkbox">
                                            <Checkbox
                                                checked={isSelected}
                                                onClick={event => event.stopPropagation()}
                                                onChange={event => handleCheck(event, n.id)}
                                            />
                                        </TableCell>


                                        <TableCell component="th" scope="row">
                                            {n.plate}
                                        </TableCell>

                                        <TableCell component="th" scope="row">
                                            {n.internalNumber}
                                        </TableCell>

                                        <TableCell component="th" scope="row">
                                            {T.translate(`vehicle.types.${n.type}`)}
                                        </TableCell>

                                        <TableCell component="th" scope="row">
                                            {n.devSerial}
                                        </TableCell>

                                        <TableCell component="th" scope="row">
                                            {n.deviceId}
                                        </TableCell>

                                        <TableCell component="th" scope="row">
                                            {(company || {}).name || ''}
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
                                        { process.env.REACT_APP_PLATFORM_TYPE === "DEPENDENT" && <TableCell component="th" scope="row" align="right">
                                            {!n.pendingToReportToParent ?
                                                (
                                                    <Icon className="text-green text-20">check_circle</Icon>
                                                ) :
                                                (
                                                    <Icon className="text-red text-20">remove_circle</Icon>
                                                )
                                            }
                                        </TableCell>}
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
                backIconButtonProps={{ 'aria-label': 'Previous Page' }}
                nextIconButtonProps={{ 'aria-label': 'Next Page' }}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                labelRowsPerPage={T.translate("vehicles.rows_per_page")}
                labelDisplayedRows={({ from, to, count }) => `${from}-${to === -1 ? count : to} ${T.translate("vehicles.of")} ${count}`}
            />
        </div>
    );
}

export default withRouter(VehiclesTable);
