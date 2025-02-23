const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title:  { type: String, required: true },
  genres: [String],
  year:   Number
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);