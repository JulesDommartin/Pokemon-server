'use strict';

const express         = require('express');
const Controller      = require('./controller');
const logger          = require('../../logger');
const RouteBase       = require('../base/routes');

class Dresseur extends RouteBase {

  constructor(db) {
    super(db);
    this.ctrl   = new Controller(db);
  }
}

module.exports = Dresseur;
