// src/pages/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      console.log('Backend response:', data);
      // After successful registration, login the user
      // Send the login request to the backend
      try {
        const response = await fetch('http://localhost:3001/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          throw new Error('Login failed');
        }

        const data = await response.json();
        localStorage.setItem('token', data.token); // store JWT
        navigate('/profile');
      } catch (err) {
        console.error('Error during login:', err);
        setError('Invalid credentials, please try again.');
      }
    } catch (err) {
      console.error('Error during registration:', err);
      setError('Registration failed, please try again.');
    }
  };

return (
    <div className="register-container">
        <h1>Register for MovieApp</h1>
        <p className="register-subtext">
        It looks like you’re new here;
        We’re excited to have you on board! 
        Fill in the details below to create your personalized movie journey.
        </p>
        <form onSubmit={handleSubmit} className="register-form">
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            {error && <p className="error">{error}</p>}
            <button type="submit">Register</button>
        </form>
    </div>
);
}

export default Register;