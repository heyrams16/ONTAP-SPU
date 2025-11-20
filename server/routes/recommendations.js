const express = require('express');
const router = express.Router();
const RecommendationEngine = require('../utils/recommendationEngine');
const authMiddleware = require('../middleware/auth');

/**
 * Recommendations API Routes
 *
 * Provides ML-based personalized recommendations
 */

// Get personalized recommendations for logged-in user
router.get('/personalized', authMiddleware, async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const userId = req.userId;

    const recommendations = await RecommendationEngine.getPersonalizedRecommendations(
      userId,
      parseInt(limit)
    );

    res.json({
      success: true,
      recommendations,
      count: recommendations.length
    });
  } catch (error) {
    console.error('Error fetching personalized recommendations:', error);
    res.status(500).json({
      error: 'Failed to fetch recommendations',
      details: error.message
    });
  }
});

// Get trending items (public - no auth required)
router.get('/trending', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const trending = await RecommendationEngine.getTrendingRecommendations(parseInt(limit));

    res.json({
      success: true,
      trending,
      count: trending.length
    });
  } catch (error) {
    console.error('Error fetching trending items:', error);
    res.status(500).json({
      error: 'Failed to fetch trending items',
      details: error.message
    });
  }
});

// Get recommendations for a specific category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 10 } = req.query;

    // Get userId if authenticated, otherwise null
    const userId = req.headers.authorization ? req.userId : null;

    const recommendations = await RecommendationEngine.getCategoryRecommendations(
      category,
      userId,
      parseInt(limit)
    );

    res.json({
      success: true,
      category,
      recommendations,
      count: recommendations.length
    });
  } catch (error) {
    console.error('Error fetching category recommendations:', error);
    res.status(500).json({
      error: 'Failed to fetch category recommendations',
      details: error.message
    });
  }
});

// Track user activity (requires authentication)
router.post('/track', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const activityData = req.body;

    await RecommendationEngine.trackActivity(userId, activityData);

    res.json({
      success: true,
      message: 'Activity tracked successfully'
    });
  } catch (error) {
    console.error('Error tracking activity:', error);
    res.status(500).json({
      error: 'Failed to track activity',
      details: error.message
    });
  }
});

// Get user's activity summary (for dashboard)
router.get('/activity/summary', authMiddleware, async (req, res) => {
  try {
    const UserActivity = require('../models/UserActivity');
    const userId = req.userId;

    const summary = await UserActivity.aggregate([
      { $match: { user: require('mongoose').Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          recentActivity: { $max: '$timestamp' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const totalActivities = await UserActivity.countDocuments({ user: userId });

    res.json({
      success: true,
      summary,
      totalActivities
    });
  } catch (error) {
    console.error('Error fetching activity summary:', error);
    res.status(500).json({
      error: 'Failed to fetch activity summary',
      details: error.message
    });
  }
});

module.exports = router;
