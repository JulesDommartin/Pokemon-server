"use strict";

const mongoose     = require('mongoose');

const stat = new mongoose.Schema({
  name: {type: String, required: true},
  value: {type: Number, required: true}
});

const fields = {
	id: {type: Number, required: true},
	userId: {type: mongoose.Schema.Types.ObjectId, required: true},
	level: {type: Number, min: 1, max: 100, required: true},
	stats: {type: [stat], required: true},
	hp: {type: Number, required: true}
};

const schema = new mongoose.Schema(fields);

module.exports = function (mongoose) {
  return mongoose.model('pokemonDresseur', schema);
};
