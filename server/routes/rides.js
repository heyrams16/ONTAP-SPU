const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Service = require('../models/Service');
const RouteMatcher = require('../utils/routeMatcher');
const authMiddleware = require('../middleware/auth');

// Ride Schema for seeded data
const rideSchema = new mongoose.Schema({
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  departureTime: { type: Date, required: true },
  seats: { type: Number, required: true },
  price: { type: Number, required: true },
  description: String,
  status: { type: String, enum: ['active', 'full', 'completed', 'cancelled'], default: 'active' },
  passengers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

const Ride = mongoose.models.Ride || mongoose.model('Ride', rideSchema);

/**
 * Rides/Carpooling API Routes (Via style with waypoints)
 */

// Get all seeded rides (simple list view)
router.get('/', async (req, res) => {
  try {
    const { search, destination, sort } = req.query;

    let query = {};

    // Search filter
    if (search) {
      query.$or = [
        { origin: { $regex: search, $options: 'i' } },
        { destination: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Destination type filter
    if (destination === 'airport') {
      query.destination = { $regex: 'airport|EWR|JFK|LGA', $options: 'i' };
    } else if (destination === 'nyc') {
      query.destination = { $regex: 'NYC|New York|Manhattan|Penn Station|Times Square', $options: 'i' };
    } else if (destination === 'campus') {
      query.destination = { $regex: 'SPU|Campus', $options: 'i' };
    }

    // Sort options
    let sortOption = { departureTime: 1 };
    if (sort === 'price-low') {
      sortOption = { price: 1 };
    } else if (sort === 'price-high') {
      sortOption = { price: -1 };
    }

    const rides = await Ride.find(query)
      .populate('driver', 'name email')
      .sort(sortOption);

    res.json(rides);
  } catch (error) {
    console.error('Error fetching rides:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search for matching rides (Via-style with zones and coordinates)
router.get('/search', async (req, res) => {
  try {
    const {
      from,
      to,
      date,
      seats = 1,
      fromZone,
      toZone,
      fromCoords,
      toCoords
    } = req.query;

    if (!from || !to) {
      return res.status(400).json({
        error: 'From and To locations are required'
      });
    }

    const departureDate = date ? new Date(date) : new Date();
    const seatsNeeded = parseInt(seats);

    // Parse coordinates if provided
    const fromCoordinates = fromCoords ? JSON.parse(fromCoords) : null;
    const toCoordinates = toCoords ? JSON.parse(toCoords) : null;

    const matchingRides = await RouteMatcher.findMatchingRides(
      from,
      to,
      departureDate,
      seatsNeeded,
      {
        fromZone,
        toZone,
        fromCoords: fromCoordinates,
        toCoords: toCoordinates
      }
    );

    res.json({
      success: true,
      searchQuery: {
        from,
        to,
        date: departureDate,
        seats: seatsNeeded,
        zones: { fromZone, toZone }
      },
      rides: matchingRides,
      count: matchingRides.length
    });
  } catch (error) {
    console.error('Error searching rides:', error);
    res.status(500).json({
      error: 'Failed to search rides',
      details: error.message
    });
  }
});

// Get popular routes
router.get('/popular-routes', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const routes = await RouteMatcher.getPopularRoutes(parseInt(limit));

    res.json({
      success: true,
      routes,
      count: routes.length
    });
  } catch (error) {
    console.error('Error fetching popular routes:', error);
    res.status(500).json({
      error: 'Failed to fetch popular routes',
      details: error.message
    });
  }
});

// Get upcoming rides from a location
router.get('/from/:location', async (req, res) => {
  try {
    const { location } = req.params;
    const { limit = 10 } = req.query;

    const rides = await RouteMatcher.getUpcomingRidesFrom(location, parseInt(limit));

    res.json({
      success: true,
      location,
      rides,
      count: rides.length
    });
  } catch (error) {
    console.error('Error fetching rides:', error);
    res.status(500).json({
      error: 'Failed to fetch rides',
      details: error.message
    });
  }
});

// Create a new ride offer - Via style (requires authentication)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const rideData = {
      ...req.body,
      category: 'rides',
      provider: req.userId,
      bookedSeats: 0,
      passengers: [],
      // Auto-generate title and description from route
      title: `Ride from ${req.body.route?.from} to ${req.body.route?.to}`,
      description: req.body.notes || `Ride pooling from ${req.body.route?.from} to ${req.body.route?.to}`,
      location: req.body.route?.from || '',
      availability: req.body.departureTime ? new Date(req.body.departureTime).toLocaleDateString() : 'TBD'
    };

    // Validate required ride fields
    if (!rideData.route || !rideData.route.from || !rideData.route.to) {
      return res.status(400).json({
        error: 'Route information (from and to) is required'
      });
    }

    if (!rideData.departureTime) {
      return res.status(400).json({
        error: 'Departure time is required'
      });
    }

    if (!rideData.seatsAvailable || rideData.seatsAvailable < 1) {
      return res.status(400).json({
        error: 'Number of available seats is required'
      });
    }

    const ride = new Service(rideData);
    await ride.save();

    await ride.populate('provider', 'name rating email');

    res.status(201).json({
      success: true,
      message: 'Ride offer created successfully',
      ride
    });
  } catch (error) {
    console.error('Error creating ride offer:', error);
    res.status(500).json({
      error: 'Failed to create ride offer',
      details: error.message
    });
  }
});

// Legacy endpoint for backward compatibility
router.post('/offer', authMiddleware, async (req, res) => {
  try {
    const rideData = {
      ...req.body,
      category: 'rides',
      provider: req.userId,
      bookedSeats: 0,
      passengers: []
    };

    // Validate required ride fields
    if (!rideData.route || !rideData.route.from || !rideData.route.to) {
      return res.status(400).json({
        error: 'Route information (from and to) is required'
      });
    }

    if (!rideData.departureTime) {
      return res.status(400).json({
        error: 'Departure time is required'
      });
    }

    if (!rideData.seatsAvailable || rideData.seatsAvailable < 1) {
      return res.status(400).json({
        error: 'Number of available seats is required'
      });
    }

    const ride = new Service(rideData);
    await ride.save();

    await ride.populate('provider', 'name rating email');

    res.status(201).json({
      success: true,
      message: 'Ride offer created successfully',
      ride
    });
  } catch (error) {
    console.error('Error creating ride offer:', error);
    res.status(500).json({
      error: 'Failed to create ride offer',
      details: error.message
    });
  }
});

// Request to join a ride (book seats)
router.post('/:rideId/request', authMiddleware, async (req, res) => {
  try {
    const { rideId } = req.params;
    const { seatsRequested = 1 } = req.body;
    const userId = req.userId;

    const ride = await Service.findById(rideId);

    if (!ride || ride.category !== 'rides') {
      return res.status(404).json({ error: 'Ride not found' });
    }

    // Check if user is the driver
    if (ride.provider.toString() === userId) {
      return res.status(400).json({ error: 'You cannot book your own ride' });
    }

    // Check seat availability
    const availableSeats = ride.seatsAvailable - ride.bookedSeats;
    if (availableSeats < seatsRequested) {
      return res.status(400).json({
        error: 'Not enough seats available',
        availableSeats
      });
    }

    // Check if user already requested this ride
    const existingRequest = ride.passengers.find(
      p => p.user.toString() === userId && p.bookingStatus !== 'cancelled'
    );

    if (existingRequest) {
      return res.status(400).json({ error: 'You already have a pending/confirmed booking for this ride' });
    }

    // Add passenger
    ride.passengers.push({
      user: userId,
      seatsBooked: seatsRequested,
      bookingStatus: 'pending'
    });

    ride.bookedSeats += seatsRequested;
    await ride.save();

    await ride.populate('passengers.user', 'name email');
    await ride.populate('provider', 'name email');

    res.json({
      success: true,
      message: 'Ride request sent successfully',
      ride,
      booking: ride.passengers[ride.passengers.length - 1]
    });
  } catch (error) {
    console.error('Error requesting ride:', error);
    res.status(500).json({
      error: 'Failed to request ride',
      details: error.message
    });
  }
});

// Confirm/reject a ride request (driver only)
router.put('/:rideId/booking/:bookingId/:action', authMiddleware, async (req, res) => {
  try {
    const { rideId, bookingId, action } = req.params;
    const userId = req.userId;

    if (!['confirm', 'reject'].includes(action)) {
      return res.status(400).json({ error: 'Invalid action. Use "confirm" or "reject"' });
    }

    const ride = await Service.findById(rideId);

    if (!ride || ride.category !== 'rides') {
      return res.status(404).json({ error: 'Ride not found' });
    }

    // Only the driver can confirm/reject
    if (ride.provider.toString() !== userId) {
      return res.status(403).json({ error: 'Only the ride provider can confirm or reject bookings' });
    }

    const booking = ride.passengers.id(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (action === 'confirm') {
      booking.bookingStatus = 'confirmed';
    } else {
      booking.bookingStatus = 'cancelled';
      ride.bookedSeats -= booking.seatsBooked;
    }

    await ride.save();
    await ride.populate('passengers.user', 'name email');

    res.json({
      success: true,
      message: `Booking ${action}ed successfully`,
      booking
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({
      error: 'Failed to update booking',
      details: error.message
    });
  }
});

// Get user's rides (as driver)
router.get('/my-rides', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    const rides = await Service.find({
      category: 'rides',
      provider: userId
    })
      .populate('passengers.user', 'name rating')
      .sort({ departureTime: 1 });

    res.json({
      success: true,
      rides,
      count: rides.length
    });
  } catch (error) {
    console.error('Error fetching user rides:', error);
    res.status(500).json({
      error: 'Failed to fetch rides',
      details: error.message
    });
  }
});

// Get user's bookings (as passenger)
router.get('/my-bookings', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    const rides = await Service.find({
      category: 'rides',
      'passengers.user': userId
    })
      .populate('provider', 'name rating')
      .sort({ departureTime: 1 });

    // Filter and format bookings
    const bookings = rides.map(ride => {
      const userBooking = ride.passengers.find(p => p.user._id.toString() === userId);
      return {
        ride: {
          _id: ride._id,
          route: ride.route,
          departureTime: ride.departureTime,
          price: ride.price,
          provider: ride.provider
        },
        booking: userBooking
      };
    });

    res.json({
      success: true,
      bookings,
      count: bookings.length
    });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({
      error: 'Failed to fetch bookings',
      details: error.message
    });
  }
});

module.exports = router;
