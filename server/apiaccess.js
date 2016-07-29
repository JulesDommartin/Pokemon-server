'use strict';

const logger   = require('./logger');
const config   = require('./config');

module.exports.hasAccess = (api_key, cb) => {
  var err = null;
  var res = false;
  if (api_key !== undefined && api_key !== null && api_key !== "") {
    if (api_key == config.API_KEY) {
      res = true;
    } else {
      err = "Wrong Api Key";
    }
  } else {
    err = "No Api Key";
  }
  return cb(err, res);
};
