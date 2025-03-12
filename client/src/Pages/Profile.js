import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [newBio, setNewBio] = useState('');

  // Ref for horizontal scrolling
  const rowRef = useRef(null);

  // Scroll handlers
  const scrollLeft = () => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    // console.log('token');
    // console.log(token);
    // console.log('token');
    if (!token) {
      setError('No token found. Please log in.');
      return;
    }

    // Fetch user data
    fetch('http://localhost:3001/users/me', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch user data');
        }
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setNewBio(data.bio || '');
      })
      .catch((err) => {
        console.error(err);
        setError('Error retrieving user information.');
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/startnow');
  };

  const handleEditBio = () => {
    setIsEditingBio(true);
  };

  const handleBioChange = (e) => {
    setNewBio(e.target.value);
  };

  const handleSaveBio = () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch('http://localhost:3001/users/me', {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ bio: newBio })
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to update bio');
        }
        return res.json();
      })
      .then((updatedData) => {
        setUser({ ...user, bio: updatedData.bio });
        setIsEditingBio(false);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  if (error) {
    return (
      <div className="profile-container">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-container">
        <p className="loading-message">Loading...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <img
            className="profile-picture"
            src={
              user.profilePicture ||
              'https://n-lightenment.com/wp-content/uploads/2015/10/movie-night11.jpg'
            }
            alt="Profile"
          />
          <h1 className="profile-name">{user.username || 'No Username'}</h1>
        </div>

        <div className="profile-details">
          <p>
            <strong>Email:</strong> {user.email || 'No Email'}
          </p>
          {isEditingBio ? (
            <div className="bio-edit-area">
              <textarea
                className="bio-textarea"
                value={newBio}
                onChange={handleBioChange}
              />
              <button className="save-bio-button" onClick={handleSaveBio}>
                Save
              </button>
            </div>
          ) : (
            <p>
              <strong>Bio:</strong> {user.bio || 'This user has no bio yet.'}
              <span className="edit-icon" onClick={handleEditBio}>
                ✎
              </span>
            </p>
          )}
        </div>

        <button className="logout-button" onClick={handleLogout}>
          Log Out
        </button>
      </div>

      {/* Watched Movies Row */}
      {user.watchedMovies && user.watchedMovies.length > 0 && (
        <div className="watched-movies-container">
          {/* Header row: Title + "Add Movie" button */}
          <div className="watched-movies-header">
            <h2>Favorite Movies</h2>
            <button className="add-movie-button" onClick={() => navigate('/addmovie')}>
              + Add Movie
            </button>
          </div>

          <div className="watched-movies-row-container">
            <button className="scroll-button left" onClick={scrollLeft}>
              &larr;
            </button>
            <div className="watched-movies-row" ref={rowRef}>
              {user.watchedMovies.map((movie) => (
                <div className="movie-card" key={movie.tmdbId}>
                  <img
                    src={movie.poster_path}
                    alt={movie.title}
                    className="movie-poster"
                  />
                  <p className="movie-title">{movie.title}</p>
                  <p className="movie-date">{movie.release_date}</p>
                </div>
              ))}
            </div>
            <button className="scroll-button right" onClick={scrollRight}>
              &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;