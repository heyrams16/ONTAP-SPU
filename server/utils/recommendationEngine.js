const UserActivity = require('../models/UserActivity');
const Service = require('../models/Service');

/**
 * ML-Based Recommendation Engine
 *
 * Implements multiple recommendation strategies:
 * 1. Collaborative Filtering - "Users like you also viewed"
 * 2. Content-Based Filtering - "Similar to what you've seen"
 * 3. Category-Based - "Popular in categories you like"
 * 4. Trending Items - "What's hot right now"
 * 5. Personalized Mix - Combines all strategies
 */

class RecommendationEngine {
  /**
   * Get personalized recommendations for a user
   * @param {String} userId - User ID
   * @param {Number} limit - Number of recommendations
   * @returns {Array} - Recommended services
   */
  static async getPersonalizedRecommendations(userId, limit = 10) {
    try {
      // Get user's activity history
      const userActivities = await UserActivity.find({ user: userId })
        .sort({ timestamp: -1 })
        .limit(100);

      if (userActivities.length === 0) {
        // New user - return trending items
        return await this.getTrendingRecommendations(limit);
      }

      // Extract user's preferred categories
      const categoryPreferences = this.extractCategoryPreferences(userActivities);

      // Extract services user has interacted with
      const viewedServiceIds = userActivities
        .filter(a => a.service)
        .map(a => a.service.toString());

      // Get recommendations from different strategies
      const [
        collaborativeRecs,
        categoryRecs,
        trendingRecs
      ] = await Promise.all([
        this.getCollaborativeRecommendations(userId, viewedServiceIds, Math.ceil(limit * 0.4)),
        this.getCategoryBasedRecommendations(categoryPreferences, viewedServiceIds, Math.ceil(limit * 0.4)),
        this.getTrendingRecommendations(Math.ceil(limit * 0.2))
      ]);

      // Combine and deduplicate recommendations
      const allRecs = [...collaborativeRecs, ...categoryRecs, ...trendingRecs];
      const uniqueRecs = this.deduplicateRecommendations(allRecs);

      return uniqueRecs.slice(0, limit);
    } catch (error) {
      console.error('Error generating personalized recommendations:', error);
      return await this.getTrendingRecommendations(limit);
    }
  }

  /**
   * Collaborative Filtering - Find similar users and recommend what they liked
   */
  static async getCollaborativeRecommendations(userId, excludeServiceIds, limit) {
    try {
      // Find users who viewed similar services
      const userActivities = await UserActivity.find({
        user: userId,
        service: { $exists: true }
      }).limit(20);

      const userServiceIds = userActivities.map(a => a.service.toString());

      if (userServiceIds.length === 0) return [];

      // Find other users who viewed the same services
      const similarUserActivities = await UserActivity.aggregate([
        {
          $match: {
            service: { $in: userServiceIds.map(id => require('mongoose').Types.ObjectId(id)) },
            user: { $ne: require('mongoose').Types.ObjectId(userId) }
          }
        },
        {
          $group: {
            _id: '$user',
            commonServices: { $addToSet: '$service' },
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]);

      if (similarUserActivities.length === 0) return [];

      // Get services these similar users also liked
      const similarUserIds = similarUserActivities.map(u => u._id);

      const recommendations = await UserActivity.aggregate([
        {
          $match: {
            user: { $in: similarUserIds },
            service: { $exists: true },
            activityType: { $in: ['view', 'booking', 'favorite'] }
          }
        },
        {
          $group: {
            _id: '$service',
            score: { $sum: 1 }
          }
        },
        { $sort: { score: -1 } },
        { $limit: limit }
      ]);

      const serviceIds = recommendations
        .map(r => r._id)
        .filter(id => !excludeServiceIds.includes(id.toString()));

      return await Service.find({
        _id: { $in: serviceIds },
        isActive: true
      })
        .populate('provider', 'name rating')
        .limit(limit);
    } catch (error) {
      console.error('Error in collaborative filtering:', error);
      return [];
    }
  }

  /**
   * Category-Based Recommendations - Popular items in user's favorite categories
   */
  static async getCategoryBasedRecommendations(categoryPreferences, excludeServiceIds, limit) {
    try {
      if (!categoryPreferences || categoryPreferences.length === 0) return [];

      // Get top services in user's preferred categories
      const recommendations = await Service.find({
        category: { $in: categoryPreferences.map(c => c.category) },
        _id: { $nin: excludeServiceIds },
        isActive: true
      })
        .populate('provider', 'name rating')
        .sort({ rating: -1, totalBookings: -1 })
        .limit(limit);

      return recommendations;
    } catch (error) {
      console.error('Error in category-based recommendations:', error);
      return [];
    }
  }

  /**
   * Trending Recommendations - What's popular right now
   */
  static async getTrendingRecommendations(limit) {
    try {
      // Get services with recent activity
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const trendingServices = await UserActivity.aggregate([
        {
          $match: {
            timestamp: { $gte: sevenDaysAgo },
            service: { $exists: true },
            activityType: { $in: ['view', 'booking'] }
          }
        },
        {
          $group: {
            _id: '$service',
            trendScore: { $sum: 1 }
          }
        },
        { $sort: { trendScore: -1 } },
        { $limit: limit }
      ]);

      const serviceIds = trendingServices.map(t => t._id);

      return await Service.find({
        _id: { $in: serviceIds },
        isActive: true
      })
        .populate('provider', 'name rating')
        .limit(limit);
    } catch (error) {
      console.error('Error fetching trending recommendations:', error);
      // Fallback to highest rated services
      return await Service.find({ isActive: true })
        .populate('provider', 'name rating')
        .sort({ rating: -1, totalBookings: -1 })
        .limit(limit);
    }
  }

  /**
   * Extract category preferences from user activity
   */
  static extractCategoryPreferences(activities) {
    const categoryCount = {};

    activities.forEach(activity => {
      if (activity.category) {
        categoryCount[activity.category] = (categoryCount[activity.category] || 0) + 1;
      }
    });

    // Sort categories by frequency
    return Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([category, count]) => ({ category, count }));
  }

  /**
   * Remove duplicate recommendations
   */
  static deduplicateRecommendations(recommendations) {
    const seen = new Set();
    return recommendations.filter(rec => {
      const id = rec._id.toString();
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }

  /**
   * Track user activity
   */
  static async trackActivity(userId, activityData) {
    try {
      const activity = new UserActivity({
        user: userId,
        ...activityData,
        timestamp: new Date()
      });
      await activity.save();
      return activity;
    } catch (error) {
      console.error('Error tracking activity:', error);
    }
  }

  /**
   * Get recommendations for a specific category
   */
  static async getCategoryRecommendations(category, userId, limit = 10) {
    try {
      let excludeServiceIds = [];

      if (userId) {
        // Exclude services user has already viewed
        const viewedActivities = await UserActivity.find({
          user: userId,
          service: { $exists: true }
        }).limit(50);
        excludeServiceIds = viewedActivities.map(a => a.service.toString());
      }

      return await Service.find({
        category,
        _id: { $nin: excludeServiceIds },
        isActive: true
      })
        .populate('provider', 'name rating')
        .sort({ rating: -1, totalBookings: -1 })
        .limit(limit);
    } catch (error) {
      console.error('Error getting category recommendations:', error);
      return [];
    }
  }
}

module.exports = RecommendationEngine;
