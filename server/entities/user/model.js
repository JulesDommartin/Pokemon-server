"use strict";

const mongoose     = require('mongoose');

const fields = {
  email: {type: String, required: true},
  firstName: {type: String},
  lastName: {type: String},
  pseudo: {type: String, required: true},
  password: {type: String, required: true},
  role: {type: String, required: true, default: "user"}
};

const schema = new mongoose.Schema(fields);

module.exports = function (mongoose) {
  return mongoose.model('user', schema);
};
