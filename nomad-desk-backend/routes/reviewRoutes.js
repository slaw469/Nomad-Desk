const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Booking = require('../models/Booking');
const Workspace = require('../models/Workspace');
const auth = require('../middleware/auth');

/**
 * @route   POST api/reviews/booking/:bookingId
 * @desc    Create a review for a booking
 * @access  Private
 */
router.post('/booking/:bookingId', auth, async (req, res) => {
  try {
    const { rating, review } = req.body;
    const bookingId = req.params.bookingId;

    // Validate booking exists and belongs to user
    const booking = await Booking.findOne({
      _id: bookingId,
      user: req.user.id,
      status: { $in: ['completed', 'cancelled'] }
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found or not eligible for review' });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ booking: bookingId });
    if (existingReview) {
      return res.status(400).json({ message: 'Review already exists for this booking' });
    }

    // Create review
    const newReview = new Review({
      booking: bookingId,
      workspace: booking.workspace.id,
      user: req.user.id,
      rating,
      review
    });

    await newReview.save();

    // Update workspace rating
    const { averageRating, totalReviews } = await Review.calculateAverageRating(booking.workspace.id);
    
    // Update the workspace with new rating
    await Workspace.findByIdAndUpdate(booking.workspace.id, {
      rating: averageRating,
      totalReviews: totalReviews
    });
    
    // Update booking to mark as reviewed
    booking.review = review;
    booking.rating = rating;
    await booking.save();

    res.json(newReview);
  } catch (error) {
    console.error('Create review error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET api/reviews/workspace/:workspaceId
 * @desc    Get all reviews for a workspace
 * @access  Public
 */
router.get('/workspace/:workspaceId', async (req, res) => {
  try {
    const reviews = await Review.find({ workspace: req.params.workspaceId })
      .populate('user', 'name photo')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error('Get workspace reviews error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET api/reviews/user
 * @desc    Get all reviews by the authenticated user
 * @access  Private
 */
router.get('/user', auth, async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user.id })
      .populate('workspace', 'name photo')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error('Get user reviews error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 