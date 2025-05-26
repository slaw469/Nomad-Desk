// nomad-desk-backend/models/GroupInvite.js - NEW GROUP INVITE MODEL
const mongoose = require('mongoose');

const GroupInviteSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
    index: true
  },
  inviter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  invitee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  inviteeEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'expired', 'cancelled'],
    default: 'pending',
    index: true
  },
  inviteMethod: {
    type: String,
    enum: ['email', 'in-app', 'link'],
    default: 'in-app'
  },
  personalMessage: {
    type: String,
    maxlength: 500,
    default: ''
  },
  expiresAt: {
    type: Date,
    default: function() {
      // Expire invites 7 days from creation or 1 hour before booking starts
      const weekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      return weekFromNow;
    },
    index: { expireAfterSeconds: 0 } // MongoDB TTL index
  },
  respondedAt: {
    type: Date,
    default: null
  },
  viewedAt: {
    type: Date,
    default: null
  },
  remindersSent: {
    type: Number,
    default: 0,
    max: 3
  },
  lastReminderSent: {
    type: Date,
    default: null
  },
  metadata: {
    userAgent: String,
    ipAddress: String,
    source: {
      type: String,
      enum: ['web', 'mobile', 'api'],
      default: 'web'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// === MIDDLEWARE ===

// Update timestamp on save
GroupInviteSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Set respondedAt when status changes from pending
  if (this.isModified('status') && 
      this.status !== 'pending' && 
      !this.respondedAt) {
    this.respondedAt = Date.now();
  }
  
  next();
});

// === INDEXES ===
GroupInviteSchema.index({ booking: 1, invitee: 1 }, { unique: true });
GroupInviteSchema.index({ inviter: 1, status: 1 });
GroupInviteSchema.index({ invitee: 1, status: 1 });
GroupInviteSchema.index({ inviteeEmail: 1, status: 1 });
GroupInviteSchema.index({ createdAt: -1 });
GroupInviteSchema.index({ expiresAt: 1 });

// === VIRTUALS ===

// Check if invite is expired
GroupInviteSchema.virtual('isExpired').get(function() {
  return this.expiresAt < new Date() || this.status === 'expired';
});

// Check if invite can be responded to
GroupInviteSchema.virtual('canRespond').get(function() {
  return this.status === 'pending' && !this.isExpired;
});

// Days until expiration
GroupInviteSchema.virtual('daysUntilExpiration').get(function() {
  if (this.isExpired) return 0;
  const now = new Date();
  const diffTime = this.expiresAt - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// === STATIC METHODS ===

// Find pending invites for a user
GroupInviteSchema.statics.findPendingForUser = function(userId) {
  return this.find({
    invitee: userId,
    status: 'pending',
    expiresAt: { $gt: new Date() }
  })
  .populate('booking', 'groupName date startTime endTime workspace')
  .populate('inviter', 'name email avatar')
  .sort({ createdAt: -1 });
};

// Find sent invites by a user
GroupInviteSchema.statics.findSentByUser = function(userId, bookingId = null) {
  let query = { inviter: userId };
  if (bookingId) {
    query.booking = bookingId;
  }
  
  return this.find(query)
    .populate('booking', 'groupName date startTime endTime workspace')
    .populate('invitee', 'name email avatar')
    .sort({ createdAt: -1 });
};

// Find invites for a specific booking
GroupInviteSchema.statics.findForBooking = function(bookingId) {
  return this.find({ booking: bookingId })
    .populate('inviter', 'name email avatar')
    .populate('invitee', 'name email avatar')
    .sort({ createdAt: -1 });
};

// Clean expired invites
GroupInviteSchema.statics.cleanExpiredInvites = function() {
  return this.updateMany(
    {
      status: 'pending',
      expiresAt: { $lt: new Date() }
    },
    {
      $set: { 
        status: 'expired',
        updatedAt: new Date()
      }
    }
  );
};

// Get invite statistics for a booking
GroupInviteSchema.statics.getBookingInviteStats = function(bookingId) {
  return this.aggregate([
    { $match: { booking: new mongoose.Types.ObjectId(bookingId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]).then(results => {
    const stats = {
      pending: 0,
      accepted: 0,
      declined: 0,
      expired: 0,
      cancelled: 0,
      total: 0
    };
    
    results.forEach(result => {
      stats[result._id] = result.count;
      stats.total += result.count;
    });
    
    return stats;
  });
};

// Find duplicate invites (same booking + invitee)
GroupInviteSchema.statics.findDuplicateInvite = function(bookingId, inviteeId) {
  return this.findOne({
    booking: bookingId,
    invitee: inviteeId,
    status: { $in: ['pending', 'accepted'] }
  });
};

// === INSTANCE METHODS ===

// Accept the invite
GroupInviteSchema.methods.accept = function() {
  this.status = 'accepted';
  this.respondedAt = new Date();
  return this.save();
};

// Decline the invite
GroupInviteSchema.methods.decline = function() {
  this.status = 'declined';
  this.respondedAt = new Date();
  return this.save();
};

// Cancel the invite
GroupInviteSchema.methods.cancel = function() {
  this.status = 'cancelled';
  this.updatedAt = new Date();
  return this.save();
};

// Mark as viewed
GroupInviteSchema.methods.markAsViewed = function() {
  if (!this.viewedAt) {
    this.viewedAt = new Date();
    return this.save();
  }
  return Promise.resolve(this);
};

// Send reminder (increment counter)
GroupInviteSchema.methods.sendReminder = function() {
  if (this.remindersSent < 3) {
    this.remindersSent += 1;
    this.lastReminderSent = new Date();
    return this.save();
  }
  return Promise.resolve(this);
};

// Check if can send reminder
GroupInviteSchema.methods.canSendReminder = function() {
  if (this.status !== 'pending' || this.isExpired) return false;
  if (this.remindersSent >= 3) return false;
  
  // Must wait at least 24 hours between reminders
  if (this.lastReminderSent) {
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return this.lastReminderSent < dayAgo;
  }
  
  // Must wait at least 2 hours after initial invite
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
  return this.createdAt < twoHoursAgo;
};

// Ensure virtual fields are serialized
GroupInviteSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('GroupInvite', GroupInviteSchema);