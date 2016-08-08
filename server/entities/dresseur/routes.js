'use strict';

const express         = require('express');
const Controller      = require('./controller');
const logger          = require('../../logger');
const RouteBase       = require('../base/routes');
const _ 							= require('underscore');

class Dresseur extends RouteBase {

  constructor(db) {
    super(db);
    this.ctrl   = new Controller(db);
  }

	putHandler(req ,response, next) {
	  logger.info("PUT - base router - put handler - " + req.originalUrl + " (id: " + req.params.id + ")");

	  this.ctrl.update(_.extend(req.body, {pseudo:req.params.id}), (err, entity) => {
	    if (err) {
	      logger.error(err);
	      return response.status(err.code || 500).send(err);
	    } else {
	      // returning the updated document to prevent read failure
	      this.ctrl.findByPseudo(req.params.id, (err, doc) => {
	        if (err) {
	          logger.error(err);
	          return response.status(err.code || 500).send(err);
	        }
	        return response.status(200).send(doc);
	      }); // ctrl.findById
	    }
	  }); // ctrl.update

	}


}

module.exports = Dresseur;
