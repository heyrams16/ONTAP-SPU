const mongoose = require('mongoose');

/**
 * User Activity Model - Tracks user interactions for ML-based recommendations
 *
 * This model stores:
 * - Service views
 * - Search queries
 * - Bookings
 * - Category preferences
 * - Click patterns
 *
 * Used for:
 * - Collaborative filtering (user-based recommendations)
 * - Content-based filtering (similar items)
 * - Personalized homepage
 */

const userActivitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  activityType: {
    type: String,
    enum: ['view', 'search', 'booking', 'click', 'favorite'],
    required: true
  },
  // For service views, clicks, bookings
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  },
  // Service category (for tracking category preferences)
  category: {
    type: String,
    enum: ['rides', 'tutoring', 'errands', 'campus-tasks', 'marketplace', 'rentals']
  },
  // Search query (for search-based recommendations)
  searchQuery: {
    type: String
  },
  // Metadata for analysis
  metadata: {
    // Time spent on page (in seconds)
    timeSpent: Number,
    // Price range viewed
    priceRange: {
      min: Number,
      max: Number
    },
    // Filters applied
    filters: mongoose.Schema.Types.Mixed
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Compound index for efficient querying
userActivitySchema.index({ user: 1, timestamp: -1 });
userActivitySchema.index({ user: 1, activityType: 1 });
userActivitySchema.index({ category: 1, timestamp: -1 });

module.exports = mongoose.model('UserActivity', userActivitySchema);
