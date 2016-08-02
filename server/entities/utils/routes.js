"use strict";

const request         = require('request');


class Utils {

  constructor(db) {
    this.router = require('express').Router();
    this.router.get('/pokemons', (req, res, next) => { this.getPokemonByNumber(req, res, next); } );
    this.router.get('/moves', (req, res, next)    => { this.getMovesById(req, res, next); });
  }

  getPokemonByNumber(req, res, next) {
    if (req.query && req.query.number !== undefined) {
      request({
        url: "http://pokeapi.co/api/v2/pokemon/" + req.query.number + "/",
        method: "GET",
        headers: {
          'content-type':'json'
        },
        json: true
      }, (err, _res, body) => {
        if (err) return res.status(err.code || 500).send(err);
        if (body.data !== null && body.data !== undefined) {
          res.send(body.data);
        } else {
          res.status(500).send(body);
        }
      });
    } else {
      res.status(500).send("Veuillez indiquer un numéro de pokémon");
    }
  }

  getMovesById(req, res, next) {
    if (req.query && req.query.number) {
      request({
        url: "http://pokeapi.co/api/v2/move/" + req.query.number + "/",
        method: "GET",
        headers: {
          'content-type': 'json'
        },
        json: true
      }, (err, _res, body) => {
        if (err) return res.status(err.code || 500).send(err);
        if (body.data !== null && body.data !== undefined) {
          res.status(200).send(body.data);
        } else {
          res.status(500).send(body);
        }
      });
    } else {
      res.status(400).send("Aucun id de move trouvé");
    }
  }

}

module.exports = Utils;
