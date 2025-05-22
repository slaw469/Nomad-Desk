// nomad-desk-backend/models/Favorite.js
const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
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
    type: {
      type: String,
      required: true
    },
    photo: {
      type: String,
      default: ''
    },
    coordinates: {
      lat: {
        type: Number,
        required: true
      },
      lng: {
        type: Number,
        required: true
      }
    },
    rating: {
      type: Number,
      min: 0,
      max: 5
    },
    price: {
      type: String,
      default: 'Free'
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

// Update the updatedAt field before saving
FavoriteSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Ensure a user can't favorite the same workspace multiple times
FavoriteSchema.index({ user: 1, 'workspace.id': 1 }, { unique: true });

// Virtual for formatted creation date
FavoriteSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Ensure virtual fields are serialized
FavoriteSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Favorite', FavoriteSchema);