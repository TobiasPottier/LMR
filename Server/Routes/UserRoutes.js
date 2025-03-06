const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Models/user.js');
const Movie = require('../Models/movie.js');
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

// Get user profile
router.get('/me', async (req, res) => {
  try {
    // 1. Check for Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // 2. Extract token (format "Bearer <token>")
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Invalid token format' });
    }

    // 3. Verify/Decode
    const decoded = jwt.verify(token, JWT_SECRET); 
    // decoded will contain { userId, email, iat, ... }

    // 4. Find the user in DB
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // 5. Return user data
    res.json(user);

  } catch (err) {
    console.error(err);
    return res.status(401).json({ error: 'Token is invalid or expired' });
  }
});

// PATCH /me (Update user data)
router.patch('/me', async (req, res) => {
  try {
    // 1. Check for Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // 2. Extract token (format "Bearer <token>")
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Invalid token format' });
    }

    // 3. Verify/Decode
    const decoded = jwt.verify(token, JWT_SECRET);
    // decoded will contain { userId, email, iat, ... }

    // 4. Find the user in DB
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // 5. Update the user fields from the request body
    //    Only update fields you specifically allow, e.g. bio:
    if (req.body.bio !== undefined) {
      user.bio = req.body.bio;
    }

    // 6. Save updated user
    await user.save();

    // 7. Return the updated user
    //    (You might exclude password or other sensitive fields)
    res.status(200).json(user);

  } catch (err) {
    console.error(err);
    return res.status(401).json({ error: 'Token is invalid or expired' });
  }
});

router.post('/watch', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    const { tmdbId } = req.body;
    if (!tmdbId) return res.status(400).json({ error: 'tmdbId is required' });

    const movie = await Movie.findOne({ tmdbId });
    if (!movie) return res.status(404).json({ error: 'Movie not found' });

    const movieData = {
      tmdbId: movie.tmdbId,
      title: movie.title,
      poster_path: movie.poster_path,
      release_date: movie.release_date
    };

    // 1) Fetch the user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // 2) Check for duplicates
    const alreadyWatched = user.watchedMovies.some(m => m.tmdbId === movieData.tmdbId);
    if (alreadyWatched) {
      return res.status(400).json({ error: 'Movie already in watched list' });
    }

    // 3) Push the movie data
    user.watchedMovies.push(movieData);
    await user.save();

    return res.status(200).json({ message: 'Movie added to watched list', user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
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