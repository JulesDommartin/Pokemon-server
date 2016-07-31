"use strict";

const express      = require('express');
const mongoose     = require('mongoose');
const _            = require('underscore');
const logger       = require('../../logger');
const apiaccess    = require('../../apiaccess');
const Q            = require('q');

class RouteBase {
  constructor(db) {
    this.db = db;
    this.router = express.Router();
    this.get();
    this.getOne();
    this.put();
    this.post();
    this.deleteOne();
  }


  getOneMiddleware(req, response, next) {
    logger.info("base - get one middleware - prepare owd and sharing rule settings " + req.originalUrl);

    this.ctrl.findById(req, (err, docs) => {
      if (err) {
        logger.error(err);
        return response.status(err.code || 500).send(err);
      }
      else if (docs.length !== 1) {
        return response.status(404).send({"code": 404, "message" : "document not found"});
      }
      req.docs = docs[0];
      next();
    });
  }

  get() {
    this.router.get('/', (req, response, next) => { this.permissionMiddleware(req, response, next); });
    this.router.get('/', (req, response) => { this.getHandle(req, response); });
  }

  getHandle(req, response) {
    logger.info("GET " + req.originalUrl);
    this.ctrl.all((err, docs) => {
      if (err) {
        logger.error(err);
        return response.status(err.code || 500).send(err);
      } else {
        logger.info({"response" : "ok", "code" : 200});
        return response.status(200).send(docs);
      }
    });
  }

  getOne() {
    this.router.get('/:id', (req, response, next) => { this.permissionMiddleware(req, response, next); });
    this.router.get('/:id', (req, response) => { this.getOneHandler(req, response); });
  }

  getOneHandler(req, response) {
    logger.info("GET " + req.originalUrl);
    this.ctrl.findOne((err, doc) => {
      if (err) {
        logger.error(err);
        return response.status(err.code || 500).send(err);
      } else {
        return response.status(200).send(doc);
      }
    });
  }

  put() {
    this.router.put('/:id', (req, response, next) => { this.permissionMiddleware(req, response, next); });
    this.router.put('/:id', (req, response, next) => { this.putHandler(req, response, next);                 });
  }

  permissionMiddleware(req, response, next) {
    console.log(req.headers);
    apiaccess.hasAccess(req.headers.authorization, this.db,(err, res) => {
      if (err) {
        logger.error(err);
        return response.status(err.code || 500).send(err);
      }
      if (res == "admin") req.role = 'admin';
      else if (res == "user") req.role = 'user';
      else return response.status(400).send("Not authenticated");
      next();
    });
  }

  putHandler(req ,response, next) {
    logger.info("PUT - base router - put handler - " + req.originalUrl + " (id: " + req.params.id + ")");
  }

  deleteOne() {
    this.router.delete('/:id', (req, response, next) => { this.getOneMiddleware(req, response, next);              });
    this.router.delete('/:id', (req, response, next) => { this.permissionMiddleware(req, response, next); });
    this.router.delete('/:id', (req, response, next) => { this.deleteOneHandler(req, response, next);              });
  }

  deleteOneHandler(req, response, next) {
    logger.info("DELETE " + req.originalUrl + "id: " + req.params.id + ")");

    if (req.docs.active === false) {
      logger.info({"code" : 200, "message" : "already deleted"});
      return response.status(200).send({"code" : 200, "message" : "already deleted"});
    } else {
      this.ctrl.remove({_id:req.docs._id.toString(), active:false}, (err, res) => {
        if (err) {
          logger.error(err);
          return response.status(err.code || 500).send(err);
        }
        logger.info({"response" : "ok", "code" : 200});
        return response.status(200).send(res);
      });
    }
  }

  post() {
    this.router.post('/', (req, response, next) => { this.permissionMiddleware(req, response, next); });
    this.router.post('/', (req, response, next) => { this.postHandler(req, response, next);          });
  }

  postHandler(req, response) {
    logger.info("POST " + req.originalUrl);
    if (req.role == 'admin') {
      this.parseEntities(req, (err, entities) => {
        if (err) response.status(400).send(err);
        entities.forEach((entity) => {
          this.ctrl.insertUser(entity, (err, res) => {
            if (err) response.status(res).send(err);
            response.status(200).send(res);
          });
        });
      });
    } else {
      response.status(403).send("Access Forbidden");
      logger.info("Insufficient rights");
    }
  }

  parseEntities(req, cb) {
    var keys          = Object.keys(req.body).map(key => key);
    let isEntityArray = Object.keys(req.body).length === 0 ? false : true;
    keys.forEach(function(item) {
      if ( isNaN(item) ) { isEntityArray = false; }
    });

    let entities = [];
    if (isEntityArray) {
      entities = Object.keys(req.body).map(key => req.body[key]);
    } else {
      entities.push(req.body);
    }
    cb(null, entities);
  }

}

module.exports = RouteBase;
