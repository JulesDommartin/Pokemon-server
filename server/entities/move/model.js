"use strict";

const mongoose     = require('mongoose');

const name = new mongoose.Schema({
	fr: {type: String, required: true},
	en: {type: String, required: true}
});

const fields = {
	id: 					{type: Number, required: true},
	generation: 	{type: Number, required: true},
	names: 				{type: name, required: true},
	pp: 					{type: Number},
	description: 	{type: String, required: true},
	accuracy: 		{type: Number, required: true},
	power: 				{type: Number, required: true},
	min_hits: 		{type: Number},
	max_hits: 		{type: Number},
	category: 		{type: String, required: true}
};

const schema = new mongoose.Schema(fields);

module.exports = function (mongoose) {
  return mongoose.model('move', schema);
};
