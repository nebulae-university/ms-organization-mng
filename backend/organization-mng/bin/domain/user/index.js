"use strict";

const { empty, Observable } = require("rxjs");

const UserCRUD = require("./UserCRUD")();
const UserES = require("./UserES")();
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
   * @returns {UserCRUD}
   */
  UserCRUD: UserCRUD,
  /**
   * CRUD request processors Map
   */
  cqrsRequestProcessorMap: UserCRUD.generateRequestProcessorMap(),
  /**
   * @returns {UserES}
   */
  UserES,
  /**
   * EventSoircing event processors Map
   */
  eventSourcingProcessorMap: UserES.generateEventProcessorMap(),
};
