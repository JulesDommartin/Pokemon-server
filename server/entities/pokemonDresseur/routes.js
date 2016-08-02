'use strict';

const express         = require('express');
const Controller      = require('./controller');
const logger          = require('../../logger');
const RouteBase       = require('../base/routes');
const _               = require('underscore');
const Q               = require('q');

class PokemonDresseur extends RouteBase {

  constructor(db) {
    super(db);
    this.ctrl   = new Controller(db);
  }

  getOne () {
    this.router.get('/mine', (req, response, next) => { this.getMine(req, response); });
  }

  getMine (req, response) {
    if (req.role == "user" || req.role == "admin") {
      logger.info("GET " + req.originalUrl + " (id: " + req.userId + ")");
      this.ctrl.find({_id:req.userId}, (err, pokemons) => {
        if (err) {
          logger.error(err);
          response.status(500).send(err);
        } else {
          logger.info({code: 200, message: "Ok"});
          response.status(200).send(pokemons);
        }
      });
    } else {
      response.status(401).send({code: 401, message: "You are not authenticated"});
    }
  }

}

module.exports = PokemonDresseur;