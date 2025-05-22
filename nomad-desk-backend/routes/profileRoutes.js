// nomad-desk-backend/routes/profileRoutes.js
const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

/**
 * @route   GET api/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      profession: user.profession,
      location: user.location,
      bio: user.bio,
      interests: user.interests,
      timezone: user.timezone,
      createdAt: user.date
    });
  } catch (err) {
    console.error('Get profile error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   PUT api/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/', auth, async (req, res) => {
  try {
    const {
      name,
      profession,
      location,
      bio,
      interests,
      timezone
    } = req.body;

    // Build profile object
    const profileFields = {};
    if (name) profileFields.name = name;
    if (profession) profileFields.profession = profession;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (interests) profileFields.interests = interests;
    if (timezone) profileFields.timezone = timezone;

    // Update user
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: profileFields },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      profession: user.profession,
      location: user.location,
      bio: user.bio,
      interests: user.interests,
      timezone: user.timezone,
      createdAt: user.date
    });
  } catch (err) {
    console.error('Update profile error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET api/profile/search
 * @desc    Search users by name, profession, interests
 * @access  Private
 */
router.get('/search', auth, async (req, res) => {
  try {
    const { q, limit = 20 } = req.query;

    if (!q || q.trim() === '') {
      return res.json([]);
    }

    const searchQuery = q.trim();
    
    // Create search conditions
    const searchConditions = {
      _id: { $ne: req.user.id }, // Exclude current user
      $or: [
        { name: { $regex: searchQuery, $options: 'i' } },
        { profession: { $regex: searchQuery, $options: 'i' } },
        { interests: { $in: [new RegExp(searchQuery, 'i')] } },
        { location: { $regex: searchQuery, $options: 'i' } }
      ]
    };

    const users = await User.find(searchConditions)
      .select('name email profession location avatar interests bio')
      .limit(parseInt(limit));

    res.json(users);
  } catch (err) {
    console.error('Search users error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET api/profile/:id
 * @desc    Get user profile by ID
 * @access  Private
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      profession: user.profession,
      location: user.location,
      bio: user.bio,
      interests: user.interests,
      timezone: user.timezone,
      createdAt: user.date
    });
  } catch (err) {
    console.error('Get user profile error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;