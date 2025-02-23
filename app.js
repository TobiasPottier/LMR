require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./Routes/UserRoutes');

const app = express();

// 1. Env vars
const PORT = process.env.PORT || 1234;
const MONGO_URI = process.env.MONGO_URI;

// 2. Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.error('MongoDB connection error:', err));

// 3. Middleware
app.use(express.json());

// 4. Health Check
app.get('/', (req, res) => {
  res.send('API is running...');
});

// 5. Mount the user routes
app.use('/users', userRoutes);

// 6. Start Server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});