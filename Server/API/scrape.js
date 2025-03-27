require('dotenv').config();
const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');
const mongoose = require('mongoose');
const Movie = require('../Models/Movie');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

const TMDB_API_KEY = process.env.TMDB_API_KEY;

// Path to your link.csv file
const LINK_CSV_PATH = './API/link.csv';

// We'll collect tmdbIds from link.csv, then fetch each movie
async function fetchMoviesFromLinks() {
  const tmdbIds = [];

  // 1) Read link.csv and push the tmdbId for each row into an array
  fs.createReadStream(LINK_CSV_PATH)
    .pipe(csv())  // parses CSV rows into JS objects
    .on('data', (row) => {
      // row format: { movieId, imdbId, tmdbId }
      // Some rows might have empty tmdbId;
      const id = row.tmdbId ? row.tmdbId.trim() : null;
      if (id) {
        // Convert to number if your tmdbId is numeric
        tmdbIds.push(Number(id));
      }
    })
    .on('end', async () => {
      console.log(`Read ${tmdbIds.length} tmdbIds from link.csv`);
      
      // 2) For each tmdbId, call the TMDB API and insert/update in MongoDB
      for (const id of tmdbIds) {
        try {
          const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US`;
          const response = await axios.get(url);
          const movie = response.data;

          // Filters, e.g. skip adult or missing poster/backdrop
          if (movie.adult) {
            continue;
          }
          if (!movie.poster_path || !movie.backdrop_path) {
            continue;
          }

          // Build the data object for MongoDB
          const movieData = {
            tmdbId: movie.id,
            title: movie.title,
            backdrop_path: `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`,
            overview: movie.overview,
            release_date: movie.release_date,
            poster_path: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
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
          console.log(`Saved movie: ${movie.title}`);

        } catch (err) {
          console.error(`Error fetching movie with tmdbId=${id}:`, err.message);
        }
      }

      console.log("Done scraping all TMDb IDs from link.csv!");
      mongoose.connection.close();
    });
}

fetchMoviesFromLinks();