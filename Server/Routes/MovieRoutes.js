const express = require('express');
const router = express.Router();
const axios = require('axios');
const Movie = require('../Models/movie.js');

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

// New endpoint: Request a random sample of movies
router.post('/requestmovies', async (req, res) => {
  try {
    const { quantity } = req.body;
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be a positive number' });
    }

    // Use MongoDB aggregation with $sample to select random movies.
    // If quantity exceeds total count, MongoDB returns all movies.
    const movies = await Movie.aggregate([{ $sample: { size: quantity } }]);
    res.json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;