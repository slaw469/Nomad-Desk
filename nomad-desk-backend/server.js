// nomad-desk-backend/server.js - FIXED VERSION
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('passport');

// Load env vars
dotenv.config();

// Initialize app
const app = express();

// CORS middleware with proper configuration
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

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`\n=== ${new Date().toISOString()} ===`);
  console.log(`${req.method} ${req.url}`);
  console.log('Headers:', {
    'content-type': req.headers['content-type'],
    'x-auth-token': req.headers['x-auth-token'] ? 'Present' : 'Missing',
    'origin': req.headers.origin
  });
  if (req.query && Object.keys(req.query).length > 0) {
    console.log('Query params:', req.query);
  }
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', req.body);
  }
  next();
});

// Initialize Passport
app.use(passport.initialize());

// Configure Passport strategies
require('./config/passport')();

// Connect to database
require('./config/db');

// Routes
console.log('Registering routes...');

app.use('/api/auth', require('./routes/authRoutes'));
console.log('✅ Auth routes registered');

app.use('/api/auth', require('./routes/googleAuthRoutes'));
console.log('✅ Google auth routes registered');

app.use('/api/profile', require('./routes/profileRoutes'));
console.log('✅ Profile routes registered');

app.use('/api/network', require('./routes/networkRoutes'));
console.log('✅ Network routes registered');

app.use('/api/bookings', require('./routes/bookingRoutes'));
console.log('✅ Booking routes registered');

app.use('/api/favorites', require('./routes/favoritesRoutes'));
console.log('✅ Favorites routes registered');

app.use('/api/maps', require('./routes/mapsRoutes'));
console.log('✅ Maps routes registered');

app.use('/api/placeholder', require('./routes/placeHolderRoutes'));
console.log('✅ Placeholder routes registered');

app.use('/api/public-maps', require('./routes/publicMapsRoutes'));
console.log('✅ Public maps routes registered');

// Basic route
app.get('/', (req, res) => {
  res.send('Nomad Desk API is running');
});

// Test route to verify server is working
app.get('/api/test', (req, res) => {
  console.log('Test route hit!');
  res.json({ 
    message: 'Server is working!', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('\n=== SERVER ERROR ===');
  console.error('URL:', req.url);
  console.error('Method:', req.method);
  console.error('Error:', error);
  console.error('Stack:', error.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  console.log(`\n❌ 404 - Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Available at: http://localhost:${PORT}`);
  console.log('\n📋 Available routes:');
  console.log('  GET  /api/test');
  console.log('  POST /api/auth/login');
  console.log('  POST /api/auth/register');
  console.log('  GET  /api/bookings/availability');
  console.log('  POST /api/bookings');
  console.log('  GET  /api/bookings/upcoming');
  console.log('  GET  /api/bookings/past');
  console.log('  GET  /api/favorites');
  console.log('  POST /api/favorites');
  console.log('  GET  /api/favorites/check/:workspaceId');
  console.log('\n👀 Watching for requests...\n');
});