const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const StudentProfile = require('../models/StudentProfile');
const authMiddleware = require('../middleware/auth');

// Get all profiles (College Zone)
router.get('/', async (req, res) => {
  try {
    const { university, major, year, interests, search } = req.query;

    let query = { isActive: true };

    if (university) query.university = university;
    if (major) query.major = new RegExp(major, 'i');
    if (year) query.year = year;
    if (interests) {
      query.areasOfInterest = { $in: interests.split(',') };
    }
    if (search) {
      query.$or = [
        { bio: { $regex: search, $options: 'i' } },
        { major: { $regex: search, $options: 'i' } },
        { areasOfInterest: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const profiles = await StudentProfile.find(query)
      .populate('user', 'name email rating')
      .sort({ createdAt: -1 });

    res.json({ profiles });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Get single profile by ID
router.get('/:id', async (req, res) => {
  try {
    const profile = await StudentProfile.findById(req.params.id)
      .populate('user', 'name email phone rating totalReviews')
      .populate('connections', 'name email');

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({ profile });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Get current user's profile
router.get('/me/profile', authMiddleware, async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.userId })
      .populate('user', 'name email phone rating')
      .populate('connections', 'name email');

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({ profile });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Create profile
router.post('/', authMiddleware, [
  body('major').trim().notEmpty().withMessage('Major is required'),
  body('year').isIn(['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate']).withMessage('Invalid year')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check if profile already exists
    const existingProfile = await StudentProfile.findOne({ user: req.userId });
    if (existingProfile) {
      return res.status(400).json({ error: 'Profile already exists' });
    }

    const profile = new StudentProfile({
      user: req.userId,
      ...req.body
    });

    await profile.save();

    const populatedProfile = await StudentProfile.findById(profile._id)
      .populate('user', 'name email');

    res.status(201).json({
      message: 'Profile created successfully',
      profile: populatedProfile
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Update profile
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const profile = await StudentProfile.findById(req.params.id);

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Check if user owns this profile
    if (profile.user.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this profile' });
    }

    Object.assign(profile, req.body);
    await profile.save();

    const updatedProfile = await StudentProfile.findById(profile._id)
      .populate('user', 'name email');

    res.json({ message: 'Profile updated successfully', profile: updatedProfile });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Add connection
router.post('/:id/connect', authMiddleware, async (req, res) => {
  try {
    const targetProfile = await StudentProfile.findById(req.params.id);
    const myProfile = await StudentProfile.findOne({ user: req.userId });

    if (!targetProfile || !myProfile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Check if already connected
    if (myProfile.connections.includes(targetProfile.user)) {
      return res.status(400).json({ error: 'Already connected' });
    }

    myProfile.connections.push(targetProfile.user);
    await myProfile.save();

    res.json({ message: 'Connection added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

module.exports = router;
