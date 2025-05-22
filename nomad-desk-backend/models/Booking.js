// nomad-desk-backend/models/Booking.js
const mongoose = require('mongoose');

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
      'Lounge Area'
    ]
  },
  numberOfPeople: {
    type: Number,
    required: true,
    min: 1,
    max: 20,
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

// Update the updatedAt field before saving
BookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Set cancellation date if status is being changed to cancelled
  if (this.isModified('status') && this.status === 'cancelled' && !this.cancellationDate) {
    this.cancellationDate = Date.now();
  }
  
  next();
});

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

// Index for efficient queries
BookingSchema.index({ user: 1, date: -1, startTime: -1 });
BookingSchema.index({ 'workspace.id': 1, date: 1, startTime: 1 });
BookingSchema.index({ status: 1, date: 1 });
BookingSchema.index({ user: 1, status: 1 });

// Ensure virtual fields are serialized
BookingSchema.set('toJSON', {
  virtuals: true
});

// Static method to find conflicting bookings
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

// Static method to get user's booking stats
BookingSchema.statics.getUserStats = function(userId) {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const currentTime = now.toTimeString().split(' ')[0].substring(0, 5);
  
  return Promise.all([
    // Upcoming bookings
    this.countDocuments({
      user: userId,
      status: { $in: ['confirmed', 'pending'] },
      $or: [
        { date: { $gt: today } },
        { date: today, endTime: { $gt: currentTime } }
      ]
    }),
    // Past bookings
    this.countDocuments({
      user: userId,
      $or: [
        { date: { $lt: today } },
        { date: today, endTime: { $lt: currentTime } },
        { status: 'completed' }
      ]
    }),
    // Total bookings
    this.countDocuments({ user: userId }),
    // Cancelled bookings
    this.countDocuments({ user: userId, status: 'cancelled' })
  ]).then(([upcoming, past, total, cancelled]) => ({
    upcoming,
    past,
    total,
    cancelled
  }));
};

module.exports = mongoose.model('Booking', BookingSchema);