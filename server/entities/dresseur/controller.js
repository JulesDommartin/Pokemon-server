"use strict";

const Model           = require('./model');
const logger          = require('../../logger');
const ControllerBase  = require('../base/controller');

class Dresseur extends ControllerBase {

  constructor (db) {
    super('dresseur');
    this.dao = new Model(db);
  }

}

module.exports = Dresseur;
