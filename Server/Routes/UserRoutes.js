const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Models/user.js');
const JWT_SECRET = process.env.JWT_SECRET;

// Create a new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = await User.create({ username, email, password });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    // Compare given password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
    );
    // { expiresIn: '1h' }

    res.json({ token, msg: 'Login successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to check if user email exists in database
router.post('/email', async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ email_exists: false });
    }

    res.status(200).json({ email_exists: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;