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

// Function to fetch and save movies (only non-adult movies)
async function fetchMovies() {
  try {
    // Fetch first page to determine total pages
    const firstResponse = await axios.get(TMDB_API_URL, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'en-US',
        page: 1,
      }
    });
    
    // const totalPages = firstResponse.data.total_pages;
    const totalPages = 100; // or use firstResponse.data.total_pages if desired
    console.log(`Total pages to fetch: ${totalPages}`);

    // Loop through all pages
    for (let page = 1; page <= totalPages; page++) {
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
        // Only process movies that are not adult
        if (movie.adult) continue;
        
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
          popularity: movie.popularity,
          vote_average: movie.vote_average,
          vote_count: movie.vote_count
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