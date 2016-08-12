"use strict";

const mongoose      = require('mongoose');
const logger        = require('./logger');
const express       = require('express');
const config        = require('./config');
const request       = require('request');
const path          = require('path');
const userController= require('./entities/user/controller');

var userCtrl = new userController(mongoose);

module.exports = function(app, db) {
  logger.info("- local environment -");
  logger.info("setting up static files");

  app.use('/bower_components',  express.static(path.join(__dirname, '/../../client/bower_components')));
  app.use('/admin',             express.static(path.join(__dirname, '/../../admin/client/app')));
  app.use('/',                  express.static(path.join(__dirname, '/../../client/client/app')));

  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,, Authorization, Content-Length");
    return next();
  });

  app.use('/api', (req, res, next) => {
		if (req.method == "OPTIONS") {
			return res.status(200).send("GET,POST,PUT,DELETE");
		} else {
			next();
		}
	});

  const Auth = require('./authentication');
  var auth = new Auth(db);

  app.all('/api/token', (req, response, next) => {
    logger.info("POST : " + req.originalUrl);
    if (!req.body.pseudo) {
      return response.status(400).send({
        code: 400,
        message: "No pseudo provided"
      });
    } else {
      var pseudo = req.body.pseudo;
    }
    if (!req.body.password) {
      return response.status(400).send({
        code: 400,
        message: "No password provided"
      });
    } else {
      var password = req.body.password;
    }

    if (pseudo && password) {
      userCtrl.find({pseudo: pseudo}, (err, users) => {
        if (users.length < 1) {
          logger.error({code: 404, message: "No user existing with this pseudo"});
          return response.status(404).send({code: 404, message: "No user existing with this pseudo"});
        } else {
          userCtrl.connect({"pseudo":pseudo, "password": password}, (err, user) => {
            if (err) {
              logger.error({"code":err.code || 500});
              return response.status(err.code || 500).send(err);
            } else if (!user) {
              logger.error({code:400, message:"Wrong password, please try again"});
              return response.status(400).send({code:400, message:"Wrong password, please try again"});
            } else {
              auth.getTokenByUserId(user._id, (err, token) => {
                if (err) return response.status(500).send({code:500, message:"Can't get the token"});
                else return response.status(200).send({token:token.key});
              });
            }
          });
        }
      });
    }
  });

  app.use('/api', (req, res, next) => {
    var authorizationHeader = req.get('authorization');
    if (authorizationHeader !== undefined && authorizationHeader !== null) {
      authorizationHeader = authorizationHeader.split(" ");
      if (authorizationHeader.length == 2) {
        logger.info("authorization header: ");
        logger.info(authorizationHeader);
        auth.getUserFromToken(authorizationHeader[1], (err, user) => {
          if (err) {
            console.log("On y est");
            res.status(401).send({
              code: 401,
              message: "Wrong bearer key"
            });
          }
          if (!user) {
            res.status(401).send({
              code: 401,
              message: "No key with this bearer"
            });
          }
          req.userId = user.userId;
          req.role   = user.role;
          next();
        });
      } else {
        res.status(401).send({
          code: 401,
          message: 'Not authenticated (malformed auth header)'
        });
      }
    } else {
      res.status(401).send({
        code: 401,
        message: 'Not authenticated (no authorization header)'
      });
    }
  });

  app.use('/public', (req, res, next) => {
    next();
  });

  const Main = require('./entities/main.router');
  const Public = require('./entities/public.router');

  const main = new Main(mongoose);
  const publicR = new Public(mongoose);

  app.use('/api', main.router);
  app.use('/public', publicR.router);

};
