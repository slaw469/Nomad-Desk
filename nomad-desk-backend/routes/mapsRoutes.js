// nomad-desk-backend/routes/mapsRoutes.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth'); // Import auth middleware

// Environment variables
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

/**
 * @route   GET api/maps/geocode
 * @desc    Geocode an address to get coordinates
 * @access  Private
 */
router.get('/geocode', auth, async (req, res) => {
  try {
    const { address } = req.query;
    
    if (!address) {
      return res.status(400).json({ message: 'Address is required' });
    }
    
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`
    );
    
    // Check if the geocoding was successful
    if (response.data.status !== 'OK') {
      return res.status(400).json({ 
        message: 'Geocoding failed', 
        status: response.data.status,
        error: response.data.error_message 
      });
    }
    
    // Return the geocoded results
    res.json(response.data);
  } catch (error) {
    console.error('Geocoding error:', error.message);
    res.status(500).json({ message: 'Server error during geocoding' });
  }
});

/**
 * @route   GET api/maps/places/autocomplete
 * @desc    Get place autocomplete suggestions
 * @access  Private
 */
router.get('/places/autocomplete', auth, async (req, res) => {
  try {
    const { input, types, components } = req.query;
    
    if (!input) {
      return res.status(400).json({ message: 'Input is required' });
    }
    
    let url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${GOOGLE_MAPS_API_KEY}`;
    
    if (types) {
      url += `&types=${encodeURIComponent(types)}`;
    }
    
    if (components) {
      url += `&components=${encodeURIComponent(components)}`;
    }
    
    const response = await axios.get(url);
    
    // Check if the request was successful
    if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
      return res.status(400).json({ 
        message: 'Place autocomplete failed', 
        status: response.data.status,
        error: response.data.error_message 
      });
    }
    
    // Return the autocomplete results
    res.json(response.data);
  } catch (error) {
    console.error('Place autocomplete error:', error.message);
    res.status(500).json({ message: 'Server error during place autocomplete' });
  }
});

/**
 * @route   GET api/maps/places/details
 * @desc    Get details for a specific place
 * @access  Private
 */
router.get('/places/details', auth, async (req, res) => {
  try {
    const { place_id, fields } = req.query;
    
    if (!place_id) {
      return res.status(400).json({ message: 'Place ID is required' });
    }
    
    let url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(place_id)}&key=${GOOGLE_MAPS_API_KEY}`;
    
    if (fields) {
      url += `&fields=${encodeURIComponent(fields)}`;
    }
    
    const response = await axios.get(url);
    
    // Check if the request was successful
    if (response.data.status !== 'OK') {
      return res.status(400).json({ 
        message: 'Place details failed', 
        status: response.data.status,
        error: response.data.error_message 
      });
    }
    
    // Return the place details
    res.json(response.data);
  } catch (error) {
    console.error('Place details error:', error.message);
    res.status(500).json({ message: 'Server error during place details' });
  }
});

/**
 * @route   GET api/maps/places/nearby
 * @desc    Search for places nearby a location
 * @access  Private
 */
router.get('/places/nearby', auth, async (req, res) => {
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
    
    const response = await axios.get(url);
    
    // Check if the request was successful
    if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
      return res.status(400).json({ 
        message: 'Nearby search failed', 
        status: response.data.status,
        error: response.data.error_message 
      });
    }
    
    // Return the nearby search results
    res.json(response.data);
  } catch (error) {
    console.error('Nearby search error:', error.message);
    res.status(500).json({ message: 'Server error during nearby search' });
  }
});

/**
 * @route   GET api/maps/directions
 * @desc    Get directions between two locations
 * @access  Private
 */
router.get('/directions', auth, async (req, res) => {
  try {
    const { origin, destination, mode, waypoints, alternatives, avoid, units } = req.query;
    
    if (!origin || !destination) {
      return res.status(400).json({ message: 'Origin and destination are required' });
    }
    
    let url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&key=${GOOGLE_MAPS_API_KEY}`;
    
    if (mode) {
      url += `&mode=${encodeURIComponent(mode)}`;
    }
    
    if (waypoints) {
      url += `&waypoints=${encodeURIComponent(waypoints)}`;
    }
    
    if (alternatives) {
      url += `&alternatives=${encodeURIComponent(alternatives)}`;
    }
    
    if (avoid) {
      url += `&avoid=${encodeURIComponent(avoid)}`;
    }
    
    if (units) {
      url += `&units=${encodeURIComponent(units)}`;
    }
    
    const response = await axios.get(url);
    
    // Check if the request was successful
    if (response.data.status !== 'OK') {
      return res.status(400).json({ 
        message: 'Directions failed', 
        status: response.data.status,
        error: response.data.error_message 
      });
    }
    
    // Return the directions
    res.json(response.data);
  } catch (error) {
    console.error('Directions error:', error.message);
    res.status(500).json({ message: 'Server error during directions' });
  }
});

/**
 * @route   GET api/maps/static
 * @desc    Get a static map image
 * @access  Private
 */
router.get('/static', auth, async (req, res) => {
  try {
    const { center, zoom, size, markers, path, format } = req.query;
    
    if (!center || !zoom || !size) {
      return res.status(400).json({ message: 'Center, zoom, and size are required' });
    }
    
    let url = `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(center)}&zoom=${encodeURIComponent(zoom)}&size=${encodeURIComponent(size)}&key=${GOOGLE_MAPS_API_KEY}`;
    
    if (markers) {
      url += `&markers=${encodeURIComponent(markers)}`;
    }
    
    if (path) {
      url += `&path=${encodeURIComponent(path)}`;
    }
    
    if (format) {
      url += `&format=${encodeURIComponent(format)}`;
    }
    
    // Proxy the image
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    
    // Set headers
    res.set('Content-Type', response.headers['content-type']);
    res.set('Content-Length', response.headers['content-length']);
    
    // Return the image
    res.send(response.data);
  } catch (error) {
    console.error('Static map error:', error.message);
    res.status(500).json({ message: 'Server error during static map' });
  }
});

/**
 * @route   GET api/maps/photo
 * @desc    Get a place photo using the photo_reference
 * @access  Private
 */
router.get('/photo', auth, async (req, res) => {
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
 * @route   GET api/maps/api-key
 * @desc    Get the Google Maps API key (restricted by referer)
 * @access  Private
 */
router.get('/api-key', auth, (req, res) => {
  try {
    // Return the API key
    res.json({ apiKey: GOOGLE_MAPS_API_KEY });
  } catch (error) {
    console.error('API key error:', error.message);
    res.status(500).json({ message: 'Server error while getting API key' });
  }
});

module.exports = router;