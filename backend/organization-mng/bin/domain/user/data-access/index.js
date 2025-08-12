"use strict";

const Rx = require('rxjs');

const UserDA = require("./UserDA");
const CompanyDA = require("./CompanyDA");
const KeyCloakDA = require("./KeyCloakDA");
const OrganizationDA = require("./OrganizationDA");
module.exports = {
  /**
   * Data-Access start workflow
   */
  start$: Rx.concat(UserDA.start$(), CompanyDA.start$(), OrganizationDA.start$()),
  /**
   * @returns {UserDA}
   */
  UserDA: UserDA,
  /**
   * @returns {CompanyDA}
   */
  CompanyDA: CompanyDA,
  /**
   * @returns {KeyCloakDA}
   */
  KeyCloakDA: KeyCloakDA,
    /**
   * @returns {OrganizationDA}
   */
  OrganizationDA: OrganizationDA,
};
