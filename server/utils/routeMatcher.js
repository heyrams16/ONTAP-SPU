/**
 * Route Matching Algorithm for Ride Pooling
 * Similar to BlaBlaCar - matches riders with drivers on similar routes
 */

class RouteMatcher {
  /**
   * Find matching rides for a given route
   * @param {String} from - Starting location
   * @param {String} to - Destination
   * @param {Date} departureDate - Preferred departure date
   * @param {Number} seatsNeeded - Number of seats needed
   * @returns {Array} - Matching rides sorted by relevance
   */
  static async findMatchingRides(from, to, departureDate, seatsNeeded = 1) {
    const Service = require('../models/Service');

    try {
      // Normalize locations for better matching
      const normalizedFrom = this.normalizeLocation(from);
      const normalizedTo = this.normalizeLocation(to);

      // Find rides within date range (same day ±12 hours)
      const dateStart = new Date(departureDate);
      dateStart.setHours(dateStart.getHours() - 12);

      const dateEnd = new Date(departureDate);
      dateEnd.setHours(dateEnd.getHours() + 12);

      const rides = await Service.find({
        category: 'rides',
        isActive: true,
        departureTime: {
          $gte: dateStart,
          $lte: dateEnd
        },
        $expr: {
          $gte: [{ $subtract: ['$seatsAvailable', '$bookedSeats'] }, seatsNeeded]
        }
      }).populate('provider', 'name rating totalReviews');

      // Score and filter rides
      const scoredRides = rides.map(ride => {
        const score = this.calculateRouteMatchScore(
          normalizedFrom,
          normalizedTo,
          this.normalizeLocation(ride.route.from),
          this.normalizeLocation(ride.route.to),
          ride.route.waypoints || []
        );

        return {
          ...ride.toObject(),
          matchScore: score,
          availableSeats: ride.seatsAvailable - ride.bookedSeats
        };
      });

      // Filter rides with reasonable match score (> 0.5)
      const matchingRides = scoredRides.filter(ride => ride.matchScore > 0.5);

      // Sort by match score, then by price
      return matchingRides.sort((a, b) => {
        if (b.matchScore !== a.matchScore) {
          return b.matchScore - a.matchScore;
        }
        return a.price - b.price;
      });
    } catch (error) {
      console.error('Error finding matching rides:', error);
      return [];
    }
  }

  /**
   * Calculate how well a ride matches the requested route
   * @returns {Number} - Match score between 0 and 1
   */
  static calculateRouteMatchScore(reqFrom, reqTo, rideFrom, rideTo, waypoints = []) {
    let score = 0;

    // Exact match
    if (this.locationsMatch(reqFrom, rideFrom) && this.locationsMatch(reqTo, rideTo)) {
      return 1.0;
    }

    // From location match
    const fromMatch = this.calculateLocationSimilarity(reqFrom, rideFrom);
    score += fromMatch * 0.4;

    // To location match
    const toMatch = this.calculateLocationSimilarity(reqTo, rideTo);
    score += toMatch * 0.4;

    // Check if requested locations are on the route (waypoints)
    const onRoute = this.isOnRoute(reqFrom, reqTo, rideFrom, rideTo, waypoints);
    score += onRoute * 0.2;

    return Math.min(score, 1.0);
  }

  /**
   * Check if requested route is part of the ride's route
   */
  static isOnRoute(reqFrom, reqTo, rideFrom, rideTo, waypoints) {
    const allPoints = [rideFrom, ...waypoints, rideTo].map(p => this.normalizeLocation(p));

    const reqFromNorm = this.normalizeLocation(reqFrom);
    const reqToNorm = this.normalizeLocation(reqTo);

    const fromIndex = allPoints.findIndex(p => this.locationsMatch(p, reqFromNorm));
    const toIndex = allPoints.findIndex(p => this.locationsMatch(p, reqToNorm));

    // Check if both locations are on route and in correct order
    if (fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex) {
      return 1.0;
    }

    return 0;
  }

  /**
   * Calculate similarity between two locations
   */
  static calculateLocationSimilarity(loc1, loc2) {
    loc1 = this.normalizeLocation(loc1);
    loc2 = this.normalizeLocation(loc2);

    // Exact match
    if (this.locationsMatch(loc1, loc2)) return 1.0;

    // Partial match (contains)
    if (loc1.includes(loc2) || loc2.includes(loc1)) return 0.7;

    // Check for common words
    const words1 = loc1.split(' ');
    const words2 = loc2.split(' ');
    const commonWords = words1.filter(w => words2.includes(w) && w.length > 3);

    if (commonWords.length > 0) {
      return 0.5 + (commonWords.length * 0.1);
    }

    return 0;
  }

  /**
   * Normalize location string for matching
   */
  static normalizeLocation(location) {
    if (!location) return '';
    return location
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, ' ');
  }

  /**
   * Check if two locations match
   */
  static locationsMatch(loc1, loc2) {
    return this.normalizeLocation(loc1) === this.normalizeLocation(loc2);
  }

  /**
   * Get popular routes (for suggestions)
   */
  static async getPopularRoutes(limit = 10) {
    const Service = require('../models/Service');

    try {
      const routes = await Service.aggregate([
        {
          $match: {
            category: 'rides',
            isActive: true
          }
        },
        {
          $group: {
            _id: {
              from: '$route.from',
              to: '$route.to'
            },
            count: { $sum: 1 },
            avgPrice: { $avg: '$price' }
          }
        },
        { $sort: { count: -1 } },
        { $limit: limit }
      ]);

      return routes.map(r => ({
        from: r._id.from,
        to: r._id.to,
        rideCount: r.count,
        avgPrice: Math.round(r.avgPrice * 100) / 100
      }));
    } catch (error) {
      console.error('Error getting popular routes:', error);
      return [];
    }
  }

  /**
   * Get upcoming rides from a specific location
   */
  static async getUpcomingRidesFrom(location, limit = 10) {
    const Service = require('../models/Service');
    const normalizedLocation = this.normalizeLocation(location);

    try {
      const rides = await Service.find({
        category: 'rides',
        isActive: true,
        departureTime: { $gte: new Date() },
        $expr: { $gt: [{ $subtract: ['$seatsAvailable', '$bookedSeats'] }, 0] }
      }).populate('provider', 'name rating');

      // Filter by location match
      const matchingRides = rides.filter(ride => {
        const from = this.normalizeLocation(ride.route.from);
        return this.calculateLocationSimilarity(from, normalizedLocation) > 0.6;
      });

      return matchingRides
        .sort((a, b) => a.departureTime - b.departureTime)
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting upcoming rides:', error);
      return [];
    }
  }
}

module.exports = RouteMatcher;
