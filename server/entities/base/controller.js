"use strict";

const logger       = require("../../logger");
const mongoose     = require('mongoose');
const _            = require('underscore');
const Q            = require('q');

class EntityBase {
  constructor(name, db) {
    this.name = name;
  }

  all(cb) {
    logger.debug("[" + this.name + ".baseController] find all");
    this.dao.find({} , (err, entities) => {
      if (err) return cb(err);
      cb(null, entities);
    });
  }

  findById(id, cb) {
    logger.debug("[" + this.name + ".baseController] findById, id: " + id);
    this.dao.findOne({_id: id}, cb);
  }

  find(params, cb) {
    logger.debug("[" + this.name + ".baseController] find (baseCtrl) params:");
    logger.debug(params);
    // this.dao.find(params, null, {sort: {createdDate: -1}}, (err, docs) => {
      this.dao.find(params, null, {sort: {createdDate: -1}}, (err, docs) => {
      if (err) { return cb(err); }
      cb(null, docs);
    });
  }

  findPromise(params) {
    let q = Q.defer();
    logger.debug("[" + this.name + ".baseController] findPromise (params) :");
    logger.debug(JSON.stringify(params));
    //this.dao.find(params, null, {sort: {createdDate: -1}}, (err, docs) => {
      this.dao.find(params, (err, docs) => {
      if (err) { q.reject(err); }
      else { q.resolve(docs); }
    });
    return q.promise;
  }

  deleteOne(id, cb) {
    logger.debug("[" + this.name + ".baseController] delete (baseCtrl), id: " + id);
    this.dao.findByIdAndRemove(id, cb); // executes
  }

  beforeUpdate(entity, cb) {
    logger.debug("[" + this.name + ".baseController] beforeUpdate");
    cb(null, entity);
  }

  update(entity, cb) {
    this.beforeUpdate(entity, (err, res) => {
      logger.debug("[" + this.name + ".baseController] update (baseCtrl), entity: ");
      logger.debug(entity);
      if (entity._id) {
        this.dao.update({_id: entity._id}, entity, {multi:true}, (err, doc) => {
          this.afterUpdate(doc);
          cb(err, doc);
        });
      } else {
        return cb({"code":500,"message":"no _id in the entity to update"});
      }
    });
  }

  afterUpdate(entity) {
    logger.debug("[" + this.name + ".baseController] afterUpdate");
  }

  beforeInsert(entity, cb) {
    logger.debug("[" + this.name + ".baseController] beforeInsert");
    cb(null, entity);
  }

  afterInsert(doc) {
    logger.debug("[" + this.name + ".baseController] afterInsert");
  }

  insert(entity, cb) {
    this.beforeInsert(entity, (err, res) => {
      if (err) cb(err, 400);
      logger.debug("[" + this.name + ".controller] insert");
      logger.debug(entity);
      var instance = new this.dao(entity);
      instance.save(instance, (err, doc) => {
        if (err) cb(err, 400);
        this.afterInsert(doc);
        cb(null, doc);
      });
    });
  }

  remove(params, cb) {
    logger.debug("[" + this.name + ".baseController] remove");
    logger.debug(params);
    this.dao.remove(params, cb);
  }

  public(entity, host, cb) {
    logger.debug("[" + this.name + ".baseController] public");
    logger.debug(JSON.stringify(entity));
    this.dao.public(entity, {host:host}, cb);
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

module.exports = EntityBase;
