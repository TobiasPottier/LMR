import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [newBio, setNewBio] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
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
        setNewBio(data.bio || ''); // Initialize editable bio
      })
      .catch((err) => {
        console.error(err);
        setError('Error retrieving user information.');
      });
  }, []);

  const handleLogout = () => {
    // Remove token and redirect
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

    // Example PATCH request to update bio
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
    </div>
  );
}

export default Profile;