// nomad-desk-backend/models/Notification.js
const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['message', 'booking', 'review', 'system', 'connection', 'session'],
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true
  },
  actionLink: {
    type: String,
    default: null
  },
  actionText: {
    type: String,
    default: null
  },
  sender: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String,
    avatar: String
  },
  relatedBooking: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking'
    },
    workspaceName: String,
    date: String,
    time: String
  },
  relatedConnection: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Connection'
    },
    userName: String,
    action: {
      type: String,
      enum: ['request', 'accepted', 'rejected']
    }
  },
  relatedSession: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StudySession'
    },
    title: String,
    date: String,
    time: String
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
NotificationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Compound indexes for efficient querying
NotificationSchema.index({ user: 1, createdAt: -1 });
NotificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });
NotificationSchema.index({ user: 1, type: 1, createdAt: -1 });

// Virtual for formatted creation date
NotificationSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

// Static method to create notification
NotificationSchema.statics.createNotification = async function(data) {
  const notification = new this(data);
  await notification.save();
  
  // Emit real-time notification if WebSocket is available
  if (global.io) {
    const userSocketId = global.userSockets.get(data.user.toString());
    if (userSocketId) {
      global.io.to(userSocketId).emit('notification', notification);
    }
  }
  
  return notification;
};

// Static method to get notification stats
NotificationSchema.statics.getStats = async function(userId) {
  const [total, unread, byType] = await Promise.all([
    this.countDocuments({ user: userId }),
    this.countDocuments({ user: userId, isRead: false }),
    this.aggregate([
      { $match: { user: mongoose.Types.ObjectId(userId) } },
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ])
  ]);
  
  const byTypeMap = byType.reduce((acc, item) => {
    acc[item._id] = item.count;
    return acc;
  }, {});
  
  return { total, unread, byType: byTypeMap };
};

// Ensure virtual fields are serialized
NotificationSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Notification', NotificationSchema);

// ===================================
// nomad-desk-backend/routes/notificationRoutes.js
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
    const stats = await Notification.getStats(req.user.id);
    res.json(stats);
  } catch (error) {
    console.error('Get notification stats error:', error.message);
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

// ===================================
// nomad-desk-backend/utils/notificationHelpers.js
// ===================================

const Notification = require('../models/Notification');

/**
 * Create a booking notification
 */
const createBookingNotification = async (userId, booking, type = 'confirmed') => {
  const messages = {
    confirmed: {
      title: 'Booking Confirmed',
      message: `Your booking for ${booking.workspace.name} on ${booking.date} has been confirmed.`
    },
    cancelled: {
      title: 'Booking Cancelled',
      message: `Your booking for ${booking.workspace.name} on ${booking.date} has been cancelled.`
    },
    reminder: {
      title: 'Booking Reminder',
      message: `Reminder: You have a booking at ${booking.workspace.name} tomorrow at ${booking.startTime}.`
    }
  };

  const config = messages[type] || messages.confirmed;

  return await Notification.createNotification({
    user: userId,
    type: 'booking',
    title: config.title,
    message: config.message,
    actionLink: `/workspaces/map/${booking.workspace.id}`,
    actionText: 'View Booking',
    relatedBooking: {
      id: booking._id,
      workspaceName: booking.workspace.name,
      date: booking.date,
      time: booking.startTime
    }
  });
};

/**
 * Create a connection notification
 */
const createConnectionNotification = async (userId, connection, type = 'request') => {
  const messages = {
    request: {
      title: 'New Connection Request',
      message: `${connection.sender.name} wants to connect with you.`
    },
    accepted: {
      title: 'Connection Accepted',
      message: `${connection.recipient.name} accepted your connection request.`
    }
  };

  const config = messages[type] || messages.request;

  return await Notification.createNotification({
    user: userId,
    type: 'connection',
    title: config.title,
    message: config.message,
    actionLink: '/network',
    actionText: type === 'request' ? 'View Request' : 'View Connection',
    sender: {
      id: connection.sender._id,
      name: connection.sender.name,
      avatar: connection.sender.avatar
    },
    relatedConnection: {
      id: connection._id,
      userName: type === 'request' ? connection.sender.name : connection.recipient.name,
      action: type
    }
  });
};

/**
 * Create a message notification
 */
const createMessageNotification = async (userId, sender, messagePreview) => {
  return await Notification.createNotification({
    user: userId,
    type: 'message',
    title: 'New Message',
    message: `${sender.name} sent you a message: "${messagePreview}"`,
    actionLink: `/messages/${sender._id}`,
    actionText: 'Reply',
    sender: {
      id: sender._id,
      name: sender.name,
      avatar: sender.avatar
    }
  });
};

/**
 * Create a system notification
 */
const createSystemNotification = async (userId, title, message, actionLink = null) => {
  return await Notification.createNotification({
    user: userId,
    type: 'system',
    title,
    message,
    actionLink,
    actionText: actionLink ? 'Learn More' : null
  });
};

module.exports = {
  createBookingNotification,
  createConnectionNotification,
  createMessageNotification,
  createSystemNotification
};