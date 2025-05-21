// nomad-desk-backend/routes/placeholderRoutes.js
const express = require('express');
const router = express.Router();

/**
 * @route   GET api/placeholder/:width/:height
 * @desc    Generate a placeholder image with optional text
 * @access  Public
 */
router.get('/:width/:height', (req, res) => {
  try {
    const width = parseInt(req.params.width) || 400;
    const height = parseInt(req.params.height) || 300;
    const text = req.query.text || '';
    
    // Set maximum dimensions to prevent abuse
    const safeWidth = Math.min(width, 1200);
    const safeHeight = Math.min(height, 1200);
    
    // Create SVG placeholder
    const svg = `
      <svg width="${safeWidth}" height="${safeHeight}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#4A6FDC" />
        <rect width="100%" height="100%" fill="url(#gradient)" />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#4A6FDC" stop-opacity="1" />
            <stop offset="100%" stop-color="#2DD4BF" stop-opacity="1" />
          </linearGradient>
        </defs>
        <text 
          x="50%" 
          y="50%" 
          font-family="Arial, sans-serif" 
          font-size="${Math.max(safeHeight / 10, 12)}px" 
          font-weight="bold" 
          fill="#FFFFFF" 
          text-anchor="middle" 
          dominant-baseline="middle"
        >${text}</text>
      </svg>
    `;
    
    // Set content type and send SVG
    res.set('Content-Type', 'image/svg+xml');
    res.send(svg);
  } catch (error) {
    console.error('Placeholder generation error:', error.message);
    
    // In case of error, return a simple text-based SVG
    const errorSvg = `
      <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#FF5252" />
        <text 
          x="50%" 
          y="50%" 
          font-family="Arial, sans-serif" 
          font-size="20px" 
          font-weight="bold" 
          fill="#FFFFFF" 
          text-anchor="middle" 
          dominant-baseline="middle"
        >Error: Image Unavailable</text>
      </svg>
    `;
    
    res.set('Content-Type', 'image/svg+xml');
    res.send(errorSvg);
  }
});

module.exports = router;