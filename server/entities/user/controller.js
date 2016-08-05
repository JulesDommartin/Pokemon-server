"use strict";

const Model               = require('./model');
const logger              = require('../../logger');
const ControllerBase      = require('../base/controller');
const DresseurCtrl 	      = require('../dresseur/controller');
const AccessTokenCtrl     = require('../accessToken/controller');
const sha1                = require('sha1');

class User extends ControllerBase {

  constructor (db) {
    super('user');
    this.dao = new Model(db);
    this.dresseurCtrl = new DresseurCtrl(db);
    this.accessTokenCtrl = new AccessTokenCtrl(db);
  }

  connect(user, cb) {
    var password = user.password;
    this.dao.findOne({pseudo: user.pseudo}, (err, user) => {
      if (err) return cb(err);
      else {
        var hash = sha1(password);
        this.dao.findOne({pseudo: user.pseudo, password: hash}, cb);
      }
    });
  }

  findOne (params, cb) {
    this.dao.findOne(params, (err, res) => {
      if (err) return cb(err, null);
      else if (res) return cb(null, res.toObject());
      else return cb(null, null);
    });
  }

  beforeInsert (entity, cb) {
  	logger.debug("[" + super.name + ".baseController] beforeInsert");
  	if (entity.email !== undefined && entity.email !== null) {
  	  this.findOne({email:entity.email}, (err, res) => {
  	  	if (err) 
          return cb(err, null);
  	  	else if 
          (res) return cb({code: 400, msg: "User with this email already exists"}, null);
  	  	else {
          this.findOne({pseudo: entity.pseudo}, (err, res) => {
            if (err) {
              return cb(err);              
            } else if (res) {
              return cb({code: 400, msg: "User with this pseudo already exists"}, null);              
            } else {
              console.log(entity.password);
              entity.password = sha1(entity.password);
              return cb(null, entity);
            }
          });
        }
  	  });
  	}
  }

  insertUser(entity, cb) {
    this.beforeInsert(entity, (err, res) => {
      if (err) {
        return cb(err);
      } else {
        logger.debug("[" + this.name + ".controller] insert");
        logger.debug(entity);
        var instance = new this.dao(entity);
        instance.save(instance, (err, doc) => {
          if (err) return cb(err);
          super.afterInsert(doc);
          var dresseur = {
            userId: doc._id,
            pseudo: doc.pseudo,
          };
          this.dresseurCtrl.insert(dresseur, (err, res) => {
            if (err) return cb(err, 500);
            var token = {
              userId: doc._id,
              key: sha1(doc.pseudo) + sha1(doc.password),
              role: doc.role || 'user'
            }
            this.accessTokenCtrl.insert(token, (err, res) => {
              if (err) return cb(err);
              return cb(null, 200);
            });
          });
        });
      }
    });
  }

}

module.exports = User;
