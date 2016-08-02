"use strict";

const Model           = require('./model');
const logger          = require('../../logger');
const ControllerBase  = require('../base/controller');

class PokemonDresseur extends ControllerBase {

  constructor (db) {
    super('pokemonDresseur');
    this.dao = new Model(db);
  }

}

module.exports = PokemonDresseur;
