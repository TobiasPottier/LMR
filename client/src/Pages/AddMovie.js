// src/pages/AddMovie.js
import React, { useEffect, useState } from 'react';
import './AddMovie.css';

function AddMovie() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('http://localhost:3001/movies/requestmovies', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ quantity: 40 })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch movies');
        }

        const data = await response.json();
        setMovies(data);
      } catch (err) {
        console.error(err);
        setError('Error fetching movies');
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="addmovie-container">
      <h1>Available Movies</h1>
      {error && <p className="error">{error}</p>}
      <div className="movies-grid">
        {movies.map((movie) => (
          <div className="movie-card" key={movie.tmdbId}>
            {movie.poster_path ? (
              <img src={movie.poster_path} alt={movie.title} className="movie-poster" />
            ) : (
              <div className="no-poster">No Poster Available</div>
            )}
            <div className="movie-info">
              <h3 className="movie-title">{movie.title}</h3>
              <p className="movie-date">{movie.release_date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AddMovie;