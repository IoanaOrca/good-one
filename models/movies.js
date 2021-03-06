'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const movieSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  }
});

const movie = mongoose.model('Movie', movieSchema);

module.exports = movie;
