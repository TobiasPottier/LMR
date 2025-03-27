const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: [true, 'Username is required'], 
    unique: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username must be at most 30 characters long']
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true,
    match: [/\S+@\S+\.\S+/, 'Email is not valid']
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  watchedMovies: [
    {
      tmdbId: { type: Number },
      title: { type: String },
      poster_path: { type: String },
      release_date: { type: String }
    }
  ],
  bio: {
    type: String,
    default: '',
    maxlength: [500, 'Bio must be at most 500 characters long']
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('User', userSchema);