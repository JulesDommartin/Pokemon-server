"use strict";

const Model           = require('./model');
const logger          = require('../../logger');
const ControllerBase  = require('../base/controller');

class Move extends ControllerBase {

  constructor (db) {
    super('move');
    this.dao = new Model(db);
  }

  all(cb) {
    logger.debug("[" + this.name + ".baseController] find all");
    this.dao.find({}, null, {sort: {id: 1}}, (err, entities) => {
      if (err) return cb(err);
      cb(null, entities);
    });
  }

}

module.exports = Move;
