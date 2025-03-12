// src/pages/AddMovie.js
import React, { useEffect, useState } from 'react';
import './AddMovie.css';

function AddMovie() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await fetch('http://localhost:3001/movies/requestmovies', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ quantity: 100 })
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

  const handleWatch = async (tmdbId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:3001/users/watch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ tmdbId })
      });

      if (!response.ok) {
        throw new Error('Failed to add movie to watched list');
      }

      const data = await response.json();
      console.log(data.message);

      // Update state: mark this movie as a favorite
      setMovies(prevMovies =>
        prevMovies.map(movie =>
          movie.tmdbId === tmdbId ? { ...movie, user_favorite: true } : movie
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnwatch = async (tmdbId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:3001/users/unwatch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ tmdbId })
      });

      if (!response.ok) {
        throw new Error('Failed to remove movie from watched list');
      }

      const data = await response.json();
      console.log(data.message);

      // Update state: mark this movie as not a favorite
      setMovies(prevMovies =>
        prevMovies.map(movie =>
          movie.tmdbId === tmdbId ? { ...movie, user_favorite: false } : movie
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleFavorite = (tmdbId, currentFavorite) => {
    if (currentFavorite) {
      handleUnwatch(tmdbId);
    } else {
      handleWatch(tmdbId);
    }
  };

  return (
    <div className="addmovie-container">
      <h1>Available Movies</h1>
      {error && <p className="error">{error}</p>}
      <div className="movies-grid">
        {movies.map((movie) => (
          <div
            className={`movie-card ${movie.user_favorite ? '' : 'non-favorite'}`}
            key={movie.tmdbId}
            onClick={() => handleToggleFavorite(movie.tmdbId, movie.user_favorite)}
          >
            {movie.poster_path ? (
              <img src={movie.poster_path} alt={movie.title} className="movie-poster" />
            ) : (
              <div className="no-poster">No Poster Available</div>
            )}
            {movie.user_favorite && <span className="favorite-star">★</span>}
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