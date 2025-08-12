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
import { OrganizationMngCompleteVehicleListing } from '../../gql/Vehicle';

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
  }, { list: [], incomplete: [], state: { opens: 0 } });

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
  const { open, onClose, T, companies } = props;

  const { filters, order } = useSelector(({ VehicleManagement }) => VehicleManagement.vehicles);

  const [selectedOption, setSelectedOption] = useState(null);
  const [totalItemsToDownload, setTotalItemsToDownload] = useState(null);
  const [downloadedItems, setDownloadedItems] = useState([]);
  const [downloadProgress, setDownloadProgress] = useState(0);
  // const [ stopDownload$ ] = useState(new Subject());

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
    // console.log("$$ NEW selectedOption", selectedOption );
    if (selectedOption) {
      // console.log(`OBTENIENDO LA INFORMACION EN EL FORMATO ${selectedOption}`,{ 
      //   selectedOption, downloadProgress, downloadedItems, totalItemsToDownload
      // });

      getIteratedRows();
    }

  }, [selectedOption]);

  // LISTEN DOWNLOADED ITEMS
  useEffect(() => {
    // console.log("$$ NEW downloadedItems", downloadedItems );
    if (downloadedItems) {
      const percentageProgress = totalItemsToDownload
        ? Math.round((downloadedItems.length / totalItemsToDownload) * 100)
        : 0;

      setDownloadProgress(percentageProgress);

      // WHEN DOWNLOAD IS COMPLETED
      if (open && downloadedItems.length === totalItemsToDownload) {

        const jsonCleared = clearJson(downloadedItems);

        const fields = [
          "plate", "active", "internalNumber", "deviceId", "platformId", 'companyId', "type", "fuelType",
          "ownership", "manufacturer", "model", "year", "emissionsStandard", "schemaType", "colors",
          "chassisNumber", "engineNumber", "capacity.seated", "capacity.standing","bodyworkBrand",
          "regulatoryCompliance.operationCardNumber",
          "regulatoryCompliance.operationCardExpeditionDate",
          "regulatoryCompliance.operationCardExpirationDate",
          "regulatoryCompliance.operationCardCompany",
          "regulatoryCompliance.operationCardInternalNumber",
          "regulatoryCompliance.mandatoryInsuranceNumber",
          "regulatoryCompliance.mandatoryInsuranceExpeditionDate",
          "regulatoryCompliance.mandatoryInsuranceExpirationDate",
          "regulatoryCompliance.mandatoryInsuranceIssuer",
          "regulatoryCompliance.technomechanicalNumber",
          "regulatoryCompliance.technomechanicalExpeditionDate",
          "regulatoryCompliance.technomechanicalExpirationDate",
          "regulatoryCompliance.technomechanicalIssuer",
          "regulatoryCompliance.carInsuranceNumber",
          "regulatoryCompliance.carInsuranceExpeditionDate",
          "regulatoryCompliance.carInsuranceExpirationDate",
          "regulatoryCompliance.carInsuranceIssuer",
          "fuelRangeWithFullTank", "id", "metadata.createdBy", "metadata.createdAt", "metadata.createdAtTime",
          "metadata.updatedBy", "metadata.updatedAt", "metadata.updatedAtTime", 
          "humanResources.driversNames", 
          "humanResources.driversIds",
          "humanResources.ownersNames", 
          "humanResources.ownersIds", 
          "humanResources.managersNames", 
          "humanResources.managersIds", 
          "hasDriverDoor"
        ];

        const parser = new Parser({ fields });
        const newJsonCleared = jsonCleared.map(js => {
          const filteredDrivers = js.humanResources.userObjList.filter(user => js.humanResources.driverIds.includes(user._id))
          const driversIds = filteredDrivers.map(user => user.documentId).join(' ; ');
          const driversNames = filteredDrivers.map(user => `${user.firstName} ${user.lastName}`).join(' ; ')

          const filteredOwners = js.humanResources.userObjList.filter(user => js.humanResources.ownerIds.includes(user._id))
          const ownersIds = filteredOwners.map(user => user.documentId).join(' ; ');
          const ownersNames = filteredOwners.map(user => `${user.firstName} ${user.lastName}`).join(' ; ')

          const filteredManagers = js.humanResources.userObjList.filter(user => js.humanResources.managerIds.includes(user._id))
          const managersIds = filteredManagers.map(user => user.documentId).join(' ; ');
          const managersNames = filteredManagers.map(user => `${user.firstName} ${user.lastName}`).join(' ; ')

          return {
            ...js,
            deviceId: js.devSerial,
            platformId: js.deviceId,
            hasDriverDoor: js.hasDriverDoor == null ? false : js.hasDriverDoor, 
            humanResources:{
              driversIds,
              driversNames,
              ownersIds,
              ownersNames,
              managersIds,
              managersNames
            },
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


  // useEffect(() => {
  //   console.log("$$ NEW downloadProgress", downloadProgress );
  // }, [downloadProgress]);

  function getHeadersAndRows(data, fileType) {

    const list = data.split("\n");
    const headers = list[0].split(",").map(item => item.replaceAll('\"', ""));
    const i18nHeaders = headers.map(header => T.translate(`vehicles.reportDownloader.headers.${header.replaceAll(".", "_")}`));

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
            return _value != null &&  _value!= "" ? T.translate(`vehicles.reportDownloader.values.${_name}.${_value}`): "" ;
          }
          const headerKeysToParseToStringDate = [ 
            "regulatoryCompliance.operationCardExpeditionDate",
            "regulatoryCompliance.operationCardExpirationDate",
            "regulatoryCompliance.mandatoryInsuranceExpeditionDate",
            "regulatoryCompliance.mandatoryInsuranceExpirationDate",
            "regulatoryCompliance.technomechanicalExpeditionDate",
            "regulatoryCompliance.technomechanicalExpirationDate",
            "regulatoryCompliance.carInsuranceExpeditionDate",
            "regulatoryCompliance.carInsuranceExpirationDate",
            "metadata.createdAt", "metadata.updatedAt"
          ];

          const headerKeysToParseToStringDateWith_HHmmss = [
            "metadata.createdAtTime", "metadata.updatedAtTime"
          ];
 
          const headerKeysToMapValueWithI18nFile = [
            "active", "ownership", "schemaType","fuelType","type", "hasDriverDoor"
          ];

          tranformationFnMap["default"] = (name, value) => value.replaceAll('"', '');
          headerKeysToParseToStringDate.forEach(headerKey => tranformationFnMap[headerKey] = stringMillisToStringDateFn);
          headerKeysToParseToStringDateWith_HHmmss.forEach(headerKey => tranformationFnMap[headerKey] = stringMillisToStringDateWith_HHmmss_Fn);
          headerKeysToMapValueWithI18nFile.forEach(headerKey => tranformationFnMap[headerKey] = getValueFromI19nFileFn);
          tranformationFnMap["colors"] = (name, colorList) => {
            const colorListObj = JSON.parse(colorList);
            const i18nList = colorListObj.map(color => T.translate(`vehicles.reportDownloader.values.${name}.${color}`));
            return i18nList.join(",");
          }
          tranformationFnMap['companyId'] = (name, value) => {
            const companyId = JSON.parse(value);
            const company = companies && companies.length > 0 && companies.find(company => company.id === (companyId || 'NO_COMPANY'));
            return company && company.name ? company.name : '';
          }

          const fnParser = tranformationFnMap[headerKey] || tranformationFnMap["default"];

          return selectedOption === "CSV"
            ? `"${fnParser(headerKey, rawValue)}"`
            : fnParser(headerKey, rawValue)
        });

      });

    return { headers: i18nHeaders, rows }
  }

  function buildQueryArguments({ filters: { keyword, organizationId, active, company }, order, page, rowsPerPage }) {

    const args = {
      "filterInput": { organizationId, extendedData: true },
      "paginationInput": { "page": page, "count": rowsPerPage, "queryTotalResultCount": true },
      "sortInput": order.id ? { "field": order.id, "asc": order.direction === "asc" } : undefined
    };

    if (keyword.trim().length > 0) {
      args.filterInput.keyword = keyword;
    }
    if (active != null) {
      args.filterInput.active = active;
    }
    if (company) {
      args.filterInput.company = company.id;
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
          const currentLength = (row[columnKey] || []).length;
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

  async function _getIteratedRows() {
    let page = 0;
    let rowsPerPage = 10;
    let rowsInLastResponse = 10;
    let totalItemsDownloaded = [];

    while (open && rowsInLastResponse === rowsPerPage) {

      const args = buildQueryArguments({ filters, order, page, rowsPerPage });
      page = page + 1;

      await new Promise(resolve => setTimeout(resolve, 1000));
      const result = await graphqlService.client.query(OrganizationMngCompleteVehicleListing(args));

      const { listing, queryTotalResultCount } = ((result || {}).data || {}).OrganizationMngVehicleListing || {};
      rowsInLastResponse = listing.length;

      if (queryTotalResultCount) {
        setTotalItemsToDownload(queryTotalResultCount);
      }

      totalItemsDownloaded.push(...listing);
      setDownloadedItems([...totalItemsDownloaded]);
    }
  }

  function getIteratedRows() {
    let page = 0;
    let rowsPerPage = 10;
    let totalItemsDownloaded = [];

    const firstQuery = buildQueryArguments({ filters, order, page, rowsPerPage });

    // const r = searchVehicleQuery({ variables: firstQuery });
    defer(() => graphqlService.client.query(OrganizationMngCompleteVehicleListing(firstQuery))).pipe(
      map(result => (((result || {}).data || {}).OrganizationMngVehicleListing || {}).queryTotalResultCount),
      mergeMap((total) => {
        setTotalItemsToDownload(total);
        const iterations = Math.ceil(total / rowsPerPage);
        return range(0, iterations).pipe(
          // takeUntil(stopDownload$),
          map(i => buildQueryArguments({ filters, order, page: i, rowsPerPage })),
          concatMap(queryArgs => of(queryArgs).pipe(
            delay(100),
            filter(() => selectedOption != null),
            mergeMap(args => defer(() => graphqlService.client.query(OrganizationMngCompleteVehicleListing(args)))),
            // tap(r => console.log({ selectedOption, r })),
            map(result => (((result || {}).data || {}).OrganizationMngVehicleListing || {}).listing)
          ))
        )
      }),
    ).subscribe(
      (list) => {
        if (selectedOption) {
          totalItemsDownloaded.push(...list);
          setDownloadedItems([...totalItemsDownloaded]);
        }

      },
      e => console.log(e),
      () => console.log("TERMINADO")
    )

  }

  function createFileFromJson(data) {
    const blob = new Blob([JSON.stringify(data, null, 4)], { type: "application/json" });
    const fileName = T.translate(`vehicles.reportDownloader.fileNamePrefix`) + "_" + moment(Date.now()).format("DD/MM/YYYY");
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
    const fileName = T.translate(`vehicles.reportDownloader.fileNamePrefix`) + "_" + moment(Date.now()).format("DD/MM/YYYY");

    downloadFileWithFileSaver(blob, `${fileName}.xlsx`);

  }

  function createFileFromCSV(headers, rows) {
    const headersAndRows = [headers, ...rows];
    const rawCsvData = headersAndRows.map(e => e.join(",")).join("\n");
    const csvData = "\uFEFF" + rawCsvData;
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });
    const fileName = T.translate(`vehicles.reportDownloader.fileNamePrefix`) + "_" + moment(Date.now()).format("DD/MM/YYYY");

    downloadFileWithFileSaver(blob, `${fileName}.csv`);
  }


  function clearJson(json) {

    if (json == null) return json;

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
      case "string": return json.replaceAll(",", ".");

      default: return json;
    }
  }

  function downloadFileWithFileSaver(blob, fileName) {
    FileSaver.saveAs(blob, fileName);
    onClose(false);
  }

  function clearProcessVariables() {
    // console.log("REINICIANDO LA VARIABLES");
    setSelectedOption(null);
    setDownloadProgress(0);
    setDownloadedItems([]);
    setTotalItemsToDownload(null);
    // stopDownload$.next("true");
  }

  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className={`${classes.dialog}`}
    >
      <DialogTitle id="alert-dialog-title">
        {(!selectedOption || !downloadProgress)
          ? T.translate("vehicles.reportDownloader.questionMsg") // ¿En que formato deseas descargar tu informe?
          : T.translate("vehicles.reportDownloader.progress_msg") //"Estamos creando tu reporte en estos momentos..."
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
          { T.translate("vehicles.reportDownloader.cancel") }
        </Button>
        } */}

        {/* BUTTON TO CLOSE DIALOG */}
        <Button variant="contained" onClick={onClose.bind(this, false)} className={`${classes.buttonClose}`}>
          {T.translate("vehicles.reportDownloader.close")}
        </Button>

      </DialogActions>

    </Dialog>
  );
}


export default DialogComponent;