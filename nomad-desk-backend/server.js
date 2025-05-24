// nomad-desk-backend/server.js - UPDATED WITH NOTIFICATIONS & WEBSOCKET
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('passport');
const http = require('http');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');

// Load env vars
dotenv.config();

// Initialize app
const app = express();
const server = http.createServer(app);

// Initialize Socket.io with CORS
const io = socketIo(server, {
  cors: {
    origin: function(origin, callback) {
      const allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:5185',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5185'
      ];
      
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Make io globally accessible
global.io = io;
global.userSockets = new Map(); // Map of userId to socketId

// Socket.io authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.query.token;
  
  if (!token) {
    return next(new Error('Authentication error: Token required'));
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.user.id;
    next();
  } catch (err) {
    next(new Error('Authentication error: Invalid token'));
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`User ${socket.userId} connected via WebSocket`);
  
  // Store the socket ID for this user
  global.userSockets.set(socket.userId, socket.id);
  
  // Join user-specific room
  socket.join(`user-${socket.userId}`);
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User ${socket.userId} disconnected from WebSocket`);
    global.userSockets.delete(socket.userId);
  });
  
  // Handle notification read events
  socket.on('notification:read', async (notificationId) => {
    try {
      // Update notification in database (if needed)
      console.log(`Notification ${notificationId} marked as read by user ${socket.userId}`);
    } catch (error) {
      console.error('Error handling notification read:', error);
    }
  });
});

// CORS middleware with proper configuration
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5185',
      undefined,
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
  if (req.body && Object.keys(req.body).length > 0 && req.url !== '/api/auth/login') {
    console.log('Body:', { ...req.body, password: req.body.password ? '[HIDDEN]' : undefined });
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

app.use('/api/notifications', require('./routes/notificationRoutes'));
console.log('✅ Notifications routes registered');

// WebSocket endpoint for notifications
app.get('/api/notifications/stream', (req, res) => {
  res.status(426).json({ 
    message: 'Please use WebSocket connection for real-time notifications',
    wsUrl: `ws://localhost:${PORT}/socket.io/?token=YOUR_TOKEN`
  });
});

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
    env: process.env.NODE_ENV || 'development',
    websocket: io ? 'enabled' : 'disabled'
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

// Start server (use server.listen instead of app.listen for Socket.io)
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Available at: http://localhost:${PORT}`);
  console.log(`WebSocket available at: ws://localhost:${PORT}`);
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
  console.log('  GET  /api/notifications');
  console.log('  GET  /api/notifications/stats');
  console.log('  PUT  /api/notifications/:id/read');
  console.log('  PUT  /api/notifications/mark-all-read');
  console.log('  WS   /socket.io (WebSocket for real-time notifications)');
  console.log('\n👀 Watching for requests...\n');
});

// Notification helper functions to create notifications when events occur
const { createBookingNotification, createConnectionNotification } = require('./utils/notificationHelpers');

// Export server for testing
module.exports = { app, server };