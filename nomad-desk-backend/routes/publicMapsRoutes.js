// nomad-desk-backend/routes/publicMapsRoutes.js - ADD MISSING PLACES ENDPOINT
const express = require('express');
const router = express.Router();
const axios = require('axios');

// Environment variables
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

/**
 * @route   GET api/public-maps/places/nearby
 * @desc    Search for places nearby a location (public version)
 * @access  Public
 */
router.get('/places/nearby', async (req, res) => {
  try {
    const { location, radius, type, keyword } = req.query;
    
    if (!location || !radius) {
      return res.status(400).json({ message: 'Location and radius are required' });
    }
    
    let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${encodeURIComponent(location)}&radius=${encodeURIComponent(radius)}&key=${GOOGLE_MAPS_API_KEY}`;
    
    if (type) {
      url += `&type=${encodeURIComponent(type)}`;
    }
    
    if (keyword) {
      url += `&keyword=${encodeURIComponent(keyword)}`;
    }
    
    console.log(`🔍 Proxying Google Places API request: ${type || 'general'} search near ${location}`);
    
    const response = await axios.get(url);
    
    // Check if the request was successful
    if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
      console.error('❌ Google Places API error:', response.data.status, response.data.error_message);
      return res.status(400).json({ 
        message: 'Nearby search failed', 
        status: response.data.status,
        error: response.data.error_message 
      });
    }
    
    console.log(`✅ Found ${response.data.results?.length || 0} places for ${type || 'general'} search`);
    
    // Return the nearby search results
    res.json(response.data);
  } catch (error) {
    console.error('❌ Nearby search error:', error.message);
    res.status(500).json({ message: 'Server error during nearby search' });
  }
});

/**
 * @route   GET api/public-maps/photo
 * @desc    Get a place photo using the photo_reference (public version)
 * @access  Public
 */
router.get('/photo', async (req, res) => {
  try {
    const { reference, maxwidth = 400, maxheight } = req.query;
    
    if (!reference) {
      return res.status(400).json({ message: 'Photo reference is required' });
    }
    
    let url = `https://maps.googleapis.com/maps/api/place/photo?photoreference=${encodeURIComponent(reference)}&key=${GOOGLE_MAPS_API_KEY}&maxwidth=${maxwidth}`;
    
    if (maxheight) {
      url += `&maxheight=${encodeURIComponent(maxheight)}`;
    }
    
    // Proxy the image
    const response = await axios.get(url, { 
      responseType: 'arraybuffer',
      // Handle redirects manually
      maxRedirects: 0,
      validateStatus: status => status >= 200 && status < 400
    });
    
    // Check if we received a redirect
    if (response.status >= 300 && response.status < 400 && response.headers.location) {
      // Get the image from the redirect URL
      const redirectResponse = await axios.get(response.headers.location, { 
        responseType: 'arraybuffer' 
      });
      
      // Set headers
      res.set('Content-Type', redirectResponse.headers['content-type']);
      res.set('Content-Length', redirectResponse.headers['content-length']);
      
      // Return the image
      return res.send(redirectResponse.data);
    }
    
    // Set headers
    res.set('Content-Type', response.headers['content-type']);
    res.set('Content-Length', response.headers['content-length']);
    
    // Return the image
    res.send(response.data);
  } catch (error) {
    console.error('Photo error:', error.message);
    
    // If we can't get the photo, return a generic placeholder
    res.redirect(`/api/placeholder/${req.query.maxwidth || 400}/${req.query.maxheight || 300}?text=No+Image`);
  }
});

/**
 * @route   GET api/public-maps/api-key
 * @desc    Get the Google Maps API key (public version with referer restrictions)
 * @access  Public
 */
router.get('/api-key', (req, res) => {
  try {
    // Check the referer to ensure it's from an allowed origin
    const referer = req.headers.referer || '';
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5185',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5185'
      // Add your production domains here
    ];
    
    const isAllowedOrigin = allowedOrigins.some(origin => referer.startsWith(origin));
    
    if (!isAllowedOrigin && referer) {
      console.log('❌ API key blocked by CORS:', referer);
      return res.status(403).json({ message: 'Access denied' });
    }
    
    console.log('✅ API key provided to allowed origin:', referer || 'direct');
    
    // Return the API key
    res.json({ apiKey: GOOGLE_MAPS_API_KEY });
  } catch (error) {
    console.error('API key error:', error.message);
    res.status(500).json({ message: 'Server error while getting API key' });
  }
});

module.exports = router;