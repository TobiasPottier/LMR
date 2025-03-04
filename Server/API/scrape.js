require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');
const Movie = require('../Models/Movie'); // Ensure your Movie model is correctly referenced

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("MongoDB connection error:", err));

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_API_URL = 'https://api.themoviedb.org/3/movie/popular';
const MAX_PAGES = 5; // Adjust the number of pages to scrape more movies

// Function to fetch and save movies
async function fetchMovies() {
  try {
    for (let page = 1; page <= MAX_PAGES; page++) {
      console.log(`Fetching page ${page}...`);
      
      const response = await axios.get(TMDB_API_URL, {
        params: {
          api_key: TMDB_API_KEY,
          language: 'en-US',
          page: page,
        }
      });

      const movies = response.data.results;

      for (const movie of movies) {
        const movieData = {
          tmdbId: movie.id,
          title: movie.title,
          backdrop_path: movie.backdrop_path
            ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
            : null,
          overview: movie.overview,
          release_date: movie.release_date,
          poster_path: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : null,
        };

        // Insert or update movie in the database
        await Movie.findOneAndUpdate(
          { tmdbId: movieData.tmdbId },
          movieData,
          { upsert: true, new: true }
        );
        console.log(`Saved: ${movie.title}`);
      }
    }

    console.log("Scraping completed!");

  } catch (error) {
    console.error("Error fetching data:", error.message);
  } finally {
    mongoose.connection.close();
  }
}

// Run the function
fetchMovies();