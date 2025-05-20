// nomad-desk-backend/routes/googleAuthRoutes.js

const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { user: { id: user.id } },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

// Google OAuth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    try {
      console.log('Google auth successful, user:', req.user);
      
      // Successful authentication, generate JWT
      const token = generateToken(req.user);
      
      // Get user data to send to frontend
      const userData = {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar
      };
      
      // Encode the user data for URL transmission
      const encodedUser = encodeURIComponent(JSON.stringify(userData));
      
      // Redirect to frontend with token and user data
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/oauth-callback?token=${token}&user=${encodedUser}`);
    } catch (error) {
      console.error('Error in Google callback:', error);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=Authentication failed`);
    }
  }
);

module.exports = router;