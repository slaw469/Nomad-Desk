const mongoose = require('mongoose');

const workspaceSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  photo: {
    type: String
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  amenities: [{
    type: String
  }],
  description: String,
  openingHours: {
    type: Map,
    of: {
      open: String,
      close: String
    }
  },
  pricePerHour: {
    type: Number,
    default: 0
  },
  capacity: {
    type: Number,
    default: 1
  },
  features: [{
    type: String
  }],
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
}, {
  timestamps: true
});

// Add index for location-based queries
workspaceSchema.index({ location: '2dsphere' });

// Add index for searching by name
workspaceSchema.index({ name: 'text' });

// Virtual for average rating
workspaceSchema.virtual('averageRating').get(function() {
  return this.totalReviews > 0 ? this.rating / this.totalReviews : 0;
});

// Method to update rating
workspaceSchema.methods.updateRating = async function(newRating) {
  this.rating = ((this.rating * this.totalReviews) + newRating) / (this.totalReviews + 1);
  this.totalReviews += 1;
  await this.save();
};

const Workspace = mongoose.model('Workspace', workspaceSchema);

module.exports = Workspace; 