const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

// Get all marketplace items
router.get('/', async (req, res) => {
  try {
    const { itemType, condition, minPrice, maxPrice, search } = req.query;

    let query = { category: 'marketplace' };

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
    console.error('Error fetching marketplace items:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single marketplace item
router.get('/:id', async (req, res) => {
  try {
    const item = await Service.findById(req.params.id)
      .populate('provider', 'name email');

    if (!item || item.category !== 'marketplace') {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    console.error('Error fetching marketplace item:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create marketplace item
router.post('/', async (req, res) => {
  try {
    const newItem = new Service({
      ...req.body,
      category: 'marketplace',
      provider: req.body.provider || req.body.sellerId || '691c3df79f366ab15b64c7e7' // Default user if not provided
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    console.error('Error creating marketplace item:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update marketplace item
router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedItem || updatedItem.category !== 'marketplace') {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating marketplace item:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete marketplace item
router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await Service.findByIdAndDelete(req.params.id);

    if (!deletedItem || deletedItem.category !== 'marketplace') {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting marketplace item:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
