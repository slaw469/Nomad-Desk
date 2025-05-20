// nomad-desk-backend/config/passport.js

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

module.exports = function() {
  // Google Strategy
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback",
    scope: ['profile', 'email']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      console.log('Google profile:', profile);
      
      // Check if user already exists
      let user = await User.findOne({ email: profile.emails[0].value });
      
      if (user) {
        // If user exists but was created with a different method, update the Google provider info
        if (!user.googleId) {
          user.googleId = profile.id;
          await user.save();
        }
        return done(null, user);
      }
      
      // Create new user if they don't exist
      user = new User({
        name: profile.displayName,
        email: profile.emails[0].value,
        googleId: profile.id,
        password: null, // Social accounts don't need a password
        avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : null
      });
      
      await user.save();
      return done(null, user);
    } catch (err) {
      console.error('Error during Google authentication:', err);
      return done(err, null);
    }
  }));
};