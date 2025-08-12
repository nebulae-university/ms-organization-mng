"use strict";

const Rx = require('rxjs');

const VehicleDA = require("./VehicleDA");
const UserDA = require("./UserDA");
const CompanyDA = require("./CompanyDA");
const TemporalToDeletDA = require("./TemporalToDeletDA");

module.exports = {
  /**
   * Data-Access start workflow
   */
  start$: Rx.concat(VehicleDA.start$(), UserDA.start$(), CompanyDA.start$(), TemporalToDeletDA.start$()),
  /**
   * @returns {VehicleDA}
   */
  VehicleDA: VehicleDA,
  /**
   * @returns {UserDA}
   */
  UserDA: UserDA,
  /**
   * @returns {CompanyDA}
   */
   CompanyDA:CompanyDA,
   /**
   * @returns {TemporalToDeletDA}
   */
    TemporalToDeletDA:TemporalToDeletDA,
};
