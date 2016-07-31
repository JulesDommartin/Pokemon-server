'use strict';

const logger   = require('./logger');
const config   = require('./config');
const AccessToken = require('./entities/accessToken/controller');

module.exports.hasAccess = (auth, db, cb) => {
  var err = null;
  var res = false;
  var accessToken = new AccessToken(db);
  this.userToken;
  this.adminToken;

  this.setUserToken = function (token) {
    this.userToken = token;
  }

  this.setAdminToken = function (token) {
    this.adminToken = token;
  }

  this.getUserKey = function () {
    return this.userToken;
  }

  this.getAdminKey = function () {
    return this.adminToken;
  }

  accessToken.getUserKey((err, res) => {
    if (err != null) return cb(err);
    else this.setUserToken(res);
    accessToken.getAdminKey((err, res) => {
      if (err != null) return cb(err);
      else {this.setAdminToken(res);}
      this.authenticate((err, res) => {
        if (err) return cb(err);
        else return cb(null, res);
      });
    });
  });

  this.authenticate = (cb) => {
    if (!this.getUserKey() || !this.getAdminKey()) {return cb("Can't get keys", null)}
    if (auth !== undefined && auth !== null && auth !== "") {
      var splittedApi = auth.split(' ');
      if (splittedApi.length == 2) {
        var api_key = splittedApi[1];
        if (api_key == this.userToken.key) {
          res = "user";
        } else if (api_key == this.adminToken.key) {
          res = "admin";
        } else {
          err = "Wrong Api Key";
        }
      } else {
        err = "No Api Key";
      }
    } else {
      err = "No Api Key";
    }
    return cb(err, res);
  }

};
