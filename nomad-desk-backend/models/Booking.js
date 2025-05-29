// nomad-desk-backend/models/Booking.js - UPDATED WITH GROUP BOOKING SUPPORT
const mongoose = require('mongoose');

const GroupParticipantSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['invited', 'accepted', 'declined', 'pending'],
    default: 'pending'
  },
  invitedAt: {
    type: Date,
    default: Date.now
  },
  respondedAt: {
    type: Date,
    default: null
  },
  invitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const BookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  workspace: {
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    photo: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      required: true
    }
  },
  date: {
    type: String, // Format: YYYY-MM-DD
    required: true
  },
  startTime: {
    type: String, // Format: HH:MM (24-hour)
    required: true
  },
  endTime: {
    type: String, // Format: HH:MM (24-hour)
    required: true
  },
  roomType: {
    type: String,
    required: true,
    enum: [
      'Individual Desk',
      'Group Study Room (2-4 people)',
      'Private Study Room',
      'Computer Station',
      'Reading Area',
      'Meeting Room',
      'Conference Room',
      'Phone Booth',
      'Lounge Area',
      'Large Conference Room (10+ people)', // New for groups
      'Event Space', // New for groups
      'Workshop Room' // New for groups
    ]
  },
  numberOfPeople: {
    type: Number,
    required: true,
    min: 1,
    max: 50, // Increased for group bookings
    default: 1
  },
  specialRequests: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no-show'],
    default: 'pending'
  },
  
  // === GROUP BOOKING FIELDS ===
  isGroupBooking: {
    type: Boolean,
    default: false,
    index: true
  },
  groupName: {
    type: String,
    default: '',
    maxlength: 100
  },
  groupDescription: {
    type: String,
    default: '',
    maxlength: 500
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // Only required if it's a group booking
    required: function() {
      return this.isGroupBooking;
    }
  },
  participants: [GroupParticipantSchema],
  maxParticipants: {
    type: Number,
    min: 1,
    max: 50,
    default: function() {
      return this.isGroupBooking ? 10 : 1;
    },
    validate: {
      validator: function(v) {
        if (this.isGroupBooking) {
          return v >= 2;
        }
        return v >= 1;
      },
      message: props => `${props.value} is not a valid number of participants`
    }
  },
  minParticipants: {
    type: Number,
    min: 1,
    default: function() {
      return this.isGroupBooking ? 2 : 1;
    }
  },
  inviteCode: {
    type: String,
    unique: true,
    sparse: true, // Only enforce uniqueness for non-null values
    index: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  groupSettings: {
    allowParticipantInvites: {
      type: Boolean,
      default: false
    },
    requireApproval: {
      type: Boolean,
      default: true
    },
    sendReminders: {
      type: Boolean,
      default: true
    }
  },
  
  // === EXISTING FIELDS ===
  totalPrice: {
    type: Number,
    default: 0
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['free', 'card', 'cash', 'points'],
    default: 'free'
  },
  checkInTime: {
    type: Date,
    default: null
  },
  checkOutTime: {
    type: Date,
    default: null
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  review: {
    type: String,
    default: ''
  },
  cancellationReason: {
    type: String,
    default: ''
  },
  cancellationDate: {
    type: Date,
    default: null
  },
  
  // Metadata
  metadata: {
    source: {
      type: String,
      enum: ['web', 'mobile', 'api'],
      default: 'web'
    },
    userAgent: {
      type: String,
      default: ''
    },
    ipAddress: {
      type: String,
      default: ''
    }
  },
  
  // Timestamps
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

// Update the updatedAt field before saving
BookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Set cancellation date if status is being changed to cancelled
  if (this.isModified('status') && this.status === 'cancelled' && !this.cancellationDate) {
    this.cancellationDate = Date.now();
  }
  
  // Generate invite code for group bookings
  if (this.isGroupBooking && !this.inviteCode) {
    this.inviteCode = generateInviteCode();
  }
  
  // Set organizer to user if it's a new group booking
  if (this.isNew && this.isGroupBooking && !this.organizer) {
    this.organizer = this.user;
  }
  
  // Validate group booking constraints
  if (this.isGroupBooking) {
    if (this.maxParticipants < this.minParticipants) {
      return next(new Error('Max participants cannot be less than min participants'));
    }
    if (this.numberOfPeople > this.maxParticipants) {
      return next(new Error('Number of people exceeds max participants'));
    }
  }
  
  next();
});

// === VIRTUALS ===

// Virtual for duration in minutes
BookingSchema.virtual('durationMinutes').get(function() {
  const start = new Date(`1970-01-01T${this.startTime}:00`);
  const end = new Date(`1970-01-01T${this.endTime}:00`);
  return Math.round((end - start) / (1000 * 60));
});

