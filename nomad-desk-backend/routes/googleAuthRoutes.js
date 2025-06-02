// nomad-desk-backend/routes/googleAuthRoutes.js - FIXED VERSION
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

// Get environment variables with proper fallbacks
const JWT_SECRET = process.env.JWT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://nomad-desk-ochre.vercel.app';

console.log('🔧 Google Auth Routes Configuration:');
console.log('  - JWT_SECRET:', JWT_SECRET ? 'Present' : 'MISSING');
console.log('  - FRONTEND_URL:', FRONTEND_URL);

// Google OAuth initiation route
router.get('/google', (req, res, next) => {
  console.log('\n🔵 === GOOGLE OAUTH INITIATION ===');
  console.log('📍 Route: GET /api/auth/google');
  console.log('🔗 Referer:', req.headers.referer || 'None');
  console.log('🌍 Origin:', req.headers.origin || 'None');
  console.log('🚀 Initiating Google OAuth flow...');
  
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    session: false 
  })(req, res, next);
});

// Google OAuth callback route - FIXED VERSION
router.get('/google/callback', (req, res, next) => {
  console.log('\n🟢 === GOOGLE OAUTH CALLBACK ===');
  console.log('📍 Route: GET /api/auth/google/callback');
  console.log('🔗 Referer:', req.headers.referer || 'None');
  console.log('🌍 Origin:', req.headers.origin || 'None');
  console.log('📝 Query params:', Object.keys(req.query).length > 0 ? req.query : 'None');
  console.log('🏃‍♂️ Starting Passport authentication...');
  
  // Use passport.authenticate with callback to handle the result
  passport.authenticate('google', { 
    session: false,
    failureRedirect: `${FRONTEND_URL}/login?error=oauth_failed`
  }, async (err, user, info) => {
    console.log('\n🔍 === PASSPORT AUTHENTICATION RESULT ===');
    
    if (err) {
      console.log('❌ Passport authentication error:', err);
      const errorRedirect = `${FRONTEND_URL}/login?error=${encodeURIComponent('Authentication failed')}`;
      console.log('🔄 Redirecting to:', errorRedirect);
      return res.redirect(errorRedirect);
    }
    
    if (!user) {
      console.log('❌ No user returned from Passport');
      console.log('ℹ️  Info:', info);
      const errorRedirect = `${FRONTEND_URL}/login?error=${encodeURIComponent('Authentication failed')}`;
      console.log('🔄 Redirecting to:', errorRedirect);
      return res.redirect(errorRedirect);
    }
    
    try {
      console.log('✅ Passport authentication successful!');
      console.log('👤 User ID:', user.id || user._id);
      console.log('📧 User Email:', user.email);
      console.log('🏷️  User Name:', user.name);
      
      // Validate JWT_SECRET
      if (!JWT_SECRET) {
        console.log('❌ JWT_SECRET is missing!');
        const errorRedirect = `${FRONTEND_URL}/login?error=${encodeURIComponent('Server configuration error')}`;
        return res.redirect(errorRedirect);
      }
      
      console.log('\n🔧 === TOKEN GENERATION ===');
      
      // Generate JWT token
      const token = generateToken(user);
      console.log('🎫 JWT Token generated successfully');
      console.log('🔑 Token length:', token.length);
      console.log('🔑 Token preview:', token.substring(0, 50) + '...');
      
      // Prepare user data
      const userData = {
        id: user.id || user._id.toString(),
        name: user.name,
        email: user.email,
        avatar: user.avatar || null
      };
      
      console.log('\n📦 === USER DATA PREPARATION ===');
      console.log('👤 User data:', userData);
      
      // Encode user data for URL - FIXED: Better encoding
      const encodedUser = encodeURIComponent(JSON.stringify(userData));
      console.log('📝 Encoded user data length:', encodedUser.length);
      
      // FIXED: Construct proper redirect URL
      const redirectUrl = `${FRONTEND_URL}/oauth-success?token=${token}&user=${encodedUser}`;
      
      console.log('\n🎯 === REDIRECT PREPARATION ===');
      console.log('🌐 Frontend URL:', FRONTEND_URL);
      console.log('🔗 Full redirect URL:', redirectUrl);
      console.log('📏 Redirect URL length:', redirectUrl.length);
      
      // FIXED: Perform redirect with proper headers
      console.log('\n🚀 === PERFORMING REDIRECT ===');
      console.log('⏰ Timestamp:', new Date().toISOString());
      
      // Set proper redirect headers
      res.writeHead(302, {
        'Location': redirectUrl,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      
      res.end();
      
      console.log('✅ Redirect response sent successfully');
      console.log('🏁 OAuth callback processing complete\n');
      
    } catch (tokenError) {
      console.log('\n❌ === TOKEN GENERATION ERROR ===');
      console.log('Error:', tokenError.message);
      console.log('Stack:', tokenError.stack);
      const errorRedirect = `${FRONTEND_URL}/login?error=${encodeURIComponent('Token generation failed')}`;
      console.log('🔄 Redirecting to login due to token error:', errorRedirect);
      res.redirect(errorRedirect);
    }
  })(req, res, next);
});

// Test route to verify JWT is working
router.get('/test-jwt', (req, res) => {
  console.log('\n🧪 === JWT TEST ROUTE ===');
  console.log('🔍 JWT_SECRET exists:', !!JWT_SECRET);
  console.log('🔍 JWT_SECRET length:', JWT_SECRET ? JWT_SECRET.length : 0);
  console.log('🔍 FRONTEND_URL:', FRONTEND_URL);
  
  try {
    const testToken = jwt.sign({ test: 'data' }, JWT_SECRET, { expiresIn: '1h' });
    console.log('✅ JWT generation test successful');
    console.log('🎫 Test token preview:', testToken.substring(0, 50) + '...');
    res.json({ 
      success: true, 
      tokenGenerated: true,
      jwtSecretExists: !!JWT_SECRET,
      frontendUrl: FRONTEND_URL
    });
  } catch (error) {
    console.log('❌ JWT generation test failed:', error.message);
    res.json({ 
      success: false, 
      error: error.message,
      jwtSecretExists: !!JWT_SECRET,
      frontendUrl: FRONTEND_URL
    });
  }
});

// Debug route to check environment
router.get('/debug', (req, res) => {
  console.log('\n🔍 === DEBUG ROUTE ===');
  console.log('Environment variables:');
  console.log('  - NODE_ENV:', process.env.NODE_ENV);
  console.log('  - JWT_SECRET:', process.env.JWT_SECRET ? 'Present' : 'MISSING');
  console.log('  - FRONTEND_URL:', process.env.FRONTEND_URL);
  console.log('  - GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'Present' : 'MISSING');
  console.log('  - GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'Present' : 'MISSING');
  
  res.json({
    nodeEnv: process.env.NODE_ENV,
    hasJwtSecret: !!process.env.JWT_SECRET,
    frontendUrl: process.env.FRONTEND_URL,
    hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
    hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;