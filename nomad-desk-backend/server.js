// nomad-desk-backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Initialize app
const app = express();

// CORS middleware with proper configuration
app.use(cors({
  origin: 'http://localhost:5173', // Vite's default port - change if needed
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'x-auth-token'],
  credentials: true // If you need to send cookies
}));

app.use(express.json());

// Connect to database
require('./config/db');

// Routes
app.use('/api/auth', require('./routes/authRoutes'));

// Basic route
app.get('/', (req, res) => {
  res.send('Nomad Desk API is running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});