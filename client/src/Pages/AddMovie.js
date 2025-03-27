import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddMovie.css';

function AddMovie() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Fetch movies on mount or when sort changes
  const fetchMovies = async () => {
    try {
      setLoading(true);
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
        body: JSON.stringify({ quantity: 100, sortBy })
      });
      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }
      const data = await response.json();
      setMovies(data);
    } catch (err) {
      console.error(err);
      setError('Error fetching movies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [sortBy]);

  // Search function to call /search endpoint
  const handleSearch = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }
      // Make sure there's something to search
      if (!searchTerm.trim()) {
        return;
      }
      const response = await fetch('http://localhost:3001/movies/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ search: searchTerm })
      });
      if (!response.ok) {
        throw new Error('Failed to search');
      }
      const data = await response.json();
      // data is an array of { tmdbId, title, posterPath }
      const mapped = data.map(movie => ({
        tmdbId: movie.tmdbId,
        title: movie.title,
        poster_path: movie.posterPath,
        user_favorite: false,
      }));
      setSearchResults(mapped);
    } catch (err) {
      console.error(err);
    }
  };

  // Clear search function
  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
  };

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
      await response.json();

      setMovies(prev =>
        prev.map(movie =>
          movie.tmdbId === tmdbId ? { ...movie, user_favorite: true } : movie
        )
      );
      setSearchResults(prev =>
        prev.map(movie =>
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
      await response.json();

      setMovies(prev =>
        prev.map(movie =>
          movie.tmdbId === tmdbId ? { ...movie, user_favorite: false } : movie
        )
      );
      setSearchResults(prev =>
        prev.map(movie =>
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

  const handleBack = () => {
    navigate('/profile');
  };

  return (
    <div className="addmovie-container">
      <button className="back-button" onClick={handleBack}>
        ←
      </button>
      <h1>Available Movies</h1>

      {/* Sort Buttons */}
      <div className="sort-buttons">
        <button
          className={`sort-button ${sortBy === 'popularity' ? 'active' : ''}`}
          onClick={() => setSortBy('popularity')}
        >
          Popularity
        </button>
        <button
          className={`sort-button ${sortBy === 'score' ? 'active' : ''}`}
          onClick={() => setSortBy('score')}
        >
          Score
        </button>
      </div>

      {/* Search field */}
      <div className="search-container">
        <input
          type="text"
          value={searchTerm}
          placeholder="Search for a movie..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
        <button onClick={handleClearSearch}>Clear</button>
      </div>

      {/* Potential error message */}
      {error && <p className="error">{error}</p>}
      {loading && <p className="loading">Loading movies...</p>}

      {/* If there's a search term, show search results, else show default */}
      {searchTerm.trim().length > 0 && searchResults.length > 0 ? (
        <div className="movies-grid">
          {searchResults.map((movie) => (
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
              </div>
            </div>
          ))}
        </div>
      ) : (
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
              <div className="vote-average-container">
                <span className="vote-star">★</span>
                <span className="vote-value">{movie.vote_average}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AddMovie;