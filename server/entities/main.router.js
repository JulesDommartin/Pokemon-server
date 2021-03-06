'use strict';

var express = require('express');

class Router {

  constructor(db) {
    this.router = express.Router();
    this.init(db);
  }

  init(db) {

    let AccessToken     = require('./accessToken/routes');
    let Dresseur        = require('./dresseur/routes');
    let Move            = require('./move/routes');
    let Pokemon         = require('./pokemon/routes');
    let PokemonDresseur = require('./pokemonDresseur/routes');
    let User            = require('./user/routes');
    let Utils           = require('./utils/routes');

    let accessToken     = new AccessToken(db);
    let dresseur        = new Dresseur(db);
    let move            = new Move(db);
    let pokemon         = new Pokemon(db);
    let pokemonDresseur = new PokemonDresseur(db);
    let user            = new User(db);
    let utils           = new Utils(db);

    this.router.use('/accessToken', accessToken.router);
    this.router.use('/dresseurs', dresseur.router);
    this.router.use('/moves', move.router);
    this.router.use('/pokemons', pokemon.router);
    this.router.use('/pokemonsdresseur', pokemonDresseur.router);
    this.router.use('/users', user.router);
    this.router.use('/utils', utils.router);

  }

}

module.exports = Router;
