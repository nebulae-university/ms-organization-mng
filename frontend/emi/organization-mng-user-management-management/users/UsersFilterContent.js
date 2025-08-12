import React, { useState, useEffect } from "react";
import {
  Checkbox,
  FormGroup,
  FormControlLabel,
  Typography,
  FormControl,
  Select,
  MenuItem, Button, Icon
} from "@material-ui/core";
import { FuseAnimate } from "@fuse";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from '@material-ui/core/styles';
import { red, amber } from '@material-ui/core/colors';
import * as Actions from "../store/actions";
import { MDText } from "i18n-react";
import i18n from "../i18n";
/* GraphQL Client hooks */
import { useLazyQuery } from "@apollo/react-hooks";
import { UserMngCompanyListing, OrganizationMngRoleListing } from "../gql/User";

import ReportDownloaderDialog from './dialogs/ReportDownloader';

const DEFAULT_ROLE_OPT = { id: "null", name: "ALL" };

const useStyles = makeStyles(theme => ({
  downloadButton: {
    backgroundColor: "#dbdbdb",
    border: "1px solid rgba(0, 0, 0, 0.12);",
    borderRadius: "4px",
    '&.Mui-disabled': {
      color: "#656565",
      backgroundColor: "#FFFFFF00"
    }
  }
}));

