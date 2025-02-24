const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  tmdbId: { type: Number, unique: true },
  title:  { type: String, required: true },
  posterPath: String
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);