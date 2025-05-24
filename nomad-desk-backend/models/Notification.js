// nomad-desk-backend/models/Notification.js - FIXED
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

// FIXED: Static method to get notification stats
NotificationSchema.statics.getStats = async function(userId) {
  try {
    console.log('Getting stats for user:', userId);
    
    // Just use the userId as is - Mongoose will handle the conversion
    const [total, unread, byType] = await Promise.all([
      this.countDocuments({ user: userId }),
      this.countDocuments({ user: userId, isRead: false }),
      this.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(userId) } },
        { $group: { _id: '$type', count: { $sum: 1 } } }
      ])
    ]);
    
    console.log('Stats results:', { total, unread, byType });
    
    const byTypeMap = byType.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});
    
    return { total, unread, byType: byTypeMap };
  } catch (error) {
    console.error('Error in getStats:', error);
    console.error('UserId:', userId, 'Type:', typeof userId);
    // Return default stats if there's an error
    return { total: 0, unread: 0, byType: {} };
  }
};

// Ensure virtual fields are serialized
NotificationSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Notification', NotificationSchema);