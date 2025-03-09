import React from 'react';
import Home from './Pages/Home';
import Startnow from './Pages/Startnow';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Profile from './Pages/Profile';
import AddMovie from './Pages/AddMovie';
import Header from './Components/Header';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Startnow" element={<Startnow />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/AddMovie" element={<AddMovie />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;