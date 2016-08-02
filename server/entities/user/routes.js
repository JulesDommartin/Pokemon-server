'use strict';

const express         = require('express');
const Controller      = require('./controller');
const logger          = require('../../logger');
const RouteBase       = require('../base/routes');
const _               = require('underscore');
const Q               = require('q');
const DresseurCtrl    = require('../dresseur/controller');

class User extends RouteBase {

  constructor(db) {
    super(db);
    this.ctrl   = new Controller(db);
    this.dresseurCtrl = new DresseurCtrl(db);
  }

  post() {
  	this.router.post('/', (req, response, next) => { req.role = "admin"; super.postHandler(req, response, next);          });
  }

  getHandle(req, response) {
    logger.info("GET " + req.originalUrl);
    if (req.role == "admin") {
      this.ctrl.all((err, docs) => {
    	if (err) {
    	  logger.error(err);
    	  return response.status(err.code || 500).send(err);
    	} else {
    	  logger.info({"response" : "ok", "code" : 200});
          return response.status(200).send(docs);
        }
      });
    } else {
      return response.status(403).send("Access Forbidden");
    }
  }

  getOneHandler (req, response, next) {
    logger.info("GET " + req.originalUrl);
    if (req.role != "admin") {
      return response.status(403).send("Access Forbidden");
    }
    if (req.params) {
      this.ctrl.findOne(req.params, (err, res) => {
        if (err) {
          logger.error(err);
          return response.status(err.code || 500).send(err);
        } else {
          if (res != null) {
            logger.info({"response": res, "code": 200});
            return response.status(200).send(res);
          } else {
            logger.info({"response": res, "code": 400});
            return response.status(400).send("No existant user with this pseudo");
          }
        }
      });
    } else {
      return response.status(400).send("Bad request");
    }
  }

  getOne () {
    this.router.get('/me', (req, response, next) => { this.getMe(req, response); });
    this.router.get('/:pseudo', (req, response, next) => { this.getOneHandler(req, response, next); });
  }

  getExistantHandler (req, response, next) {
    logger.info("GET " + req.originalUrl);
    if (req.role != "admin") {
      return response.status(403).send("Access Forbidden");
    }
    if (req.body && req.body.email && req.body.pseudo) {
      this.ctrl.findByPseudo(req.body.pseudo, (err, res) => {
        if (err) {
          logger.error(err);
          return response.status(err.code || 500).send(err);
        } else {
          this.ctrl.findByEmail(req.body.email, (err, res) => {
            if (err) {
              logger.error(err);
              return response.status(err.code || 500).send(err);
            } else {
              logger.info({"response": res, "code": 200});
              return response.status(200).send(res); 
            }
          });
        }
      });
    } else {
      return response.status(400).send("Bad request");
    }
  }

  getExistant () {
    this.router.get('/exist/:pseudo', (req, response, next) => { req.role = "admin"; this.getExistantHandler(req, response, next); });
  }

  getMe (req, response) {
    logger.info("GET " + req.originalUrl + " (id: " + req.userId + ")");
    var promises = [];
    var user = {};
    promises.push(this.ctrl.findPromise({_id:req.userId}));
    promises.push(this.dresseurCtrl.findPromise({userId: req.userId}));
    Q.all(promises)
    .then((res) => {
      let user, dresseur;

      if (res[0].length >= 1) user      = _.clone(res[0][0].toObject()); else user      = {};
      if (res[1].length >= 1) dresseur  = _.clone(res[1][0].toObject()); else dresseur  = {};
      let responseEntity = _.extend(user, _.omit(dresseur, ['_id', 'userId']));

      logger.info({"response" : "ok", "code" : 200});
      return response.status(200).send(responseEntity);
    })
    .catch((err) => {
      logger.error(err);
      return response.status(err.code || 500).send(err);
    });
  }

}

module.exports = User;
