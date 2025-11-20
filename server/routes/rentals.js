const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

// Get all rental items
router.get('/', async (req, res) => {
  try {
    const { itemType, condition, minPrice, maxPrice, search, rentalPeriod } = req.query;

    let query = { category: 'rentals' };

    if (itemType) {
      query.itemType = itemType;
    }

    if (condition) {
      query.condition = condition;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const items = await Service.find(query)
      .populate('provider', 'name email')
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    console.error('Error fetching rental items:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single rental item
router.get('/:id', async (req, res) => {
  try {
    const item = await Service.findById(req.params.id)
      .populate('provider', 'name email');

    if (!item || item.category !== 'rentals') {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    console.error('Error fetching rental item:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create rental item
router.post('/', async (req, res) => {
  try {
    const newItem = new Service({
      ...req.body,
      category: 'rentals',
      provider: req.body.provider || req.body.ownerId || '691c3df79f366ab15b64c7e7' // Default user if not provided
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    console.error('Error creating rental item:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update rental item
router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedItem || updatedItem.category !== 'rental') {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating rental item:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete rental item
router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await Service.findByIdAndDelete(req.params.id);

    if (!deletedItem || deletedItem.category !== 'rental') {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting rental item:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
