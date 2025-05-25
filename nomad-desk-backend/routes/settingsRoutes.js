// nomad-desk-backend/routes/settingsRoutes.js - NEW COMPREHENSIVE SETTINGS API
const express = require('express');
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { createSystemNotification } = require('../utils/notificationHelpers');
const router = express.Router();

/**
 * @route   GET api/settings/profile
 * @desc    Get user settings and profile data
 * @access  Private
 */
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get notification preferences count
    const notificationStats = await Notification.getStats(req.user.id);

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      profession: user.profession || '',
      location: user.location || '',
      timezone: user.timezone || 'UTC',
      bio: user.bio || '',
      interests: user.interests || [],
      skills: user.skills || [],
      education: user.education || [],
      socialLinks: user.socialLinks || {},
      preferences: {
        privateProfile: user.preferences?.privateProfile || false,
        emailNotifications: user.preferences?.emailNotifications !== false, // default true
        pushNotifications: user.preferences?.pushNotifications !== false, // default true
        studyPreferences: user.preferences?.studyPreferences || {
          preferredEnvironments: ['library', 'cafe'],
          noiseLevel: 'quiet',
          preferredTimes: ['morning', 'afternoon'],
          groupSize: 'small'
        }
      },
      notificationStats,
      lastActive: user.lastActive,
      createdAt: user.date
    });
  } catch (error) {
    console.error('Get settings error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   PUT api/settings/account
 * @desc    Update account settings (name, email, etc.)
 * @access  Private
 */
router.put('/account', auth, async (req, res) => {
  try {
    const { name, email, profession, location, timezone, bio, interests, skills } = req.body;

    // Check if email is being changed and if it already exists
    if (email) {
      const existingUser = await User.findOne({ 
        email, 
        _id: { $ne: req.user.id } 
      });
      
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (profession !== undefined) updateFields.profession = profession;
    if (location !== undefined) updateFields.location = location;
    if (timezone !== undefined) updateFields.timezone = timezone;
    if (bio !== undefined) updateFields.bio = bio;
    if (interests !== undefined) updateFields.interests = interests;
    if (skills !== undefined) updateFields.skills = skills;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true }
    ).select('-password');

    // Create notification for account update
    await createSystemNotification(
      req.user.id,
      'Account Updated',
      'Your account settings have been successfully updated.',
      '/settings',
      'View Settings'
    );

    res.json({
      message: 'Account settings updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profession: user.profession,
        location: user.location,
        timezone: user.timezone,
        bio: user.bio,
        interests: user.interests,
        skills: user.skills
      }
    });
  } catch (error) {
    console.error('Update account error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   PUT api/settings/password
 * @desc    Change password
 * @access  Private
 */
router.put('/password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    const user = await User.findById(req.user.id);
    
    if (!user.password) {
      return res.status(400).json({ message: 'Cannot change password for social login accounts' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.findByIdAndUpdate(req.user.id, {
      password: hashedPassword
    });

    // Create notification for password change
    await createSystemNotification(
      req.user.id,
      'Password Changed',
      'Your password has been successfully updated. If you did not make this change, please contact support.',
      '/settings',
      'Security Settings'
    );

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   PUT api/settings/preferences
 * @desc    Update user preferences
 * @access  Private
 */
router.put('/preferences', auth, async (req, res) => {
  try {
    const { 
      privateProfile, 
      emailNotifications, 
      pushNotifications,
      studyPreferences,
      language,
      theme,
      timeFormat,
      distanceUnit
    } = req.body;

    const updateFields = {};
    
    if (privateProfile !== undefined) updateFields['preferences.privateProfile'] = privateProfile;
    if (emailNotifications !== undefined) updateFields['preferences.emailNotifications'] = emailNotifications;
    if (pushNotifications !== undefined) updateFields['preferences.pushNotifications'] = pushNotifications;
    if (studyPreferences !== undefined) updateFields['preferences.studyPreferences'] = studyPreferences;
    if (language !== undefined) updateFields['preferences.language'] = language;
    if (theme !== undefined) updateFields['preferences.theme'] = theme;
    if (timeFormat !== undefined) updateFields['preferences.timeFormat'] = timeFormat;
    if (distanceUnit !== undefined) updateFields['preferences.distanceUnit'] = distanceUnit;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true }
    ).select('preferences');

    res.json({
      message: 'Preferences updated successfully',
      preferences: user.preferences
    });
  } catch (error) {
    console.error('Update preferences error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   PUT api/settings/notifications
 * @desc    Update notification preferences
 * @access  Private
 */
router.put('/notifications', auth, async (req, res) => {
  try {
    const { 
      emailNotifications, 
      pushNotifications, 
      bookingReminders, 
      connectionRequests,
      studySessionInvites,
      marketingEmails 
    } = req.body;

    const updateFields = {};
    
    if (emailNotifications !== undefined) updateFields['preferences.emailNotifications'] = emailNotifications;
    if (pushNotifications !== undefined) updateFields['preferences.pushNotifications'] = pushNotifications;
    if (bookingReminders !== undefined) updateFields['preferences.bookingReminders'] = bookingReminders;
    if (connectionRequests !== undefined) updateFields['preferences.connectionRequests'] = connectionRequests;
    if (studySessionInvites !== undefined) updateFields['preferences.studySessionInvites'] = studySessionInvites;
    if (marketingEmails !== undefined) updateFields['preferences.marketingEmails'] = marketingEmails;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true }
    ).select('preferences');

    res.json({
      message: 'Notification preferences updated successfully',
      preferences: user.preferences
    });
  } catch (error) {
    console.error('Update notification preferences error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   POST api/settings/export-data
 * @desc    Export user data
 * @access  Private
 */
router.post('/export-data', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    // Get user's bookings, favorites, connections, etc.
    const [bookings, favorites, notifications] = await Promise.all([
      require('../models/Booking').find({ user: req.user.id }),
      require('../models/Favorite').find({ user: req.user.id }),
      Notification.find({ user: req.user.id }).limit(100)
    ]);

    const exportData = {
      profile: user,
      bookings,
      favorites,
      recentNotifications: notifications,
      exportedAt: new Date().toISOString()
    };

    // Create notification for data export
    await createSystemNotification(
      req.user.id,
      'Data Export Complete',
      'Your personal data has been successfully exported. The download should start automatically.',
      '/settings',
      'View Settings'
    );

    res.json({
      message: 'Data exported successfully',
      data: exportData
    });
  } catch (error) {
    console.error('Export data error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   DELETE api/settings/delete-account
 * @desc    Delete user account (soft delete)
 * @access  Private
 */
router.delete('/delete-account', auth, async (req, res) => {
  try {
    const { password, confirmEmail } = req.body;

    const user = await User.findById(req.user.id);
    
    // Verify email confirmation
    if (confirmEmail !== user.email) {
      return res.status(400).json({ message: 'Email confirmation does not match your account email' });
    }

    // Verify password for non-social accounts
    if (user.password && password) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Password is incorrect' });
      }
    }

    // Soft delete - anonymize data instead of hard delete
    await User.findByIdAndUpdate(req.user.id, {
      name: 'Deleted User',
      email: `deleted_${Date.now()}@nomaddesk.com`,
      password: null,
      googleId: null,
      avatar: null,
      profession: '',
      location: '',
      bio: 'This account has been deleted',
      interests: [],
      skills: [],
      socialLinks: {},
      preferences: {
        privateProfile: true,
        emailNotifications: false,
        pushNotifications: false
      }
    });

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET api/settings/sessions
 * @desc    Get active sessions (mock data for now)
 * @access  Private
 */
router.get('/sessions', auth, async (req, res) => {
  try {
    // Mock active sessions data
    const sessions = [
      {
        id: 'current',
        device: 'Current Device - Chrome on macOS',
        location: 'San Francisco, CA',
        lastActive: 'Active now',
        isCurrent: true
      },
      {
        id: 'mobile',
        device: 'iPhone 14 - Safari',
        location: 'San Francisco, CA',
        lastActive: 'Yesterday',
        isCurrent: false
      }
    ];

    res.json(sessions);
  } catch (error) {
    console.error('Get sessions error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;