const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  tmdbId: { type: Number, unique: true },
  title:  { type: String, required: true },
  genreIds: [Number],
  overview: String,
  releaseDate: Date,
  backdropPath: String,
  posterPath: String,
  popularity: Number,
  voteAverage: Number,
  voteCount: Number
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);