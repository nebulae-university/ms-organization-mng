import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import LinearProgress from "@material-ui/core/LinearProgress";
import { useSelector } from 'react-redux';
import { makeStyles, createStyles } from '@material-ui/core/styles';

// import { useQuery } from "@apollo/react-hooks";

import * as moment from 'moment';

import graphqlService from '../../../../services/graphqlService';
import { OrganizationMngCompleteUserListing } from '../../gql/User';

import { Parser } from 'json2csv';

import * as XLSX from 'xlsx';
import * as FileSaver from "file-saver";

import { of, defer, range, Subject } from 'rxjs';
import { concatMap, mergeMap, delay, map, filter, tap, takeUntil } from 'rxjs/operators';
// import { useObservable } from 'rxjs-hooks'



// icons options
// csv      --- https://freeicons.io/vector-file-types-icons/csv-icon-2272
// excel    --- https://freeicons.io/flat-logos/excel-icon-18429
// json     --- https://freeicons.io/vector-file-types-icons/json-file-icon-2279

import SVGIcon from "./images";

// Icon made by Free icons from www.freeicons.io

const rowReducer = (line) => {

  return line.split(",").reduce((acc, c) => {

    if (c.startsWith('"[')) {
      if (c.endsWith(']"')) {
        const itemToPush = c.replaceAll('""', '"').replaceAll('"[', "[").replaceAll(']"', ']');
        acc.list.push(itemToPush);
        return acc;

      }
      acc.state.opens = acc.state.opens + 1;
      acc.incomplete = [...acc.incomplete, c];
      return acc;
    }

    if (c.endsWith(']"')) {
      acc.state.opens = acc.state.opens - 1;
      const itemToInsert = [...acc.incomplete, c];
      const sd = itemToInsert.toString();
      const ASD = sd.replaceAll('""', '"').replaceAll('"[', "[").replaceAll(']"', ']');
      acc.list.push(ASD);
      acc.incomplete = [];
      return acc;
    }

    if (acc.state.opens === 0) {
      acc.list.push(c);
    } else {
      acc.incomplete.push(c);
    }

    return acc;
  }, { list: [], incomplete: [], state: { opens: 0 } })

}

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
    }
  }),
);

