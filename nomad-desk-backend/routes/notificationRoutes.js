// ===================================
// nomad-desk-backend/routes/notificationRoutes.js - FIXED
// ===================================

const express = require('express');
const auth = require('../middleware/auth');
const Notification = require('../models/Notification');
const router = express.Router();

/**
 * @route   GET api/notifications
 * @desc    Get user notifications with filters
 * @access  Private
 */
router.get('/', auth, async (req, res) => {
  try {
    const { status, type, search, startDate, endDate, limit = 20, offset = 0 } = req.query;
    
    // Build query
    const query = { user: req.user.id };
    
    if (status === 'unread') {
      query.isRead = false;
    }
    
    if (type && type !== 'all') {
      query.type = type;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));
    
    res.json(notifications);
  } catch (error) {
    console.error('Get notifications error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET api/notifications/stats
 * @desc    Get notification statistics
 * @access  Private
 */
router.get('/stats', auth, async (req, res) => {
  try {
    // FIXED: Pass the user ID directly as a string - Mongoose will handle the conversion
    const stats = await Notification.getStats(req.user.id);
    res.json(stats);
  } catch (error) {
    console.error('Get notification stats error:', error.message);
    console.error('Full error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET api/notifications/unread-count
 * @desc    Get unread notification count
 * @access  Private
 */
router.get('/unread-count', auth, async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      user: req.user.id,
      isRead: false
    });
    res.json({ count });
  } catch (error) {
    console.error('Get unread count error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET api/notifications/:id
 * @desc    Get notification by ID
 * @access  Private
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    res.json(notification);
  } catch (error) {
    console.error('Get notification error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   PUT api/notifications/:id/read
 * @desc    Mark notification as read
 * @access  Private
 */
router.put('/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { isRead: true, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    res.json(notification);
  } catch (error) {
    console.error('Mark as read error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   PUT api/notifications/mark-read
 * @desc    Mark multiple notifications as read
 * @access  Private
 */
router.put('/mark-read', auth, async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ message: 'Invalid notification IDs' });
    }
    
    const result = await Notification.updateMany(
      { _id: { $in: ids }, user: req.user.id },
      { isRead: true, updatedAt: Date.now() }
    );
    
    res.json({ 
      message: 'Notifications marked as read',
      updated: result.modifiedCount 
    });
  } catch (error) {
    console.error('Mark multiple as read error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   PUT api/notifications/mark-all-read
 * @desc    Mark all notifications as read
 * @access  Private
 */
router.put('/mark-all-read', auth, async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { user: req.user.id, isRead: false },
      { isRead: true, updatedAt: Date.now() }
    );
    
    res.json({ 
      message: 'All notifications marked as read',
      updated: result.modifiedCount 
    });
  } catch (error) {
    console.error('Mark all as read error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   DELETE api/notifications/:id
 * @desc    Delete a notification
 * @access  Private
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Delete notification error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   DELETE api/notifications/delete-multiple
 * @desc    Delete multiple notifications
 * @access  Private
 */
router.delete('/delete-multiple', auth, async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ message: 'Invalid notification IDs' });
    }
    
    const result = await Notification.deleteMany({
      _id: { $in: ids },
      user: req.user.id
    });
    
    res.json({ 
      message: 'Notifications deleted successfully',
      deleted: result.deletedCount 
    });
  } catch (error) {
    console.error('Delete multiple notifications error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   POST api/notifications/subscribe
 * @desc    Subscribe to push notifications
 * @access  Private
 */
router.post('/subscribe', auth, async (req, res) => {
  try {
    const { subscription } = req.body;
    
    // TODO: Store push subscription in database
    // For now, just acknowledge
    
    res.json({ message: 'Successfully subscribed to push notifications' });
  } catch (error) {
    console.error('Subscribe error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   DELETE api/notifications/unsubscribe
 * @desc    Unsubscribe from push notifications
 * @access  Private
 */
router.delete('/unsubscribe', auth, async (req, res) => {
  try {
    // TODO: Remove push subscription from database
    
    res.json({ message: 'Successfully unsubscribed from push notifications' });
  } catch (error) {
    console.error('Unsubscribe error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   PUT api/notifications/preferences
 * @desc    Update notification preferences
 * @access  Private
 */
router.put('/preferences', auth, async (req, res) => {
  try {
    const { email, push, types } = req.body;
    
    // TODO: Update user notification preferences in database
    
    res.json({ message: 'Notification preferences updated successfully' });
  } catch (error) {
    console.error('Update preferences error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;