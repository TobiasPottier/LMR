const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

async function fetchPopularMovies() {
  try {
    const res = await axios.get(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`);
    console.log('Popular Movies:', res.data.results);
  } catch (error) {
    console.error('TMDB fetch error:', error);
  }
}

fetchPopularMovies();