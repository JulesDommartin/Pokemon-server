"use strict";

const mongoose     = require('mongoose');
const _            = require('underscore');

const learnable_move = new mongoose.Schema({
  name: {type: String, required: true},
  level_learned_at: {type: Number, required: true}
});

const sprites_schema = new mongoose.Schema({
  front: {type: String, required: true},
  back: {type: String, required: true},
  front_shiny: {type: String, required: true},
  back_shiny: {type: String, required: true}
});

const base_stat = new mongoose.Schema({
  name: {type: String, required: true},
  base_stat: {type: Number, required: true}
});

const fields       = {
  id: {type: Number, min: 1, max: 151, required: true},
  name: {type: String, required: true},
  weight: {type: Number, required: true},
  height: {type: Number, required: true},
  base_experience: {type: Number, required: true},
  moves: [learnable_move],
  sprites: sprites_schema,
  stats: [base_stat]
};

const schema = new mongoose.Schema(fields);

module.exports = function (mongoose) {
  return mongoose.model('pokemon', schema);
};
