// Home.js
import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-container">
      {/* Hero title */}
      <div className="hero-content" style={{ marginTop: '80px' }}>
        <h1 className="hero-title">Where AI meets cinema</h1>
        <hr style={{ border: '1px solid white', width: '100%' }} />
      </div>
      {/* Skewed shape */}
      <div className="my-shape" style={{ top: '300px', left: '50%' , width: '50%'}}>
        <img
          src='https://wallpapercat.com/w/full/f/0/7/321887-3840x2160-desktop-4k-007-wallpaper-image.jpg'
          alt='Movie in Shape'
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      {/* Left column: Text */}
      <div style={{
        display: 'inline-block',
        verticalAlign: 'top',
        width: '40%',
        marginTop: '160px',
        marginLeft: '-50%'
      }}>
        <h2>Discover your next favorite film</h2>
        <p>Yep, you heard it here first. I, robot; will be able to give you, your next favorite film</p>
      </div>
      <div className="my-shape" style={{ top: '700px', left: '0%' , width: '50%'}}>
        <img
          src="https://gfx.videobuster.de/archive/v/c4oydelOF-zkg75ZeBNhbfwcz0lMkawtCUyRjA2JTJGaW1hmSUyRmpwZWclMkZmNWFiMGQ2ZmM1izZkYWTtqvQ5ZuxjvTAyZi5qcGcmcj1jd6wwMHiU7DA.jpg"
          alt="Movie in Shape"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      {/* Right column: Text */}
      <div style={{
        display: 'inline-block',
        verticalAlign: 'top',
        width: '40%',
        marginTop: '340px',
        marginLeft: '50%'
      }}>
        <h2>Artificial Intelligence personalized to your movie taste!</h2>
        <p>AI, designed to perfectly understand your taste in movies</p>
      </div>
      <div className="hero-content" style={{ marginTop: '150px' }}>
        <h1 className="hero-title">Don't miss out on your next favorite movie</h1>
        <hr style={{ border: '1px solid black', width: '100%' }} />
      </div>
      {/* Start Now button */}
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <Link to="/Startnow">
          <button style={{
            padding: '30px 100px',
            fontSize: '48px',
            backgroundColor: '#FF4500',
            color: 'white',
            border: 'none',
            borderRadius: '30px',
            cursor: 'pointer'
          }}>
            Start Now
          </button>
        </Link>
      </div>
      {/* Bottom Image */}
      <div className="bottom-image-container">
        <div className="my-shape" style={{ top: '1500px', left: '13%' , width: '75%'}}>
          <img
            src="https://static1.cbrimages.com/wordpress/wp-content/uploads/2018/07/Skyscraper-movie-poster-header.jpg"
            alt="Movie in Shape"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </div>
      {/* Footer */}
      <footer style={{ marginTop: '550px', textAlign: 'center', padding: '0px' }}>
        <p>&copy; 2025 BIAS Company. All rights reserved.</p>
        <p>
          <a href="/privacy-policy" style={{ color: 'orange', margin: '0 10px' }}>Privacy Policy</a> | 
          <a href="/terms-of-service" style={{ color: 'orange', margin: '0 10px' }}>Terms of Service</a> | 
          <a href="/contact-us" style={{ color: 'orange', margin: '0 10px' }}>Contact Us</a>
        </p>
      </footer>
    </div>
  );
}

export default Home;
