const express = require('express');
const router = express.Router();
const axios = require('axios');

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

module.exports = router;