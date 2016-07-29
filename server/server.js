"use strict";

const express       = require('express');
var app             = express();
const serverExpress = require('http').Server(app);
const bodyParser    = require('body-parser');
const mongoose      = require('mongoose');
const provider      = require('./provider');
const logger        = require('./logger');
const config        = require('./config');
const Q             = require('q');

var boot = function (config) {
  let deferred = Q.defer();
  provider(config.mongodb.host, config.mongodb.port, config.mongodb.dbName, config.mongodb.user, config.mongodb.password, (err, res) => {
    if (err) {
      logger.error(err);
      deferred.reject(err);
    } else {
      logger.info("Setting up app config");

      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({extended: true}));

      app.set('port', config.port);

      require('./routes')(app, mongoose);

      let port = app.get('port');

      serverExpress.listen(port, () => {
        logger.info('server listening on ' + config.host + ':' + app.get('port'));
        deferred.resolve(serverExpress);
      });

    }
  });
  return deferred.promise;
};

let shutdown = () => {
  let q = Q.defer();
  serverExpress.close(() => {
    logger.info('server stopped listening');
    q.resolve();
  });
  return q.promise();
};

boot(config);
