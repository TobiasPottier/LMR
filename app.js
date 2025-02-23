require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();

// 1. Read environment variables
const PORT = process.env.PORT || 1234;
const MONGO_URI = process.env.MONGO_URI;

// 2. Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB connected successfully');
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});

// 3. Express Middleware
app.use(express.json());  // Parse JSON bodies

// 4. Basic Route (Health Check)
app.get('/', (req, res) => {
  res.send('API is running...');
});

// 5. Start the Server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});