const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  tmdbId: { type: Number, unique: true },
  title:  { type: String, required: true },
  poster_path: { type: String },
  backdrop_path: { type: String },
  overview: { type: String },
  release_date: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);