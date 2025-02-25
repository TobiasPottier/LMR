// Home.js
import React from 'react';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      {/* The skewed shape */}
      <div className="my-shape" style={{ top: '450px', left: '50%' , width: '50%'}}>
        <img
          src='https://wallpapercat.com/w/full/f/0/7/321887-3840x2160-desktop-4k-007-wallpaper-image.jpg'
          alt='Movie in Shape'
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      <div className="my-shape" style={{ top: '850px', left: '0%' , width: '50%'}}>
        <img
          src="https://gfx.videobuster.de/archive/v/c4oydelOF-zkg75ZeBNhbfwcz0lMkawtCUyRjA2JTJGaW1hmSUyRmpwZWclMkZmNWFiMGQ2ZmM1izZkYWTtqvQ5ZuxjvTAyZi5qcGcmcj1jd6wwMHiU7DA.jpg"
          alt="Movie in Shape"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      
      <div className="hero-content">
        <h1 className="hero-title">Live Movie Recommendation</h1>
        <p className="hero-subtitle">Discover your next favorite film.</p>
        <p className="hero-subtitle">All Personalized to your movie taste!</p>
      </div>
    </div>
  );
}

export default Home;