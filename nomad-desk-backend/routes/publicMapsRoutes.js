// nomad-desk-backend/routes/publicMapsRoutes.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

// Environment variables
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

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
    res.redirect(`/api/placeholder/${req.query.maxwidth || 400}/${req.query.maxheight || 300}`);
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
    
    if (!isAllowedOrigin) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Return the API key
    res.json({ apiKey: GOOGLE_MAPS_API_KEY });
  } catch (error) {
    console.error('API key error:', error.message);
    res.status(500).json({ message: 'Server error while getting API key' });
  }
});

module.exports = router;