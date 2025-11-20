const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Service = require('../models/Service');
const authMiddleware = require('../middleware/auth');

// Get all services with filters
router.get('/', async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, sort } = req.query;

    let query = { isActive: true };

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Search in title and description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price-low') sortOption = { price: 1 };
    if (sort === 'price-high') sortOption = { price: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };

    const services = await Service.find(query)
      .populate('provider', 'name rating totalReviews')
      .sort(sortOption);

    res.json({ services });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Get single service
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('provider', 'name email phone rating totalReviews')
      .populate('reviews.user', 'name');

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json({ service });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Create new service (requires authentication)
router.post('/', authMiddleware, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').isIn(['rides', 'tutoring', 'errands', 'campus-tasks', 'marketplace', 'rentals']).withMessage('Invalid category'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('availability').trim().notEmpty().withMessage('Availability is required'),
  body('location').trim().notEmpty().withMessage('Location is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const service = new Service({
      ...req.body,
      provider: req.userId
    });

    await service.save();

    res.status(201).json({
      message: 'Service created successfully',
      service
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Update service
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    // Check if user is the provider
    if (service.provider.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this service' });
    }

    Object.assign(service, req.body);
    await service.save();

    res.json({ message: 'Service updated successfully', service });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Delete service
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    if (service.provider.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this service' });
    }

    await service.deleteOne();

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Add review to service
router.post('/:id/reviews', authMiddleware, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().trim()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    // Check if user already reviewed
    const existingReview = service.reviews.find(
      review => review.user.toString() === req.userId.toString()
    );

    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this service' });
    }

    service.reviews.push({
      user: req.userId,
      rating: req.body.rating,
      comment: req.body.comment
    });

    // Update service rating
    const totalRating = service.reviews.reduce((sum, review) => sum + review.rating, 0);
    service.rating = totalRating / service.reviews.length;

    await service.save();

    res.json({ message: 'Review added successfully', service });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

module.exports = router;
