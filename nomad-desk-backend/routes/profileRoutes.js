// nomad-desk-backend/routes/profileRoutes.js
const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

// @route   GET api/profile
// @desc    Get current user's profile
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT api/profile
// @desc    Update user profile
// @access  Private
router.put('/', auth, async (req, res) => {
  try {
    const {
      name,
      profession,
      location,
      timezone,
      bio,
      interests,
      education,
      socialLinks,
      preferences
    } = req.body;

    // Build profile object
    const profileFields = {};
    if (name) profileFields.name = name;
    if (profession) profileFields.profession = profession;
    if (location) profileFields.location = location;
    if (timezone) profileFields.timezone = timezone;
    if (bio) profileFields.bio = bio;
    if (interests) profileFields.interests = interests;
    if (education) profileFields.education = education;
    if (socialLinks) profileFields.socialLinks = socialLinks;
    if (preferences) profileFields.preferences = preferences;

    let user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user
    user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: profileFields },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/profile/:user_id
// @desc    Get user profile by ID
// @access  Private
router.get('/:user_id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.user_id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if profile is private and user is not connected
    if (user.preferences?.privateProfile && req.user.id !== user.id.toString()) {
      // Here you would check if they are connected - for now we'll return basic info
      const publicProfile = {
        id: user._id,
        name: user.name,
        profession: user.profession,
        location: user.location,
        avatar: user.avatar
      };
      return res.json(publicProfile);
    }

    res.json(user);
  } catch (error) {
    console.error('Get user profile error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/profile/search
// @desc    Search users by name, profession, interests
// @access  Private
router.get('/search', auth, async (req, res) => {
  try {
    const { q, interests, profession, limit = 20 } = req.query;
    
    let query = {};
    
    // Build search query
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { profession: { $regex: q, $options: 'i' } },
        { 'interests': { $regex: q, $options: 'i' } }
      ];
    }
    
    if (interests) {
      const interestArray = interests.split(',');
      query.interests = { $in: interestArray };
    }
    
    if (profession) {
      query.profession = { $regex: profession, $options: 'i' };
    }
    
    // Exclude current user and private profiles
    query._id = { $ne: req.user.id };
    query['preferences.privateProfile'] = { $ne: true };
    
    const users = await User.find(query)
      .select('name profession location interests avatar')
      .limit(parseInt(limit));
    
    res.json(users);
  } catch (error) {
    console.error('Search users error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/profile/avatar
// @desc    Upload avatar (placeholder - would need multer for file upload)
// @access  Private
router.post('/avatar', auth, async (req, res) => {
  try {
    // This is a placeholder - in a real app you'd use multer for file uploads
    // and upload to a service like AWS S3, Cloudinary, etc.
    const { avatarUrl } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: avatarUrl },
      { new: true }
    ).select('-password');
    
    res.json({ avatarUrl: user.avatar });
  } catch (error) {
    console.error('Upload avatar error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/profile/suggested-connections
// @desc    Get suggested connections based on interests, location, etc.
// @access  Private
router.get('/suggested-connections', auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Find users with similar interests or in same location
    const query = {
      _id: { $ne: req.user.id },
      'preferences.privateProfile': { $ne: true }
    };
    
    if (currentUser.interests && currentUser.interests.length > 0) {
      query.$or = [
        { interests: { $in: currentUser.interests } },
        { location: currentUser.location }
      ];
    }
    
    const suggestedUsers = await User.find(query)
      .select('name profession location interests avatar')
      .limit(10);
    
    res.json(suggestedUsers);
  } catch (error) {
    console.error('Get suggested connections error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;