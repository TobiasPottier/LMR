import React, { useState } from 'react';
import './Startnow.css';


function StartNow() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  // Simple regex to validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (e) => {
    const value = e.target.value;
    console.log('Button pressed'); // Log to check if the button is working
    setEmail(value);
    if (!emailRegex.test(value)) {
      setError('Please enter a valid email.');
    } else {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Button pressed'); // Log to check if the button is working

    if (!email || error) return;

    console.log('Form submitted with email:', email);

    // Send the email to the backend endpoint
    try {
      const response = await fetch('http://localhost:3001/users/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Network response was not ok');
      }
      else {
        const data = await response.json();
        console.log('Email status:', data);
        if (data.email_exists) {
          window.location.href = '/Login';
        } else {
          window.location.href = '/Register';
        }
      }
    } catch (err) {
      console.error('Error sending email:', err);
      setError('Something went wrong on our end. Please try again later.');
    }
  };

  return (
    <div className="startnow-container">
      <h1>Get Started with MovieApp</h1>
      <p>Enter your email to begin your journey</p>
      <form className="email-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          className="email-input"
          value={email}
          onChange={handleChange}
          required
        />
        {error && <span className="error">{error}</span>}
        <button type="submit" className="submit-button" disabled={!email || error}>
          Continue
        </button>
      </form>
    </div>
  );
}

export default StartNow;