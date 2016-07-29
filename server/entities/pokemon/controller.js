"use strict";

const Model           = require('./model');
const logger          = require('../../logger');
const ControllerBase  = require('../base/controller');

class Pokemon extends ControllerBase {

  constructor (db) {
    super('pokemon');
    this.dao = new Model(db);
  }

}

module.exports = Pokemon;