const DialogComponent = (props) => {
  const { open, onClose, T, data } = props;

  const { roleOptions } = data;

  const { filters, order } = useSelector(({ UserManagement }) => UserManagement.users);

  const [selectedOption, setSelectedOption] = useState(null);
  const [totalItemsToDownload, setTotalItemsToDownload] = useState(null);
  const [downloadedItems, setDownloadedItems] = useState([]);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const classes = useStyles();

  // LISTEN OPEN DIALOG STATE
  useEffect(() => {
    if (open) {
      clearProcessVariables();
      // stopDownload$.subscribe(d => console.log("¿¿¿¿¿¿¿¿¿¿¿¿ SE ESTA CANCELANDO LA descarga"))
    }
  }, [open]);

  // LISTEN SELECTED OPTION
  useEffect(() => {
    if (selectedOption) {
      getIteratedRows();
    }
  }, [selectedOption]);

  // LISTEN DOWNLOADED ITEMS
  useEffect(() => {
    if (downloadedItems) {

      const percentageProgress = totalItemsToDownload
        ? Math.round((downloadedItems.length / totalItemsToDownload) * 100)
        : 0;

      setDownloadProgress(percentageProgress);

      // WHEN DOWNLOAD IS COMPLETED
      if (open && downloadedItems.length === totalItemsToDownload) {

        const jsonCleared = clearJson(downloadedItems);

        const fields = [
          "documentId",
          "firstName",
          "lastName",
          "emailAddress",
          "phoneNumber",
          "active",
          "roles",
          "auth.username",
          "regulatoryCompliance.driverLicenseNumber",
          "regulatoryCompliance.driverLicenseCategory",
          "regulatoryCompliance.driverLicenseExpeditionDate",
          "regulatoryCompliance.driverLicenseExpirationDate",
          "regulatoryCompliance.mandatoryHealthPlanNumber",
          "regulatoryCompliance.mandatoryHealthPlanIssuer",
          "regulatoryCompliance.mandatoryHealthPlanExpeditionDate",
          "regulatoryCompliance.mandatoryHealthPlanExpirationDate",
          "regulatoryCompliance.occupationalRiskAdministratorNumber",
          "regulatoryCompliance.occupationalRiskAdministratorIssuer",
          "regulatoryCompliance.occupationalRiskAdministratorExpeditionDate",
          "regulatoryCompliance.occupationalRiskAdministratorExpirationDate",
          "companyObj.name",
          "metadata.createdBy",
          "metadata.createdAt",
          "metadata.createdAtTime",
          "metadata.updatedBy",
          "metadata.updatedAt",
          "metadata.updatedAtTime",
          "id"
        ];

        const parser = new Parser({ fields });
        const newJsonCleared = jsonCleared.map(js => {
          return {
            ...js,
            metadata: {
              ...js.metadata,
              createdAtTime: js.metadata.createdAt,
              updatedAtTime: js.metadata.updatedAt,
            }
          }
        });
        const csv = parser.parse(newJsonCleared);
        const { headers, rows } = getHeadersAndRows(csv, selectedOption);

        switch (selectedOption) {
          case "EXCEL":
            createFileFromXLSX(headers, rows);
            break;
          case "JSON":
            createFileFromJson(jsonCleared);
            break;
          case "CSV":
            createFileFromCSV(headers, rows);

          default:
            break;
        }
      }
    }
  }, [downloadedItems.length]);



  function getHeadersAndRows(data, fileType) {

    const list = data.split("\n");
    const headers = list[0].split('",')
      .map(p => p + '"')
      .map(item => item.replaceAll('\"', ""));
    const i18nHeaders = headers.map(header => T.translate(`users.reportDownloader.headers.${header.replaceAll(".", "_")}`));

    const rows = list.slice(1)
      .map(line => {
        const { list } = rowReducer(line);

        return list.map((rawValue, i) => {

          const headerKey = headers[i];
          const tranformationFnMap = {};

          const stringMillisToStringDateFn = (name, date) => date ? moment(parseInt(date)).format("DD/MM/YYYY") : "";
          const stringMillisToStringDateWith_HHmmss_Fn = (name, date) => date ? moment(parseInt(date)).format("HH:mm:ss") : "";

          const getValueFromI19nFileFn = (name, value) => {
            const _name = name.replaceAll(".", "_");
            const _value = value.replaceAll('"', "");
            return T.translate(`users.reportDownloader.values.${_name}.${_value}`);
          }

          const headerKeysToParseToStringDate = [
            "regulatoryCompliance.driverLicenseExpeditionDate",
            "regulatoryCompliance.driverLicenseExpirationDate",
            "regulatoryCompliance.mandatoryHealthPlanExpeditionDate",
            "regulatoryCompliance.mandatoryHealthPlanExpirationDate",
            "regulatoryCompliance.occupationalRiskAdministratorExpeditionDate",
            "regulatoryCompliance.occupationalRiskAdministratorExpirationDate",
            "metadata.createdAt", "metadata.updatedAt"
          ];

          const headerKeysToParseToStringDateWith_HHmmss = [
            "metadata.createdAtTime", "metadata.updatedAtTime"
          ];

          const headerKeysToMapValueWithI18nFile = ["active"];

          tranformationFnMap["default"] = (name, value) => value.replaceAll('"', '');
          headerKeysToParseToStringDate.forEach(headerKey => tranformationFnMap[headerKey] = stringMillisToStringDateFn);
          headerKeysToParseToStringDateWith_HHmmss.forEach(headerKey => tranformationFnMap[headerKey] = stringMillisToStringDateWith_HHmmss_Fn);
          headerKeysToMapValueWithI18nFile.forEach(headerKey => tranformationFnMap[headerKey] = getValueFromI19nFileFn);
          tranformationFnMap["roles"] = (name, roleList) => {
            const roleListObj = JSON.parse(roleList);

            const i18nList = roleListObj.map(roleId => {
              const roleI18nKey = (roleOptions.find(r => r.id === roleId) || {}).name;
              return T.translate(`user.role_groups.${roleI18nKey}`);
            })

            return i18nList.join(",");
          }

          const fnParser = tranformationFnMap[headerKey] || tranformationFnMap["default"];

          return selectedOption === "CSV"
            ? `"${fnParser(headerKey, rawValue)}"`
            : fnParser(headerKey, rawValue)
        });

      });

    return { headers: i18nHeaders, rows }
  }

  function buildQueryArguments({ filters: { name, organizationId, active, company, role }, order, page, rowsPerPage }) {

    const args = {
      "filterInput": { organizationId, extendedData: true },
      "paginationInput": { "page": page, "count": rowsPerPage, "queryTotalResultCount": (page === 0) },
      "sortInput": order.id ? { "field": order.id, "asc": order.direction === "asc" } : undefined
    };

    if (name.trim().length > 0) {
      args.filterInput.name = name;
    }
    if (active !== null) {
      args.filterInput.active = active;
    }
    if (company) {
      args.filterInput.company = company.id;
    }
    if (role) {
      args.filterInput.roleId = role.id;
    }
    return args;
  }

  function parseJsonToXlsxFormat(rawData) {

    return rawData.reduce((acc, sheet) => {
      const sheetName = sheet.name;
      const columns = sheet.rows[0];

      const rowData = sheet.rows.slice(1).map(row => {
        const rowAsObj = {};
        row.forEach((itemPerColumn, index) => {
          const columnName = columns[index];
          rowAsObj[columnName] = itemPerColumn;
        })
        return rowAsObj;
      });

      const getLargestValueInColumn = (columnKey, index, columns, rows) => {
        let largest = columns[index].length;
        rows.forEach(row => {
          const currentLength = row[columnKey].length;
          if (currentLength > largest) {
            largest = currentLength;
          }
        });

        return largest;
      }

      const wscols = columns.map((c, index) => {
        const largestWord = getLargestValueInColumn(c, index, columns, rowData);
        return ({
          width: (largestWord < 10) ? 10 : largestWord + 2
        })
      });

      acc.Sheets[sheetName] = XLSX.utils.json_to_sheet(rowData);
      acc.Sheets[sheetName]['!cols'] = wscols;
      // acc.Sheets[sheetName]['!merges'] = [
      //     { s: { r: 1, c: 0 }, e: { r: 2, c: 0 } },{ s: { r: 3, c: 0 }, e: { r: 4, c: 0 } },
      //   ];
      acc.SheetNames.push(sheetName);
      return acc;
    }, { Sheets: {}, SheetNames: [] });
  }

  function getIteratedRows() {

    let page = 0;
    let rowsPerPage = 10;
    let totalItemsDownloaded = [];

    const firstQuery = buildQueryArguments({ filters, order, page, rowsPerPage });

    // const r = searchVehicleQuery({ variables: firstQuery });
    defer(() => graphqlService.client.query(OrganizationMngCompleteUserListing(firstQuery))).pipe(
      map(result => (((result || {}).data || {}).OrganizationMngUserListing || {}).queryTotalResultCount),
      mergeMap((total) => {
        setTotalItemsToDownload(total);
        const iterations = Math.ceil(total / rowsPerPage);
        return range(0, iterations).pipe(
          // takeUntil(stopDownload$),
          map(i => buildQueryArguments({ filters, order, page: i, rowsPerPage })),
          concatMap(queryArgs => of(queryArgs).pipe(
            delay(100),
            filter(() => selectedOption != null),
            mergeMap(args => defer(() => graphqlService.client.query(OrganizationMngCompleteUserListing(args)))),
            // tap(r => console.log({ selectedOption, r })),
            map(result => (((result || {}).data || {}).OrganizationMngUserListing || {}).listing)
          ))
        )
      }),
    ).subscribe(
      (list) => {

        // console.log( { selectedOption } );
        if (selectedOption) {
          totalItemsDownloaded.push(...list);
          setDownloadedItems([...totalItemsDownloaded]);
        } else {
          throw new Error()
        }

      },
      e => console.log(e),
      () => { }
    )

  }

  function createFileFromJson(data) {
    const blob = new Blob([JSON.stringify(data, null, 4)], { type: "application/json" });
    let fileName = T.translate(`users.reportDownloader.fileNamePrefix`) + "_" + moment(Date.now()).format("DD/MM/YYYY");

    if (filters.role) {
      const roleI18nKey = (roleOptions.find(r => r.id === filters.role.id) || {}).name;
      const roleI18n = T.translate(`user.role_groups.${roleI18nKey}`).replaceAll(" ", "_");
      fileName = `${fileName}_${roleI18n}`;
    }

    downloadFileWithFileSaver(blob, `${fileName}.json`);
  }

  function createFileFromXLSX(headers, rows) {

    const i18nScene = "Vehículos";
    const xlsxDataAsJson = {
      sheets: [
        {
          name: i18nScene, // page name
          rows: [headers, ...rows],
        },
      ],
    };

    const rawDataToWrite = parseJsonToXlsxFormat(xlsxDataAsJson.sheets);

    const excelBuffer = XLSX.write(rawDataToWrite, { bookType: "xlsx", type: "array" });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    let fileName = T.translate(`users.reportDownloader.fileNamePrefix`) + "_" + moment(Date.now()).format("DD/MM/YYYY");

    if (filters.role) {
      const roleI18nKey = (roleOptions.find(r => r.id === filters.role.id) || {}).name;
      const roleI18n = T.translate(`user.role_groups.${roleI18nKey}`).replaceAll(" ", "_");
      fileName = `${fileName}_${roleI18n}`;
    }

    downloadFileWithFileSaver(blob, `${fileName}.xlsx`);

  }

  function createFileFromCSV(headers, rows) {
    const headersAndRows = [headers, ...rows];
    const rawCsvData = headersAndRows.map(e => e.join(",")).join("\n");
    const csvData = "\uFEFF" + rawCsvData;
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });
    let fileName = T.translate(`users.reportDownloader.fileNamePrefix`) + "_" + moment(Date.now()).format("DD/MM/YYYY");

    if (filters.role) {
      const roleI18nKey = (roleOptions.find(r => r.id === filters.role.id) || {}).name;
      const roleI18n = T.translate(`user.role_groups.${roleI18nKey}`).replaceAll(" ", "_");
      fileName = `${fileName}_${roleI18n}`;
    }

    downloadFileWithFileSaver(blob, `${fileName}.csv`);
  }

  function clearJson(json) {

    if (json == null) return json;

    if (Object.keys(json).includes("companyObj")) {
      const tempCompanyObj = json["companyObj"];

      json["companyObj"] = tempCompanyObj
        ? { name: tempCompanyObj.name }
        : null
    }

    const keysToRemove = ["__typename"];

    const propertiesToRename = [
      // { original: "capacity", newName: "capacidad" },
    ];

    let type = typeof json;
    const isArray = Array.isArray(json);
    type = isArray ? "array" : type;

    switch (type) {

      case "object":
        return Object.keys(json)
          .filter(key => !keysToRemove.includes(key))
          .reduce((acc, key) => {
            const i18nKey = (propertiesToRename.find(i => i.original === key) || {}).newName || key;
            acc[i18nKey] = clearJson(json[key])
            return acc;
          }, {});

      case "array": return json.map(item => clearJson(item));

      // to avoid with csv parser
      case "string": return json.replaceAll(",", ".");


      default: return json;
    }
  }

  function downloadFileWithFileSaver(blob, fileName) {
    FileSaver.saveAs(blob, fileName);
    onClose(false);
  }

  function clearProcessVariables() {
    setSelectedOption(null);
    setDownloadProgress(0);
    setDownloadedItems([]);
    setTotalItemsToDownload(null);
    // stopDownload$.next("true");
  }

  return (
    <Dialog
      open={open}
      className={`${classes.dialog}`}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {(!selectedOption || !downloadProgress)
          ? T.translate("users.reportDownloader.questionMsg") // ¿En que formato deseas descargar tu informe?
          : T.translate("users.reportDownloader.progress_msg") //"Estamos creando tu reporte en estos momentos..."
        }
      </DialogTitle>

      <DialogContent dividers>
        {/* FILE FORMAT OPTIONS */}
        <div className="w-full flex justify-center">
          {["EXCEL", "CSV", "JSON"]
            .filter(key => selectedOption ? key === selectedOption : true)
            .map((icon) => {
              return (
                <Button key={icon} disabled={selectedOption != null} color="primary" onClick={() => setSelectedOption(icon)}>
                  <SVGIcon type={icon} width={100} />
                </Button>
              );
            })}
        </div>


        {/* <DialogContentText id="alert-dialog-description">
                    Icon made by Free icons from www.freeicons.io
                </DialogContentText> */}
        {(selectedOption) && <h2>{downloadProgress}%</h2>}
        {(selectedOption) && <LinearProgress variant="determinate" value={downloadProgress} className="mt-12" />}
      </DialogContent>

      <DialogActions>
        {/* <p style={{ fontSize: "12px" }} >Icon made by Free icons from www.freeicons.io</p> */}

        {/* BUTTON TO CANCEL THE SELECTION */}
        {/* {( selectedOption && (downloadedItems.length !== totalItemsToDownload) ) && <Button onClick={clearProcessVariables} color="primary">
          { T.translate("users.reportDownloader.cancel") }
        </Button>
        } */}

        {/* BUTTON TO CLOSE DIALOG */}
        <Button variant="contained" onClick={onClose.bind(this, false)} className={`${classes.buttonClose}`}>
          {T.translate("users.reportDownloader.close")}
        </Button>

      </DialogActions>

    </Dialog>
  );
}


export default DialogComponent;