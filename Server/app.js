require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./Routes/UserRoutes');
const movieRoutes = require('./Routes/MovieRoutes');

const app = express();

// Env vars
const PORT = process.env.PORT || 1234;
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.json());

// Health Check
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Mount the user routes
app.use('/users', userRoutes);

// Mount the movie routes
app.use('/movies', movieRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});