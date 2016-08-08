"use strict";

const Model           = require('./model');
const logger          = require('../../logger');
const ControllerBase  = require('../base/controller');

class Dresseur extends ControllerBase {

  constructor (db) {
    super('dresseur');
    this.dao = new Model(db);
  }

  findByPseudo(pseudo, cb) {
  	console.log("Find One : " + pseudo);
  	super.findOne({pseudo:pseudo}, (err, res) => {
  		if (err) return cb(err);
  		return cb(null, res);
  	});
  }

  update(entity, cb) {
    super.beforeUpdate(entity, (err, res) => {
      logger.info("[" + this.name + ".baseController] update (baseCtrl), entity: ");
      logger.info(entity);
      if (entity.pseudo) {
      	delete entity._id;
        this.dao.update({pseudo: entity.pseudo}, entity, {multi:true}, (err, doc) => {
          super.afterUpdate(doc);
          cb(err, doc);
        });
      } else {
        return cb({"code":500,"message":"no _id in the entity to update"});
      }
    });
  }


}

module.exports = Dresseur;
