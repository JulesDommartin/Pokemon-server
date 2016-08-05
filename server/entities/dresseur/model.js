"use strict";

const mongoose     = require('mongoose');

const pokemon_equipe = new mongoose.Schema({
  pokemon: {type: mongoose.Schema.Types.ObjectId, required: true},
  position: {type: Number, min: 1, max: 6, required: true}
});

const fields = {
  userId: {type: mongoose.Schema.Types.ObjectId, required: true},
  pseudo: {type: String, required: true},
  equipePokemons: {type: [pokemon_equipe], default: []}
};

const schema = new mongoose.Schema(fields);

module.exports = function (mongoose) {
  return mongoose.model('dresseur', schema);
};
