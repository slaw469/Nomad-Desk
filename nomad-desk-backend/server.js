// nomad-desk-backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('passport');

// Load env vars
dotenv.config();

// Initialize app
const app = express();

// CORS middleware with proper configuration
// Update this to allow requests from your actual frontend origin
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests from these origins
    const allowedOrigins = [
      'http://localhost:5173',  // Default Vite port
      'http://localhost:5185',  // Your current frontend port
      undefined,                // Allow requests with no origin (like mobile apps or curl)
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5185'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-auth-token', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Initialize Passport
app.use(passport.initialize());

// Configure Passport strategies
require('./config/passport')();

// Connect to database
require('./config/db');

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/auth', require('./routes/googleAuthRoutes')); // Add Google auth routes
app.use('/api/maps', require('./routes/mapsRoutes')); // Add Google Maps routes

// Basic route
app.get('/', (req, res) => {
  res.send('Nomad Desk API is running');
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});