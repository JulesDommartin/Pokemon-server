"use strict";

const mongoose      = require('mongoose');
const logger        = require('./logger');
const express       = require('express');
const config        = require('./config');
const request       = require('request');
const path          = require('path');

module.exports = function(app, db) {
  logger.info("- local environment -");
  logger.info("setting up static files");

  app.use('/bower_components', express.static(path.join(__dirname, '/../../client/bower_components')));
  app.use('/', express.static(path.join(__dirname, '/../../client/client/app')));

  // app.use((req, res, next) => {
  //   res.setHeader("Access-Control-Allow-Origin", "*");
  //   res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  //   res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  // });

  app.use('/api', (req, res, next) => {
		if (req.method == "OPTIONS") {
			return res.status(200).send("GET,POST,PUT,DELETE");
		} else {
			next();
		}
	});

  const Main = require('./entities/main.router');

  const main = new Main(mongoose);

  app.use('/api', main.router);

};
