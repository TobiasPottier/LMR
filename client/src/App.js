import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Future routes can go here, e.g. <Route path="/login" element={<Login />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
