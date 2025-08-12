"use strict";

const Rx = require('rxjs');

const OrganizationDA = require("./OrganizationDA");
const KeyCloakDA = require("./KeyCloakDA");
const UserDA = require("./UserDA");
const PaymentMediumCodeDA = require("./PaymentMediumCodeDA");
module.exports = {
  /**
   * Data-Access start workflow
   */
  start$: Rx.concat(OrganizationDA.start$(), UserDA.start$(), PaymentMediumCodeDA.start$()),
  /**
   * @returns {OrganizationDA}
   */
  OrganizationDA: OrganizationDA,
  /**
 * @returns {KeyCloakDA}
 */
  KeyCloakDA: KeyCloakDA,
  /**
 * @returns {UserDA}
 */
  UserDA: UserDA,
  /**
 * @returns {PaymentMediumCodeDA}
 */
  PaymentMediumCodeDA: PaymentMediumCodeDA
};
