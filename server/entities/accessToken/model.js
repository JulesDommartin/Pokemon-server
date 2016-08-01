"use strict";

const mongoose     = require('mongoose');

const fields = {
	userId: {type: mongoose.Schema.Types.ObjectId, required: true},
  role: {type: String, required: true},
  key: {type: String, required: true}
};

const schema = new mongoose.Schema(fields);

module.exports = function (mongoose) {
  return mongoose.model('accessToken', schema);
};
