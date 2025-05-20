// nomad-desk-backend/middleware/auth.js

const jwt = require('jsonwebtoken');

/**
 * Authentication middleware
 * Verifies JWT token in the x-auth-token header
 * If valid, adds the user data to req.user and calls next()
 * If invalid or missing, returns a 401 Unauthorized response
 */
module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    console.log('Auth middleware: No token provided');
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Set user ID from decoded token
    req.user = decoded.user;
    
    // Continue to the protected route
    next();
  } catch (err) {
    console.error('Auth middleware: Token verification failed -', err.message);
    
    // Respond with appropriate error based on token issue
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired' });
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    } else {
      return res.status(401).json({ message: 'Token validation failed' });
    }
  }
};