function TodoSidebarContent(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const gqlCompaniesListing = UserMngCompanyListing({});
  const user = useSelector(({ auth }) => auth.user);
  const [companyOptions, setCompanyOptions] = useState();
  const [roleOptions, setRoleOptions] = useState([DEFAULT_ROLE_OPT]);
  const [queryCompanies, queryCompaniesResult] = useLazyQuery(gqlCompaniesListing.query, {
    fetchPolicy: gqlCompaniesListing.fetchPolicy,
  });

  // Roles Autocomplete
  const { query: RoleListingQuery, fetchPolicy: RoleListingQueryFetchPolicy } = OrganizationMngRoleListing();
  const [refreshRoleListing, roleListingResult] = useLazyQuery(RoleListingQuery, { fetchPolicy: RoleListingQueryFetchPolicy });

  const { filters: { active: activeChecked, company, role }, totalDataCount } = useSelector(({ UserManagement }) => UserManagement.users);
  const T = new MDText(i18n.get(user.locale));

  //DIALOG STATES
  const [openReportOptionsDialog, setOpenReportOptionsDialog] = useState(false);

  //fires the query once the user stop typing the keyword
  useEffect(() => {
    if (user.selectedOrganization)
      // QUERY THE COMPANIES
      queryCompanies({
        variables: {
          paginationInput: {
            page: 0,
            count: 100,
            queryTotalResultCount: false,
          },
          filterInput: { active: true, organizationId: user.selectedOrganization.id },
        },
      });

    //  QUERY ROLES
    refreshRoleListing();


  }, [user]);

  //   LISTEN COMPANY QUERY RESULT
  useEffect(() => {
    if (!queryCompaniesResult.loading && queryCompaniesResult.data) {
      const options = [...queryCompaniesResult.data.UserMngCompanyListing.listing.map(({ id, name, number, active }) => ({ id, name, number, active })),];
      if (user.data.companyIds === null) {
      options.unshift({ id: "NO_COMPANY", name: T.translate("users.filters.no_company"), enum: true });
      }
      options.unshift({ id: "ALL_COMPANIES", name: T.translate("users.filters.all_company"), enum: true });
      setCompanyOptions(options);
      if (!company) {
        dispatch(Actions.setUsersFilterCompany1(options[0]))
    }

    }
  }, [queryCompaniesResult]);

  //   LISTEN ROLES QUERY RESULT
  useEffect(() => {

    if (!roleListingResult) return;
    const { loading, data } = roleListingResult;

    if (!loading && data) {
      const newRoleOptions = (data.OrganizationMngRoleListing || []).map(({ id, name }) => ({ id, name }));
      setRoleOptions([DEFAULT_ROLE_OPT, ...newRoleOptions]);
    }

  }, [roleListingResult]);

  function handleActiveChange(evt) {
    if (activeChecked === null) {
      dispatch(Actions.setUsersFilterActive(true));
    } else if (activeChecked) {
      dispatch(Actions.setUsersFilterActive(false));
    } else {
      dispatch(Actions.setUsersFilterActive(null));
    }
  }

  /**
   * Handles contract selection change
   * @param {*} evt
   * @param {*} selectedContracts
   */
  function handleCompanyChange(evt) {
    const value = evt ? evt.target.value : undefined;
    dispatch(Actions.setUsersFilterCompany1(value));
    //setCompanySelected(value);
  }

  function handleRoleChange(evt) {
    let value = evt ? evt.target.value : undefined;

    if (value.id == "null") {
      value = undefined;
    }

    dispatch(Actions.setUsersFilterRole(value))
  }

  function handleCloseReportOptions(extensionFile) {
    setOpenReportOptionsDialog(false);
  }

  /**
   * Converts an Contract object to an string representation
   * @param {*} contract
   */
  function companyAsString(company) {
    return company ? `${company.name || ""} ` : "???";
  }

  function roleAsString(role) {
    return role
      ? T.translate("user.role_groups." + role.name || '')
      : "undefined"
  }

  function onDownloadUsersInfo() {
    setOpenReportOptionsDialog(true)
  }

  return (
    <FuseAnimate animation="transition.slideUpIn" delay={400}>
      <div className="flex-auto border-l-1 border-solid">
        <div className="p-24">

          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  checked={activeChecked === null ? false : activeChecked}
                  indeterminate={activeChecked === null}
                  onChange={handleActiveChange}
                  value="active"
                  inputProps={{
                    "aria-label": "primary checkbox",
                  }}
                />
              }
              label={T.translate("users.filters.active")}
            />

            <Typography
              className="mt-8  text-14 sm:text-14 truncate"
              color="inherit"
            >
              {T.translate("users.filters.company")}
            </Typography>

            {/* TRANSPORT COMPANY */}
            <FormControl className="w-full">
              <Select
                value={
                  companyOptions
                    ? companyOptions.find((c) => c.id === (company || {}).id) 
                    : {}
                }
                id="companyId"
                onChange={handleCompanyChange}
                
              >
                {companyOptions &&
                  companyOptions.sort((a, b) => {
                    if (a.id !== "NO_COMPANY" && a.id !== "ALL_COMPANIES" && b.id !== "NO_COMPANY" && b.id !== "ALL_COMPANIES") {
                      if ((a.name).toUpperCase() > (b.name).toUpperCase()) {
                        return 1;
                      }
                      if ((a.name).toUpperCase() < (b.name).toUpperCase()) {
                        return -1;
                      }
                    }
                    return 0;
                  }).map((c) => (
                    <MenuItem key={c.id} value={c}>
                      {companyAsString(c)}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>


            {(roleOptions && roleOptions.length > 0) &&
              <Typography className="mt-8  text-14 sm:text-14 truncate" color="inherit">
                {T.translate("users.filters.role")}
              </Typography>
            }

            {(roleOptions && roleOptions.length > 0) &&
              <FormControl className="w-full">
                <Select
                  value={
                    roleOptions
                      ? roleOptions.find((c) => c.id === (role || {}).id) || roleOptions[0]
                      : roleOptions[0]
                  }
                  id="role_id"
                  onChange={handleRoleChange}
                >
                  {roleOptions &&
                    roleOptions.map(role => {
                      return {
                        type: role,
                        name: T.translate("user.role_groups." + role.name || '')
                      }
                    }).sort((a, b) => {
                      if (a.name !== "Todos" && b.name !== "Todos") {
                        if ((a.name).toUpperCase() > (b.name).toUpperCase()) {
                          return 1;
                        }
                        if ((a.name).toUpperCase() < (b.name).toUpperCase()) {
                          return -1;
                        }
                      }
                      return 0;
                    }).map((c) => (
                      <MenuItem key={c.type.id} value={c.type}>
                        {roleAsString(c.type)}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            }

            {/* BUTTON TO OPEN DIALOG TO DOWNLOAD THE REPORT */}
            <div className="w-full mt-16 items-center" >

              <Button
                className={`mt-8 w-full normal-case ${classes.downloadButton}`}
                variant="contained"
                disabled={!totalDataCount}
                onClick={onDownloadUsersInfo}
              >
                <Icon className="mr-2">cloud_download</Icon>
                {T.translate("users.filters.download_file")}
              </Button>
              {!totalDataCount && <p style={{ color: red[500] }} >No se encontraron datos para descargar usuarios </p>}
            </div>



          </FormGroup>
        </div>

        {/* DIALOGS */}
        <div>
          <ReportDownloaderDialog
            T={T}
            open={openReportOptionsDialog}
            onClose={handleCloseReportOptions}
            data={{ roleOptions }}
          />
        </div>

      </div>
    </FuseAnimate>
  );
}

export default TodoSidebarContent;
