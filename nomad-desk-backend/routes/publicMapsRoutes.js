// nomad-desk-backend/routes/publicMapsRoutes.js - FIXED CORS ISSUE
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
 * @desc    Get the Google Maps API key (FIXED - Allow all Vercel domains)
 * @access  Public
 */
router.get('/api-key', (req, res) => {
  try {
    const referer = req.headers.referer || '';
    const origin = req.headers.origin || '';
    
    console.log('🔍 API Key Request:');
    console.log('  - Referer:', referer);
    console.log('  - Origin:', origin);
    
    // FIXED: Allow all Vercel domains and localhost
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5185',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5185',
      'https://nomad-desk-ochre.vercel.app',
      // Add pattern matching for any Vercel domain
    ];
    
    // Check if it's a Vercel domain or localhost
    const isVercelDomain = referer.includes('.vercel.app') || origin.includes('.vercel.app');
    const isLocalhost = referer.includes('localhost') || referer.includes('127.0.0.1') || 
                       origin.includes('localhost') || origin.includes('127.0.0.1');
    const isAllowedOrigin = allowedOrigins.some(allowed => 
      referer.startsWith(allowed) || origin === allowed
    );
    
    if (!isVercelDomain && !isLocalhost && !isAllowedOrigin && (referer || origin)) {
      console.log('❌ API key blocked by CORS:', { referer, origin });
      return res.status(403).json({ message: 'Access denied' });
    }
    
    console.log('✅ API key provided to allowed origin:', referer || origin || 'direct');
    
    // Return the API key
    res.json({ apiKey: GOOGLE_MAPS_API_KEY });
  } catch (error) {
    console.error('API key error:', error.message);
    res.status(500).json({ message: 'Server error while getting API key' });
  }
});

/**
 * @route   GET api/public-maps/geocode
 * @desc    Reverse geocode coordinates to address (public version)
 * @access  Public
 */
router.get('/geocode', async (req, res) => {
  try {
    const { latlng } = req.query;
    
    if (!latlng) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }
    
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${encodeURIComponent(latlng)}&key=${GOOGLE_MAPS_API_KEY}`;
    
    console.log(`🔍 Proxying Google Geocoding API request for: ${latlng}`);
    
    const response = await axios.get(url);
    
    // Check if the request was successful
    if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
      console.error('❌ Google Geocoding API error:', response.data.status, response.data.error_message);
      return res.status(400).json({ 
        message: 'Geocoding failed', 
        status: response.data.status,
        error: response.data.error_message 
      });
    }
    
    console.log(`✅ Geocoding successful: Found ${response.data.results?.length || 0} results`);
    
    // Return the geocoding results
    res.json(response.data);
  } catch (error) {
    console.error('❌ Geocoding error:', error.message);
    res.status(500).json({ message: 'Server error during geocoding' });
  }
});

/**
 * @route   GET api/public-maps/places/details
 * @desc    Get details for a specific place (public version)
 * @access  Public
 */
router.get('/places/details', async (req, res) => {
  try {
    const { place_id, fields } = req.query;
    
    if (!place_id) {
      return res.status(400).json({ message: 'Place ID is required' });
    }
    
    let url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(place_id)}&key=${GOOGLE_MAPS_API_KEY}`;
    
    if (fields) {
      url += `&fields=${encodeURIComponent(fields)}`;
    }
    
    console.log(`🔍 Proxying Google Places Details API request for: ${place_id}`);
    
    const response = await axios.get(url);
    
    // Check if the request was successful
    if (response.data.status !== 'OK') {
      console.error('❌ Google Places Details API error:', response.data.status, response.data.error_message);
      return res.status(400).json({ 
        message: 'Place details failed', 
        status: response.data.status,
        error: response.data.error_message 
      });
    }
    
    console.log(`✅ Place details retrieved successfully`);
    
    // Return the place details
    res.json(response.data);
  } catch (error) {
    console.error('❌ Place details error:', error.message);
    res.status(500).json({ message: 'Server error during place details' });
  }
});

module.exports = router;