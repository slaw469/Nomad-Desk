const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  workspace: {
    type: String,
    required: true,
    ref: 'Workspace'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 1000
  }
}, {
  timestamps: true
});

// Add compound index to prevent multiple reviews for the same booking
reviewSchema.index({ booking: 1 }, { unique: true });

// Add index for workspace to speed up rating calculations
reviewSchema.index({ workspace: 1 });

// Static method to calculate average rating for a workspace
reviewSchema.statics.calculateAverageRating = async function(workspaceId) {
  const result = await this.aggregate([
    { $match: { workspace: workspaceId } },
    { 
      $group: {
        _id: '$workspace',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  return result.length > 0 
    ? { 
        averageRating: Math.round(result[0].averageRating * 10) / 10, // Round to 1 decimal
        totalReviews: result[0].totalReviews 
      }
    : { averageRating: 0, totalReviews: 0 };
};

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review; 