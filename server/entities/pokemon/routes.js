'use strict';

const express         = require('express');
const Controller      = require('./controller');
const logger          = require('../../logger');
const RouteBase       = require('../base/routes');

class Pokemon extends RouteBase {

  constructor(db) {
    super(db);
    this.ctrl   = new Controller(db);
  }

  getHandle(req, response) {
    logger.info("GET " + req.originalUrl);
    this.ctrl.findAll((err, docs) => {
      if (err) {
        logger.error(err);
        return response.status(err.code || 500).send(err);
      } else {
        logger.info({"response" : "ok", "code" : 200});
        return response.status(200).send(docs);
      }
    });
  }

  getOneHandler(req, response) {
    logger.info("GET " + req.originalUrl);
    this.ctrl.findOne({id: req.params.id}, (err, doc) => {
      if (err) {
        logger.error(err);
        return response.status(err.code || 500).send(err);
      } else {
        return response.status(200).send(doc);
      }
    });
  }

}

module.exports = Pokemon;
