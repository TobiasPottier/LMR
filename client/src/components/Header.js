// src/components/Header.js
import React from 'react';
import './Header.css';
import logo from '../Assets/movieLogo.png';

function Header() {
  return (
    <header className="header">
      <img src={logo} alt="logo" className="logo" />
      <h1 style={{ marginLeft: '-110px' }}>Live Movie Recommendation</h1>
    </header>
  );
}

export default Header;