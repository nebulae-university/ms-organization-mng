
import React, { useEffect, useState, useRef } from 'react';
import clsx from 'clsx';
import {
  Button, TableHead, TableRow, TableCell, Checkbox, TableSortLabel, Toolbar, Typography, Tooltip, IconButton,
  Paper, Table, TableBody, TablePagination, FormControlLabel, Switch
} from '@material-ui/core';
import { lighten, makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import PropTypes from 'prop-types';
import GetAppIcon from '@material-ui/icons/GetApp';
import AddBoxIcon from '@material-ui/icons/AddBox';
import * as moment from 'moment';

import {
  OrganizationMngUploadCompanyDocument,
  OrganizationMngRequestDownloadCompanyDocument,
  OrganizationMngCompanyPartialFileDownloaded,
  OrganizationMngDeleteCompanyDocumentsByFileUrl
} from "../../gql/Company";
import { useMutation, useSubscription, useLazyQuery } from "@apollo/react-hooks";
import { DialogProgresDownload } from '../../company/tools/DialogProgresDownload';
import { DialogConfirm } from '../../company/tools/DialogConfirm';
import { DialogProcess } from '../../company/tools/DialogProcess';
import { DialogConfirmRemoveDocs } from '../../company/tools/DialogConfirmRemoveDocs';


/* Redux */
import { useDispatch, useSelector } from 'react-redux';
import * as AppActions from 'app/store/actions';




/**
 * 
 * @param {{dataSource,T}} props 
 */
function Documents(props) {
  const { dataSource, T, user } = props;
  //Redux dispatcher
  const dispatch = useDispatch();
  const [uploadDocument, uploadDocumentResult] = useMutation(OrganizationMngUploadCompanyDocument({}).mutation);
  const [removeDocuments, removeDocumentsResult] = useMutation(OrganizationMngDeleteCompanyDocumentsByFileUrl({}).mutation);
  const gqlDownloadDocument = OrganizationMngRequestDownloadCompanyDocument({});
  const [downloadDocument, downloadDocumentResult] = useLazyQuery(gqlDownloadDocument.query, { fetchPolicy: gqlDownloadDocument.fetchPolicy })
  // const [downloadDocument, downloadDocumentResult] = useMutation(OrganizationMngRequestDownloadCompanyDocument({}).mutation);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [openDialogDownload, setOpenDialogDownload] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openConfirmDialogRemoveDocs, setOpenConfirmDialogRemoveDocs] = useState(false);
  const [openDialogProcess, setOpenDialogProcess] = useState(false);
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [fileToUpload, setFileToUpload] = useState({});
  const [fileNameToDownload, setFileNameToDownload] = useState({});
  const organizationMngCompanyPartialFileDownloadedResult = useSubscription(
    ...OrganizationMngCompanyPartialFileDownloaded({ requestId: localStorage.getItem('jwt_access_token') }));
  const fileDownloaded = useRef([]);
  const downloading = useRef(false);
  const downloadKey = useRef(0);
  const lastDownloadTimestamp = useRef(0);
  const COOLDOWN_TIME = 2000;
  const headCells = [
    { id: 'name', label: T.translate("company.document.name") },
    { id: 'uploaderUserName', label: T.translate("company.document.upload_user_name") },
    { id: 'uploadTimestamp', label: T.translate("company.document.upload_timestamp") }
  ];


  useEffect(() => {
    if (organizationMngCompanyPartialFileDownloadedResult.data &&
      !downloading.current &&
      downloadKey.current === organizationMngCompanyPartialFileDownloadedResult.data.OrganizationMngCompanyPartialFileDownloaded.downloadKey) {
      const { OrganizationMngCompanyPartialFileDownloaded } = organizationMngCompanyPartialFileDownloadedResult.data;
      const tempData = [...fileDownloaded.current];
      if (!tempData.some(t => t.currentSection === OrganizationMngCompanyPartialFileDownloaded.currentSection)) {
        tempData.push(OrganizationMngCompanyPartialFileDownloaded);
        fileDownloaded.current = tempData;
      }
      const dateNow = Date.now();
      if ((lastDownloadTimestamp.current + COOLDOWN_TIME) < dateNow) {
        const percent = (OrganizationMngCompanyPartialFileDownloaded.currentSection + 1) * 100 / OrganizationMngCompanyPartialFileDownloaded.totalSections;
        lastDownloadTimestamp.current = dateNow;
        setCurrentProgress(Math.trunc(percent))
      }

      if (fileDownloaded.current.find(f => {
        return f.currentSection + 1 === f.totalSections
      }) && !downloading.current) {
        downloading.current = true;
        const base64File = fileDownloaded.current.sort(function (a, b) {
          return a.currentSection - b.currentSection;
        }).reduce((acc, val) => {
          return acc + val.partialEncode;
        }, '');
        setOpenDialogDownload(false);
        const arrayBuffer = base64ToArrayBuffer(base64File)
        createAndDownloadBlobFile(arrayBuffer, fileNameToDownload);
        fileDownloaded.current = [];
        setCurrentProgress(0)
      }

    }
  }, [organizationMngCompanyPartialFileDownloadedResult]);


  useEffect(() => {
    if (downloadDocumentResult.error && downloadDocumentResult.error.message.includes("GraphQL error: No such object")) {
      setOpenDialogDownload(false);
      dispatch(AppActions.showMessage({ message: T.translate("company.download_file_not_found"), variant: 'error' }));
      return;
    }

    if (downloadDocumentResult.error) {
      setOpenDialogDownload(false)
      dispatch(AppActions.showMessage({ message: T.translate("company.download_error"), variant: 'error' }));
      return;
    }

    if (downloadDocumentResult.data && downloadDocumentResult.data.OrganizationMngRequestDownloadCompanyDocument) {
      const data = downloadDocumentResult.data.OrganizationMngRequestDownloadCompanyDocument
      if (data.validityTS < Date.now()) {
        dispatch(AppActions.showMessage({ message: T.translate("company.download_expired"), variant: 'error' }));
        setOpenDialogDownload(false)
        return;
      }
      if (!data.url) {
        dispatch(AppActions.showMessage({ message: T.translate("company.download_file_not_found"), variant: 'error' }));
        setOpenDialogDownload(false)
        return;
      }
      window.location.assign(data.url);
      setOpenDialogDownload(false);
    }
  }, [downloadDocumentResult])


  useEffect(() => {
    if (downloadDocumentResult.error) {
      setOpenDialogDownload(false)
      dispatch(AppActions.showMessage({ message: T.translate("company.download_error"), variant: 'error' }));
    }
  }, [downloadDocumentResult]);

  useEffect(() => {
    if (uploadDocumentResult.error) {
      setOpenDialogProcess(false)
      dispatch(AppActions.showMessage({ message: T.translate("company.upload_error"), variant: 'error' }));
    } else if (uploadDocumentResult.data) {
      setOpenDialogProcess(false)
      dispatch(AppActions.showMessage({ message: T.translate("company.upload_success"), variant: 'success' }));
    }
  }, [uploadDocumentResult]);

  useEffect(() => {
    if (removeDocumentsResult.error) {
      setOpenDialogProcess(false)
      dispatch(AppActions.showMessage({ message: T.translate("company.remove_document_error"), variant: 'error' }));
    } else if (removeDocumentsResult.data) {
      setSelected([]);
      setOpenDialogProcess(false)
      dispatch(AppActions.showMessage({ message: T.translate("company.remove_document_success"), variant: 'success' }));
    }
  }, [removeDocumentsResult]);


  function createAndDownloadBlobFile(body, filename) {
    const blob = new Blob([body]);
    const fileName = `${filename}`;
    if (navigator.msSaveBlob) {
      // IE 10+
      navigator.msSaveBlob(blob, fileName);
    } else {
      const link = document.createElement('a');
      // Browsers that support HTML5 download attribute
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }

  function base64ToArrayBuffer(base64) {
    const binaryString = window.atob(base64); // Comment this if not using base64
    const bytes = new Uint8Array(binaryString.length);
    return bytes.map((byte, i) => binaryString.charCodeAt(i));
  }

  function EnhancedTableHead(props) {
    const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{ 'aria-label': 'select all desserts' }}
            />
          </TableCell>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
            >
              <TableSortLabel
                active={false}
                direction={'asc'}
              >
                {headCell.label}
              </TableSortLabel>
            </TableCell>
          ))}
          <TableCell padding="checkbox">
            <TableSortLabel
              active={false}
              direction={'asc'}
            >
              {T.translate("company.document.actions")}
            </TableSortLabel>
          </TableCell>
        </TableRow>
      </TableHead>
    );
  }
  const useToolbarStyles = makeStyles((theme) => ({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    highlight:
      theme.palette.type === 'light'
        ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
        : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
    title: {
      flex: '1 1 100%',
    },
  }));

  const EnhancedTableToolbar = (props) => {
    const classes = useToolbarStyles();
    const { numSelected, handleUploadFile, handleRemoveSelectedFiles } = props;

    return (
      <Toolbar
        className={clsx(classes.root, {
          [classes.highlight]: numSelected > 0,
        })}
      >
        {numSelected > 0 && (
          <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
            {numSelected} {T.translate("company.document.selected")}
          </Typography>
        )}

        {numSelected > 0 &&
          <Tooltip title={T.translate("company.document.delete")}>
            <IconButton aria-label="delete" onClick={handleRemoveSelectedFiles}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        }
        {
          <Tooltip title={T.translate("company.document.add")}>
            <IconButton
              aria-label="add"
              variant="contained"
              component="label">
              <AddBoxIcon />
              <input
                type="file"
                style={{ display: "none" }}
                onChange={handleUploadFile}
              />
            </IconButton>
          </Tooltip>
        }
      </Toolbar>
    );
  };

  const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    },
    paper: {
      width: '100%',
      marginBottom: theme.spacing(2),
    },
    table: {
      minWidth: 750,
    },
    visuallyHidden: {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      top: 20,
      width: 1,
    },
  }));

  function EnhancedTable(props) {
    const rows = (((props || {}).dataSource || {}).documents || [])
    const classes = useStyles();

    const handleSelectAllClick = (event) => {
      if (event.target.checked) {
        const newSelecteds = rows.map((n) => n.fileURL);
        setSelected(newSelecteds);
        return;
      }
      setSelected([]);
    };

    const handleDownloadButton = (event, fileUrl, name) => {
      const dateNow = Date.now();
      setFileNameToDownload(name)
      setOpenDialogDownload(true);
      downloadKey.current = dateNow;
      downloading.current = false;
      fileDownloaded.current = [];
      setCurrentProgress(0);
      downloadDocument({
        variables: {
          requestId: localStorage.getItem('jwt_access_token'),
          downloadKey: dateNow,
          fileUrl
        }
      });
    }

    const handleClick = (event, name) => {
      const selectedIndex = selected.indexOf(name);
      let newSelected = [];

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, name);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1),
        );
      }

      setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

    function handleUploadFile({ target }) {
      fileDownloaded.current = [];
      if (target.files[0].size > 20000000) {
        dispatch(AppActions.showMessage({ message: T.translate("company.document.large_file"), variant: 'error' }));
      } else {
        setCurrentProgress(0);
        setFileToUpload(target.files[0]);
        setOpenConfirmDialog(true);
      }
    }

    useEffect(() => {
      if (openConfirmDialog === true) {
        uploadDocument({ variables: { organizationId: dataSource.organizationId, companyId: dataSource.id, fileName: fileToUpload.name, file: fileToUpload } });
        setOpenConfirmDialog(false);
        setOpenDialogProcess(true);
      }
    }, [openConfirmDialog])

    function handleRemoveSelectedFiles() {
      setOpenConfirmDialogRemoveDocs(true)
    }



    const isSelected = (name) => selected.indexOf(name) !== -1;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <EnhancedTableToolbar numSelected={selected.length} {...{ handleUploadFile, handleRemoveSelectedFiles }} />
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={'medium'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              onSelectAllClick={handleSelectAllClick}
              rowCount={rows.length}
            />
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.fileURL);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.fileURL}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          onClick={(event) => handleClick(event, row.fileURL)}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row" padding="none">
                        {row.name}
                      </TableCell>
                      <TableCell component="th" scope="row" padding="none">{row.uploaderUserFullname}</TableCell>
                      <TableCell component="th" scope="row" padding="none">{moment(row.uploadTimestamp).format("DD/MM/YYYY HH:mm")}</TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        <IconButton
                          onClick={(event) => handleDownloadButton(event, row.fileURL, row.name)}>
                          <GetAppIcon />
                        </IconButton>
                      </TableCell>

                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            labelRowsPerPage={T.translate(`company.document.rowsPage`)}
          />
        </Paper>
      </div>
    );
  }

  return (
    <div>
      <DialogProgresDownload {...{ T, currentProgress, openDialogDownload, setOpenDialogDownload }}></DialogProgresDownload>
      {/* <DialogConfirm {...{ T, dataSource, openConfirmDialog, setOpenConfirmDialog, setOpenDialogProcess, uploadDocument, fileToUpload }}></DialogConfirm> */}
      <DialogConfirmRemoveDocs {...{ T, dataSource, openConfirmDialogRemoveDocs, setOpenConfirmDialogRemoveDocs, setOpenDialogProcess, removeDocuments, selected }}></DialogConfirmRemoveDocs>
      <DialogProcess {...{ T, openDialogProcess, setOpenDialogProcess }}></DialogProcess>
      <div className="w-full">
        <EnhancedTable {...{ dataSource }}></EnhancedTable>
      </div>
    </div>
  );
}

export default Documents;

