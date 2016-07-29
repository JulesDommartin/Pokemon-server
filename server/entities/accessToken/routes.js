'use strict';

const express         = require('express');
const Controller      = require('./controller');
const logger          = require('../../logger');
const RouteBase       = require('../base/routes');

class AccessToken extends RouteBase {

  constructor(db) {
    super(db);
    this.ctrl   = new Controller(db);
  }

  getByRole(req, response, next) {
    logger.info("GET " + req.originalUrl);
    
  }

}

module.exports = AccessToken;
