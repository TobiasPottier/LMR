// src/pages/Home.js (example location)
import React from 'react';
import './Home.css';

// Example images – replace with your own file paths or imported assets
// import heroImage1 from '../assets/hero1.jpg';
// import heroImage2 from '../assets/hero2.jpg';

function Home() {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-content">
        <h1 className="hero-title">Live Movie Recommendation</h1>
        <p className="hero-subtitle">Discover your next favorite film.</p>
        <p className="hero-subtitle">All Personalized to your movie taste!</p>
      </div>

      {/* Example Image Row */}
      <div className="image-row">
        {/* For demonstration, using placeholder image URLs.
            Replace with your actual images or import statements. */}
        <img
          src="https://image.tmdb.org/t/p/w500/ueUAIuI5TH9LPA8NpJCOjlopz57.jpg"
          alt="Movie 1"
          className="hero-image"
        />
        <img
          src="https://image.tmdb.org/t/p/w500/kW9LmvYHAaS9iA0tHmZVq8hQYoq.jpg"
          alt="Movie 2"
          className="hero-image"
        />
      </div>
    </div>
  );
}

export default Home;