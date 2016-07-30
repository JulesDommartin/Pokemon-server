"use strict";

const Model           = require('./model');
const logger          = require('../../logger');
const ControllerBase  = require('../base/controller');

class Pokemon extends ControllerBase {

  constructor (db) {
    super('pokemon');
    this.dao = new Model(db);
  }

  findAll (cb) {
  	this.dao.find({} , null, {sort: {id: 1}}, (err, entities) => {
  	  if (err) return cb(err);
  	  cb(null, entities);
  	});
  }

}

module.exports = Pokemon;
