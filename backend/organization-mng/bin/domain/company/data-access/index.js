"use strict";

const Rx = require('rxjs');

const CompanyDA = require("./CompanyDA");
const PaymentMediumCodeDA = require("./PaymentMediumCodeDA");
const OrganizationDA = require("./OrganizationDA");

module.exports = {
  /**
   * Data-Access start workflow
   */
  start$: Rx.concat(CompanyDA.start$(), PaymentMediumCodeDA.start$(), OrganizationDA.start$()),
  /**
   * @returns {CompanyDA}
   */
  CompanyDA: CompanyDA,
  /**
     * @returns {PaymentMediumCodeDA}
     */
  PaymentMediumCodeDA: PaymentMediumCodeDA,
  /**
     * @returns {OrganizationDA}
     */
  OrganizationDA: OrganizationDA
};
