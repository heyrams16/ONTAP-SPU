const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const authMiddleware = require('../middleware/auth');

// Get all bookings for current user
router.get('/my-bookings', authMiddleware, async (req, res) => {
  try {
    const { type } = req.query; // 'customer' or 'provider'

    let query = {};
    if (type === 'customer') {
      query.customer = req.userId;
    } else if (type === 'provider') {
      query.provider = req.userId;
    } else {
      query.$or = [{ customer: req.userId }, { provider: req.userId }];
    }

    const bookings = await Booking.find(query)
      .populate('service', 'title category')
      .populate('provider', 'name email phone')
      .populate('customer', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Get single booking
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('service')
      .populate('provider', 'name email phone rating')
      .populate('customer', 'name email phone rating');

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check if user is involved in this booking
    if (booking.customer.toString() !== req.userId.toString() &&
        booking.provider.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: 'Not authorized to view this booking' });
    }

    res.json({ booking });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Create new booking
router.post('/', authMiddleware, [
  body('serviceId').notEmpty().withMessage('Service ID is required'),
  body('scheduledDate').isISO8601().withMessage('Valid scheduled date is required'),
  body('duration').isNumeric().withMessage('Duration must be a number'),
  body('meetingLocation').trim().notEmpty().withMessage('Meeting location is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { serviceId, scheduledDate, duration, notes, meetingLocation } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    // Can't book your own service
    if (service.provider.toString() === req.userId.toString()) {
      return res.status(400).json({ error: 'You cannot book your own service' });
    }

    // Calculate total price
    let totalPrice = service.price;
    if (service.priceType === 'hourly') {
      totalPrice = service.price * (duration / 60);
    }

    const booking = new Booking({
      service: serviceId,
      provider: service.provider,
      customer: req.userId,
      scheduledDate,
      duration,
      totalPrice,
      notes,
      meetingLocation
    });

    await booking.save();

    // Update service total bookings
    service.totalBookings += 1;
    await service.save();

    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Update booking status
router.patch('/:id/status', authMiddleware, [
  body('status').isIn(['pending', 'accepted', 'completed', 'cancelled']).withMessage('Invalid status')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Only provider can accept/complete bookings
    // Both customer and provider can cancel
    const isProvider = booking.provider.toString() === req.userId.toString();
    const isCustomer = booking.customer.toString() === req.userId.toString();

    if (!isProvider && !isCustomer) {
      return res.status(403).json({ error: 'Not authorized to update this booking' });
    }

    const { status } = req.body;

    if ((status === 'accepted' || status === 'completed') && !isProvider) {
      return res.status(403).json({ error: 'Only the provider can accept or complete bookings' });
    }

    booking.status = status;
    await booking.save();

    res.json({ message: 'Booking status updated successfully', booking });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

module.exports = router;
