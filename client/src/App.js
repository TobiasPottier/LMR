import React from 'react';
import Home from './Pages/Home';
import Startnow from './Pages/Startnow';
import Header from './Components/Header';
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
          <Route path="/Startnow" element={<Startnow />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;