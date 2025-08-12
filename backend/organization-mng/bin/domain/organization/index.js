"use strict";

const { empty, Observable } = require("rxjs");

const OrganizationCRUD = require("./OrganizationCRUD")();
const OrganizationES = require("./OrganizationES")();
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
   * @returns {OrganizationCRUD}
   */
  OrganizationCRUD: OrganizationCRUD,
  /**
   * CRUD request processors Map
   */
  cqrsRequestProcessorMap: OrganizationCRUD.generateRequestProcessorMap(),
  /**
   * @returns {OrganizationES}
   */
  OrganizationES,
  /**
   * EventSoircing event processors Map
   */
  eventSourcingProcessorMap: OrganizationES.generateEventProcessorMap(),
};
