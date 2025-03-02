// src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      console.log('Backend response:', data);
      // On successful login, redirect to your desired page (e.g., dashboard)
      navigate('/dashboard'); // change this as needed
    } catch (err) {
      console.error('Error during login:', err);
      setError('Invalid credentials, please try again.');
    }
  };

return (
    <div className="login-container">
        <h1>Welcome Back!</h1>
        <p>Login using your email and password</p>
        <form onSubmit={handleSubmit} className="login-form">
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
            <button type="submit">Login</button>
        </form>
    </div>
);
}

export default Login;