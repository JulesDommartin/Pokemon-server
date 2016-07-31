"use strict";

const Model           = require('./model');
const logger          = require('../../logger');
const ControllerBase  = require('../base/controller');

class AccessToken extends ControllerBase {

  constructor (db) {
    super('accessToken');
    this.dao = new Model(db);
  }

  getAdminKey (cb) {
  	this.dao.findOne({role:"admin"}, (err, res) => {
  		if (err) return cb(err, null);
  		else if (res) return cb(null, res.toObject());
  		else return cb("No key existing", null);
  	});
  }

  getUserKey (cb) {
  	this.dao.findOne({role:"user"}, (err, res) => {
  		if (err) return cb(err, null);
  		else if (res) return cb(null, res.toObject());
  		else return cb("No key existing", null);
  	});
  }

  getKeyByRole (role, cb) {
  	this.dao.findOne({role:role}, (err, res) => {
  		if (err) return cb(err, null);
  		else if (res) return cb(null, res.toObject());
  		else return cb("No key existing", null);
  	});
  }

}

module.exports = AccessToken;
