import React from 'react';
import Home from './Home';
import Header from './components/Header';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div>
        <Header />
        {/* Add other components like SearchBar or MovieCards here */}
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Future routes can go here, e.g. <Route path="/login" element={<Login />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;