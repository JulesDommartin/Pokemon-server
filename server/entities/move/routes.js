'use strict';

const express         = require('express');
const Controller      = require('./controller');
const logger          = require('../../logger');
const RouteBase       = require('../base/routes');
const _               = require('underscore');
const Q               = require('q');

class Move extends RouteBase {

  constructor(db) {
    super(db);
    this.ctrl   = new Controller(db);
  }

  getOneHandler(req, response) {
    logger.info("GET " + req.originalUrl);
    this.ctrl.find({id: req.params.id}, (err, doc) => {
      if (err) {
        logger.error(err);
        return response.status(err.code || 500).send(err);
      } else {
        return response.status(200).send(doc);
      }
    });
  }

}

module.exports = Move;
