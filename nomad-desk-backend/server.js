// nomad-desk-backend/server.js - FIXED VERSION WITH ALL BUGS RESOLVED
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('passport');
const http = require('http');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const { exec } = require('child_process');
const util = require('util');

// Load env vars
dotenv.config();

// Convert exec to promise
const execAsync = util.promisify(exec);

// Function to kill process on port
const killPortProcess = async (port) => {
  try {
    console.log(`🔍 Checking for processes on port ${port}...`);
    
    // For macOS/Linux
    if (process.platform !== 'win32') {
      try {
        const { stdout } = await execAsync(`lsof -ti:${port}`);
        if (stdout.trim()) {
          const pids = stdout.trim().split('\n').filter(pid => pid.trim());
          for (const pid of pids) {
            if (pid.trim()) {
              console.log(`💀 Killing process ${pid.trim()} on port ${port}...`);
              await execAsync(`kill -9 ${pid.trim()}`);
            }
          }
          console.log(`✅ Successfully killed process(es) on port ${port}`);
          // Wait a moment for the port to be freed
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        // No process found on port, which is good
        console.log(`✅ Port ${port} is available`);
      }
    } else {
      // For Windows
      try {
        const { stdout } = await execAsync(`netstat -ano | findstr :${port}`);
        if (stdout.trim()) {
          const lines = stdout.trim().split('\n');
          for (const line of lines) {
            const match = line.match(/\s+(\d+)$/);
            if (match && match[1]) {
              const pid = match[1];
              console.log(`💀 Killing process ${pid} on port ${port}...`);
              await execAsync(`taskkill /PID ${pid} /F`);
            }
          }
          console.log(`✅ Successfully killed process(es) on port ${port}`);
          // Wait a moment for the port to be freed
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        // No process found on port, which is good
        console.log(`✅ Port ${port} is available`);
      }
    }
  } catch (error) {
    console.log(`ℹ️  No process found on port ${port} or unable to kill: ${error.message}`);
  }
};

// Get port from environment or use default
const PORT = process.env.PORT || 5003;

// Initialize app
const app = express();
const server = http.createServer(app);

// Initialize Socket.io with CORS - FIXED: More robust CORS handling
const io = socketIo(server, {
  cors: {
    origin: function(origin, callback) {
      // In development, allow any localhost port + undefined for same-origin
      if (!origin || 
          origin.match(/^http:\/\/(localhost|127\.0\.0\.1):\d+$/) ||
          origin.match(/^https:\/\/(localhost|127\.0\.0\.1):\d+$/)) {
        callback(null, true);
      } else {
        console.log('WebSocket blocked by CORS:', origin);
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

// Socket.io authentication middleware - FIXED: Better error handling
io.use((socket, next) => {
  const token = socket.handshake.query.token || socket.handshake.auth.token;
  
  if (!token) {
    return next(new Error('Authentication error: Token required'));
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.user.id;
    next();
  } catch (err) {
    console.error('WebSocket auth error:', err.message);
    next(new Error('Authentication error: Invalid token'));
  }
});

// Socket.io connection handling - FIXED: Better error handling
io.on('connection', (socket) => {
  console.log(`User ${socket.userId} connected via WebSocket`);
  
  // Store the socket ID for this user
  global.userSockets.set(socket.userId, socket.id);
  
  // Join user-specific room
  socket.join(`user-${socket.userId}`);
  
  // Handle disconnection
  socket.on('disconnect', (reason) => {
    console.log(`User ${socket.userId} disconnected from WebSocket: ${reason}`);
    global.userSockets.delete(socket.userId);
  });
  
  // Handle connection errors
  socket.on('error', (error) => {
    console.error(`WebSocket error for user ${socket.userId}:`, error);
  });
  
  // Handle notification read events
  socket.on('notification:read', async (notificationId) => {
    try {
      console.log(`Notification ${notificationId} marked as read by user ${socket.userId}`);
    } catch (error) {
      console.error('Error handling notification read:', error);
    }
  });
});

try {
  app.use('/api/settings', require('./routes/settingsRoutes'));
  console.log('✅ Settings routes registered');
} catch (error) {
  console.error('❌ Error loading settings routes:', error.message);
  // Continue without settings routes for now
  console.log('⚠️  Settings will use existing profile endpoints');
}

// Handle Socket.io errors
io.on('error', (error) => {
  console.error('Socket.io server error:', error);
});

// CORS middleware with proper configuration - FIXED: More robust pattern matching
app.use(cors({
  origin: function(origin, callback) {
    // In development, allow any localhost/127.0.0.1 port + undefined for same-origin
    if (!origin || 
        /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
      callback(null, true);
    } else {
      console.log('HTTP blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-auth-token', 'Authorization'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Add request logging middleware - FIXED: Better formatting
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`\n=== ${timestamp} ===`);
  console.log(`${req.method} ${req.url}`);
  console.log('Origin:', req.headers.origin || 'None');
  console.log('Headers:', {
    'content-type': req.headers['content-type'] || 'None',
    'x-auth-token': req.headers['x-auth-token'] ? 'Present' : 'Missing',
    'user-agent': req.headers['user-agent'] ? 'Present' : 'Missing'
  });
  
  if (req.query && Object.keys(req.query).length > 0) {
    console.log('Query params:', req.query);
  }
  
  if (req.body && Object.keys(req.body).length > 0 && 
      !req.url.includes('/auth/login') && !req.url.includes('/auth/register')) {
    console.log('Body:', req.body);
  } else if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', { 
      ...req.body, 
      password: req.body.password ? '[HIDDEN]' : undefined 
    });
  }
  
  next();
});

// Initialize Passport
app.use(passport.initialize());

// Configure Passport strategies
require('./config/passport')();

// Connect to database
require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const googleAuthRoutes = require('./routes/googleAuthRoutes');
const profileRoutes = require('./routes/profileRoutes');
const networkRoutes = require('./routes/networkRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const favoritesRoutes = require('./routes/favoritesRoutes');
const mapsRoutes = require('./routes/mapsRoutes');
const placeholderRoutes = require('./routes/placeholderRoutes');
const publicMapsRoutes = require('./routes/publicMapsRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

// Routes registration - FIXED: Better error handling for route loading
console.log('Registering routes...');

try {
  app.use('/api/auth', authRoutes);
  console.log('✅ Auth routes registered');

  app.use('/api/auth', googleAuthRoutes);
  console.log('✅ Google auth routes registered');

  app.use('/api/profile', profileRoutes);
  console.log('✅ Profile routes registered');

  app.use('/api/network', networkRoutes);
  console.log('✅ Network routes registered');

  app.use('/api/bookings', bookingRoutes);
  console.log('✅ Booking routes registered');

  app.use('/api/favorites', favoritesRoutes);
  console.log('✅ Favorites routes registered');

  app.use('/api/maps', mapsRoutes);
  console.log('✅ Maps routes registered');

  app.use('/api/placeholder', placeholderRoutes);
  console.log('✅ Placeholder routes registered');

  app.use('/api/public-maps', publicMapsRoutes);
  console.log('✅ Public maps routes registered');

  app.use('/api/notifications', notificationRoutes);
  console.log('✅ Notifications routes registered');

  app.use('/api/reviews', reviewRoutes);
  console.log('✅ Review routes registered');
} catch (error) {
  console.error('❌ Error loading routes:', error.message);
  process.exit(1);
}

// WebSocket endpoint for notifications
app.get('/api/notifications/stream', (req, res) => {
  res.status(426).json({ 
    message: 'Please use WebSocket connection for real-time notifications',
    wsUrl: `ws://localhost:${PORT}/socket.io/?token=YOUR_TOKEN`
  });
});

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Nomad Desk API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Test route to verify server is working
app.get('/api/test', (req, res) => {
  console.log('Test route hit!');
  res.json({ 
    message: 'Server is working!', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
    websocket: io ? 'enabled' : 'disabled',
    port: PORT
  });
});

// Error handling middleware - FIXED: Better error response formatting
app.use((error, req, res, next) => {
  console.error('\n=== SERVER ERROR ===');
  console.error('URL:', req.url);
  console.error('Method:', req.method);
  console.error('Error:', error.message);
  console.error('Stack:', error.stack);
  
  // Don't expose stack traces in production
  const isDev = process.env.NODE_ENV === 'development';
  
  res.status(error.status || 500).json({ 
    message: error.message || 'Something went wrong!',
    ...(isDev && { stack: error.stack }),
    timestamp: new Date().toISOString()
  });
});

// 404 handler - FIXED: Better logging and response
app.use((req, res) => {
  console.log(`\n❌ 404 - Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ 
    message: 'Route not found',
    path: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Start server with automatic port cleanup - FIXED: Better error handling
const startServer = async () => {
  try {
    console.log('🚀 Starting Nomad Desk API Server...\n');
    
    // Validate required environment variables
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is required');
    }
    
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is required');
    }
    
    // Kill any existing process on the port
    await killPortProcess(PORT);
    
    // Start the server
    server.listen(PORT, () => {
      console.log(`\n🚀 Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Available at: http://localhost:${PORT}`);
      console.log(`WebSocket available at: ws://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
      console.log('\n📋 Available routes:');
      console.log('  GET  /api/test');
      console.log('  GET  /health');
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
    
    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is still in use. Please wait and try again, or use a different port.`);
      } else {
        console.error('❌ Server error:', error.message);
      }
      process.exit(1);
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Handle graceful shutdown - FIXED: Better cleanup
const gracefulShutdown = (signal) => {
  console.log(`\n👋 Received ${signal}. Shutting down server gracefully...`);
  
  server.close((err) => {
    if (err) {
      console.error('❌ Error during server shutdown:', err);
      process.exit(1);
    }
    
    console.log('✅ HTTP server closed');
    
    // Close Socket.io connections
    io.close(() => {
      console.log('✅ Socket.io server closed');
      
      // Close database connections if needed
      // mongoose.connection.close(() => {
      //   console.log('✅ Database connection closed');
      //   process.exit(0);
      // });
      
      process.exit(0);
    });
  });
  
  // Force exit after 10 seconds
  setTimeout(() => {
    console.error('❌ Forced shutdown due to timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Handle uncaught exceptions - FIXED: Better error handling
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise);
  console.error('Reason:', reason);
  process.exit(1);
});

// Start the server
startServer();

// Notification helper functions - FIXED: Better error handling for require
try {
  const { createBookingNotification, createConnectionNotification } = require('./utils/notificationHelpers');
  console.log('✅ Notification helpers loaded');
} catch (error) {
  console.error('⚠️  Warning: Could not load notification helpers:', error.message);
}

// Export server for testing
module.exports = { app, server, io };