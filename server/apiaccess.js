'use strict';

const logger   = require('./logger');
const config   = require('./config');

module.exports.hasAccess = (auth, cb) => {
  var err = null;
  var res = false;
  if (auth !== undefined && auth !== null && auth !== "") {
    var splittedApi = auth.split(' ');
    if (splittedApi.length == 2) {
      var api_key = splittedApi[1];
      if (api_key == config.API_KEY) {
        res = true;
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
};
