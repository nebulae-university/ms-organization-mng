import React, { useEffect, useState } from 'react';
import { Icon, Table, TableBody, TableCell, TablePagination, TableRow, Checkbox } from '@material-ui/core';
import { FuseScrollbars } from '@fuse';
import { withRouter } from 'react-router-dom';
import CompaniesTableHead from './CompaniesTableHead';
import * as Actions from '../store/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useSubscription } from "@apollo/react-hooks";
import { MDText } from 'i18n-react';
import i18n from "../i18n";
import { onOrganizationMngCompanyModified } from "../gql/Company";

function CompaniesTable(props) {
    const dispatch = useDispatch();
    const companies = useSelector(({ CompanyManagement }) => CompanyManagement.companies.data);
    const { filters, rowsPerPage, page, order, totalDataCount } = useSelector(({ CompanyManagement }) => CompanyManagement.companies);
    const user = useSelector(({ auth }) => auth.user);
    const [selected, setSelected] = useState([]);
    const T = new MDText(i18n.get(user.locale));

    const onOrganizationMngCompanyModifiedData = useSubscription(...onOrganizationMngCompanyModified({ id: "ANY" }));

    useEffect(() => {
        dispatch(Actions.setCompaniesFilterOrganizationId(user.selectedOrganization.id));
    }, [user.selectedOrganization]);
    useEffect(() => {
        if (filters.organizationId){
            dispatch(Actions.getCompanies({ filters, order, page, rowsPerPage }));
        }            
    }, [dispatch, filters, order, page, rowsPerPage, onOrganizationMngCompanyModifiedData.data]);


    function handleRequestSort(event, property) {
        const id = property;
        let direction = 'desc';

        if (order.id === property && order.direction === 'desc') {
            direction = 'asc';
        }

        dispatch(Actions.setCompaniesOrder({ direction, id }));
    }


    function handleRequestRemove(event, property) {
        dispatch(Actions.removeCompanies(selected, { filters, order, page, rowsPerPage }));
    }

    function handleSelectAllClick(event) {
        if (event.target.checked) {
            setSelected(companies.map(n => n.id));
            return;
        }
        setSelected([]);
    }

    function handleClick(item) {
        props.history.push('/company-mng/companies/' + item.id + '/' + item.name.replace(/[\s_·!@#$%^&*(),.?":{}|<>]+/g, '-').toLowerCase());
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
        dispatch(Actions.setCompaniesPage(page));
    }

    function handleChangeRowsPerPage(event) {
        dispatch(Actions.setCompaniesRowsPerPage(event.target.value));
    }

    return (
        <div className="w-full flex flex-col">

            <FuseScrollbars className="flex-grow overflow-x-auto">

                <Table stickyHeader className="min-w-xs" aria-labelledby="tableTitle">

                    <CompaniesTableHead
                        numSelected={selected.length}
                        order={order}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        onRequestRemove={handleRequestRemove}
                        rowCount={companies.length}
                    />
 
                    <TableBody>
                        {
                            companies.map(n => {
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
                                            {n.document}
                                        </TableCell>

                                        <TableCell component="th" scope="row">
                                            {n.authorityCode}
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
                labelRowsPerPage={T.translate("companies.rows_per_page")}
                labelDisplayedRows={({ from, to, count }) => `${from}-${to === -1 ? count : to} ${T.translate("companies.of")} ${count}`}
            />
        </div>
    );
}

export default withRouter(CompaniesTable);
