const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  tmdbId: { type: Number, unique: true },
  title: { type: String, required: true },
  poster_path: { type: String },
  backdrop_path: { type: String },
  overview: { type: String },
  release_date: { type: String },
  popularity: { type: Number },
  vote_average: { type: Number },
  vote_count: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);