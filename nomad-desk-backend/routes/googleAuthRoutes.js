// nomad-desk-backend/routes/googleAuthRoutes.js - WITH COMPREHENSIVE DEBUGGING
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
router.get('/google', (req, res, next) => {
  console.log('\n🔵 === GOOGLE OAUTH INITIATION ===');
  console.log('📍 Route: GET /api/auth/google');
  console.log('🔗 Referer:', req.headers.referer || 'None');
  console.log('🌍 Origin:', req.headers.origin || 'None');
  console.log('👤 User-Agent:', req.headers['user-agent'] ? 'Present' : 'None');
  console.log('🚀 Initiating Google OAuth flow...');
  
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

router.get('/google/callback', (req, res, next) => {
  console.log('\n🟢 === GOOGLE OAUTH CALLBACK ===');
  console.log('📍 Route: GET /api/auth/google/callback');
  console.log('🔗 Referer:', req.headers.referer || 'None');
  console.log('🌍 Origin:', req.headers.origin || 'None');
  console.log('📝 Query params:', Object.keys(req.query).length > 0 ? req.query : 'None');
  console.log('🏃‍♂️ Starting Passport authentication...');
  
  passport.authenticate('google', { 
    failureRedirect: '/login', 
    session: false 
  }, (err, user, info) => {
    console.log('\n🔍 === PASSPORT AUTHENTICATION RESULT ===');
    
    if (err) {
      console.log('❌ Passport authentication error:', err);
      console.log('🔄 Redirecting to login due to error...');
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=Authentication failed`);
    }
    
    if (!user) {
      console.log('❌ No user returned from Passport');
      console.log('ℹ️  Info:', info);
      console.log('🔄 Redirecting to login due to no user...');
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=Authentication failed`);
    }
    
    console.log('✅ Passport authentication successful!');
    console.log('👤 User ID:', user.id);
    console.log('📧 User Email:', user.email);
    console.log('🏷️  User Name:', user.name);
    
    try {
      console.log('\n🔧 === TOKEN GENERATION ===');
      const token = generateToken(user);
      console.log('🎫 JWT Token generated successfully');
      console.log('🔑 Token length:', token.length);
      console.log('🔑 Token preview:', token.substring(0, 50) + '...');
      
      // Get user data to send to frontend
      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      };
      
      console.log('\n📦 === USER DATA PREPARATION ===');
      console.log('👤 User data:', userData);
      
      // Get frontend URL
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      console.log('🌐 Frontend URL:', frontendUrl);
      
      // Encode user data for URL
      const encodedUser = encodeURIComponent(JSON.stringify(userData));
      console.log('📝 Encoded user data length:', encodedUser.length);
      
      // Build redirect URL
      const redirectUrl = `${frontendUrl}/oauth-success?token=${token}&user=${encodedUser}`;
      console.log('\n🎯 === REDIRECT PREPARATION ===');
      console.log('🔗 Full redirect URL:', redirectUrl);
      console.log('📏 Redirect URL length:', redirectUrl.length);
      
      // Perform redirect with detailed logging
      console.log('\n🚀 === PERFORMING REDIRECT ===');
      console.log('⏰ Timestamp:', new Date().toISOString());
      console.log('🎯 Redirecting to:', redirectUrl);
      
      // Set appropriate headers
      res.status(302);
      res.setHeader('Location', redirectUrl);
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      
      console.log('📤 Response headers set:');
      console.log('  - Status: 302');
      console.log('  - Location:', res.getHeader('Location'));
      console.log('  - Cache-Control:', res.getHeader('Cache-Control'));
      
      // End the response
      res.end();
      
      console.log('✅ Redirect response sent successfully');
      console.log('🏁 OAuth callback processing complete\n');
      
    } catch (tokenError) {
      console.log('\n❌ === TOKEN GENERATION ERROR ===');
      console.log('Error:', tokenError.message);
      console.log('Stack:', tokenError.stack);
      console.log('🔄 Redirecting to login due to token error...');
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=Token generation failed`);
    }
  })(req, res, next);
});

// Add a test route to verify JWT secret is working
router.get('/test-jwt', (req, res) => {
  console.log('\n🧪 === JWT TEST ROUTE ===');
  console.log('🔍 JWT_SECRET exists:', !!process.env.JWT_SECRET);
  console.log('🔍 JWT_SECRET length:', process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0);
  
  try {
    const testToken = jwt.sign({ test: 'data' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('✅ JWT generation test successful');
    console.log('🎫 Test token:', testToken.substring(0, 50) + '...');
    res.json({ 
      success: true, 
      tokenGenerated: true,
      jwtSecretExists: !!process.env.JWT_SECRET
    });
  } catch (error) {
    console.log('❌ JWT generation test failed:', error.message);
    res.json({ 
      success: false, 
      error: error.message,
      jwtSecretExists: !!process.env.JWT_SECRET
    });
  }
});

module.exports = router;