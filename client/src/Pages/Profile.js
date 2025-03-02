// src/pages/Profile.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please log in.');
      return;
    }

    // Fetch user data using the /users/me endpoint
    fetch('http://localhost:3001/users/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
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
      })
      .catch((err) => {
        console.error(err);
        setError('Error retrieving user information.');
      });
  }, []);

  const handleLogout = () => {
    // Remove the token and redirect to /startnow
    localStorage.removeItem('token');
    navigate('/startnow');
  };

  if (error) {
    return <div className="profile-container">{error}</div>;
  }

  if (!user) {
    return <div className="profile-container">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <h1>Welcome, {user.username}!</h1>
      <p>Email: {user.email}</p>
      {/* Additional user details can go here */}
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
}

export default Profile;