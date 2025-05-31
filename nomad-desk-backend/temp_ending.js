// Only start the server in development (not on Vercel)
if (process.env.NODE_ENV !== 'production') {
  startServer();
}

// Notification helper functions - FIXED: Better error handling for require
try {
  const { createBookingNotification, createConnectionNotification } = require('./utils/notificationHelpers');
  console.log('✅ Notification helpers loaded');
} catch (error) {
  console.error('⚠️  Warning: Could not load notification helpers:', error.message);
}

// Export just the app for Vercel (not the whole object)
module.exports = app;
