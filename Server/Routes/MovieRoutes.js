const express = require('express');
const router = express.Router();
const axios = require('axios');
const jwt = require('jsonwebtoken');
const Movie = require('../Models/movie.js');
const User = require('../Models/user.js');

// Search a movie
router.post('/search', async (req, res) => {
  try {
    const { search } = req.body;
    if (!search) {
      return res.status(400).json({ error: 'Search term is required' });
    }

    // Fetch from TMDB
    const apiKey = process.env.TMDB_API_KEY;
    const tmdbUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(search)}`;
    const response = await axios.get(tmdbUrl);
    
    // Transform TMDB results to minimal fields
    const movies = response.data.results.map(movie => ({
      tmdbId: movie.id,
      title: movie.title,
      posterPath: movie.poster_path 
      ? 'https://image.tmdb.org/t/p/w500' + movie.poster_path
      : null
    }));

    res.json(movies);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Request movies by quantity sorted by popularity, with user_favorite flag
router.post('/requestmovies', async (req, res) => {
  try {
    // Check for the JWT in the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Invalid token format' });
    }

    // Verify token and extract userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Retrieve user data (including watchedMovies)
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Extract tmdbIds from user's watchedMovies array
    const watchedTmdbIds = user.watchedMovies.map(m => m.tmdbId);

    // Validate quantity input from request body
    const { quantity } = req.body;
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be a positive number' });
    }

    // Query for movies sorted by popularity (descending) limited to the requested quantity
    const movies = await Movie.find({})
                              .sort({ popularity: -1 })
                              .limit(quantity);

    // For each movie, add a user_favorite flag (true if movie is in watchedMovies)
    const moviesWithFavorite = movies.map(movie => {
      const movieObj = movie.toObject();
      movieObj.user_favorite = watchedTmdbIds.includes(movieObj.tmdbId);
      return movieObj;
    });

    res.json(moviesWithFavorite);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;