// Virtual for formatted date
BookingSchema.virtual('formattedDate').get(function() {
  return new Date(this.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Virtual for formatted time range
BookingSchema.virtual('formattedTimeRange').get(function() {
  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };
  
  return `${formatTime(this.startTime)} - ${formatTime(this.endTime)}`;
});

// Virtual to check if booking is active
BookingSchema.virtual('isActive').get(function() {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const currentTime = now.toTimeString().split(' ')[0].substring(0, 5);
  
  return this.status === 'confirmed' && 
         this.date === today && 
         this.startTime <= currentTime && 
         this.endTime > currentTime;
});

// Virtual to check if booking is upcoming
BookingSchema.virtual('isUpcoming').get(function() {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const currentTime = now.toTimeString().split(' ')[0].substring(0, 5);
  
  return this.status === 'confirmed' && 
         (this.date > today || (this.date === today && this.endTime > currentTime));
});

// Virtual to check if booking is past
BookingSchema.virtual('isPast').get(function() {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const currentTime = now.toTimeString().split(' ')[0].substring(0, 5);
  
  return this.date < today || 
         (this.date === today && this.endTime < currentTime) ||
         this.status === 'completed';
});

// NEW GROUP BOOKING VIRTUALS
BookingSchema.virtual('acceptedParticipants').get(function() {
  return this.participants.filter(p => p.status === 'accepted');
});

BookingSchema.virtual('pendingParticipants').get(function() {
  return this.participants.filter(p => p.status === 'pending' || p.status === 'invited');
});

BookingSchema.virtual('currentParticipantCount').get(function() {
  return this.acceptedParticipants.length + 1; // +1 for organizer
});

BookingSchema.virtual('hasMinimumParticipants').get(function() {
  return !this.isGroupBooking || this.currentParticipantCount >= this.minParticipants;
});

BookingSchema.virtual('canAcceptMoreParticipants').get(function() {
  return !this.isGroupBooking || this.currentParticipantCount < this.maxParticipants;
});

// === INDEXES ===
BookingSchema.index({ user: 1, date: -1, startTime: -1 });
BookingSchema.index({ 'workspace.id': 1, date: 1, startTime: 1 });
BookingSchema.index({ status: 1, date: 1 });
BookingSchema.index({ user: 1, status: 1 });
BookingSchema.index({ isGroupBooking: 1, status: 1 });
BookingSchema.index({ organizer: 1, date: -1 });
BookingSchema.index({ inviteCode: 1 });
BookingSchema.index({ 'participants.user': 1 });

// === STATIC METHODS ===

// Find conflicting bookings (updated for group bookings)
BookingSchema.statics.findConflicting = function(workspaceId, date, startTime, endTime, excludeId = null) {
  let query = {
    'workspace.id': workspaceId,
    date,
    status: { $in: ['confirmed', 'pending'] },
    $or: [
      {
        startTime: { $lt: endTime },
        endTime: { $gt: startTime }
      }
    ]
  };
  
  if (excludeId) {
    query._id = { $ne: excludeId };
  }
  
  return this.find(query);
};

// Get user's booking stats (updated for group bookings)
BookingSchema.statics.getUserStats = function(userId) {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const currentTime = now.toTimeString().split(' ')[0].substring(0, 5);
  
  return Promise.all([
    // Upcoming bookings (as user or participant)
    this.countDocuments({
      $or: [
        { user: userId },
        { 'participants.user': userId, 'participants.status': 'accepted' }
      ],
      status: { $in: ['confirmed', 'pending'] },
      $or: [
        { date: { $gt: today } },
        { date: today, endTime: { $gt: currentTime } }
      ]
    }),
    // Past bookings
    this.countDocuments({
      $or: [
        { user: userId },
        { 'participants.user': userId, 'participants.status': 'accepted' }
      ],
      $or: [
        { date: { $lt: today } },
        { date: today, endTime: { $lt: currentTime } },
        { status: 'completed' }
      ]
    }),
    // Total bookings
    this.countDocuments({
      $or: [
        { user: userId },
        { 'participants.user': userId, 'participants.status': 'accepted' }
      ]
    }),
    // Cancelled bookings
    this.countDocuments({
      $or: [
        { user: userId },
        { 'participants.user': userId }
      ],
      status: 'cancelled'
    }),
    // Group bookings organized
    this.countDocuments({
      organizer: userId,
      isGroupBooking: true
    }),
    // Group bookings participated in
    this.countDocuments({
      'participants.user': userId,
      'participants.status': 'accepted',
      isGroupBooking: true
    })
  ]).then(([upcoming, past, total, cancelled, groupsOrganized, groupsParticipated]) => ({
    upcoming,
    past,
    total,
    cancelled,
    groupsOrganized,
    groupsParticipated
  }));
};

// NEW GROUP BOOKING STATIC METHODS

// Find group bookings for a user (as organizer or participant)
BookingSchema.statics.findUserGroupBookings = function(userId, status = null) {
  let query = {
    isGroupBooking: true,
    $or: [
      { organizer: userId },
      { 'participants.user': userId }
    ]
  };
  
  if (status) {
    query.status = status;
  }
  
  return this.find(query)
    .populate('organizer', 'name email avatar')
    .populate('participants.user', 'name email avatar')
    .sort({ date: -1, startTime: -1 });
};

// Find group booking by invite code
BookingSchema.statics.findByInviteCode = function(inviteCode) {
  return this.findOne({ inviteCode, isGroupBooking: true })
    .populate('organizer', 'name email avatar')
    .populate('participants.user', 'name email avatar');
};

// Check if user can join group booking
BookingSchema.statics.canUserJoinGroup = function(bookingId, userId) {
  return this.findById(bookingId).then(booking => {
    if (!booking || !booking.isGroupBooking) return false;
    if (booking.organizer.toString() === userId) return false;
    if (booking.participants.some(p => p.user.toString() === userId)) return false;
    return booking.canAcceptMoreParticipants;
  });
};

// === HELPER FUNCTIONS ===

function generateInviteCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Ensure virtual fields are serialized
BookingSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Booking', BookingSchema);