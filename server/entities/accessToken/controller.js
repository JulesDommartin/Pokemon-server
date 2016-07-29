"use strict";

const Model           = require('./model');
const logger          = require('../../logger');
const ControllerBase  = require('../base/controller');

class AccessToken extends ControllerBase {

  constructor (db) {
    super('accessToken');
    this.dao = new Model(db);
  }

}

module.exports = AccessToken;
