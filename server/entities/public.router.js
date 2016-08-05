'use strict';

var express = require('express');

class Router {

  constructor(db) {
    this.router = express.Router();
    this.init(db);
  }

  init(db) {

    let User            = require('./user/routes');

    let user            = new User(db);

    this.router.use('/users', user.publicRouter);

  }

}

module.exports = Router;
