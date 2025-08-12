"use strict";

const { empty, Observable } = require("rxjs");

const CompanyCRUD = require("./CompanyCRUD")();
const CompanyES = require("./CompanyES")();
const DataAcess = require("./data-access/");

module.exports = {
  /**
   * domain start workflow
   */
  start$: DataAcess.start$,
  /**
   * start for syncing workflow
   * @returns {Observable}
   */
  startForSyncing$: DataAcess.start$,
  /**
   * start for getting ready workflow
   * @returns {Observable}
   */
  startForGettingReady$: empty(),
  /**
   * Stop workflow
   * @returns {Observable}
   */
  stop$: DataAcess.stop$,
  /**
   * @returns {CompanyCRUD}
   */
  CompanyCRUD: CompanyCRUD,
  /**
   * CRUD request processors Map
   */
  cqrsRequestProcessorMap: CompanyCRUD.generateRequestProcessorMap(),
  /**
   * @returns {CompanyES}
   */
  CompanyES,
  /**
   * EventSoircing event processors Map
   */
  eventSourcingProcessorMap: CompanyES.generateEventProcessorMap(),
};
