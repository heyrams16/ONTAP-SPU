const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Store magic links temporarily (in production, use Redis or database)
const magicLinkStore = new Map();

// Request magic link
router.post('/request', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Validate .edu email
    if (!email.endsWith('.edu')) {
      return res.status(400).json({ error: 'Please use your university (.edu) email' });
    }

    // Check if user exists, if not create a minimal profile
    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Create a new user with minimal info
      // They can complete their profile after verification
      user = new User({
        email: email.toLowerCase(),
        name: email.split('@')[0], // Use email prefix as temporary name
        password: Math.random().toString(36).slice(-12), // Random password they won't use
        studentId: `TEMP-${Date.now()}`, // Temporary student ID
        phone: 'Not provided', // Temporary phone
        isVerified: false
      });
      await user.save();
    }

    // Generate magic link token (expires in 15 minutes)
    const magicToken = jwt.sign(
      { userId: user._id, email: user.email, type: 'magic-link' },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    // Store the token
    magicLinkStore.set(magicToken, {
      userId: user._id,
      email: user.email,
      createdAt: Date.now()
    });

    // Clean up expired tokens (older than 15 minutes)
    const fifteenMinutesAgo = Date.now() - (15 * 60 * 1000);
    for (const [token, data] of magicLinkStore.entries()) {
      if (data.createdAt < fifteenMinutesAgo) {
        magicLinkStore.delete(token);
      }
    }

    // In production, send this via email
    // For now, we'll return it in the response for development
    const magicLink = `${process.env.CLIENT_URL || 'http://10.0.0.203:3000'}/verify-magic-link?token=${magicToken}`;

    console.log('\n🔐 Magic Link Generated:');
    console.log('Email:', email);
    console.log('Link:', magicLink);
    console.log('Expires in: 15 minutes\n');

    res.json({
      message: 'Magic link sent to your email',
      // In production, don't send the link in response
      // For development, we include it
      magicLink: magicLink,
      email: email
    });

  } catch (error) {
    console.error('Magic link request error:', error);
    res.status(500).json({ error: 'Failed to generate magic link' });
  }
});

// Verify magic link and login
router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    // Verify the token is valid
    const tokenData = magicLinkStore.get(token);
    if (!tokenData) {
      return res.status(401).json({ error: 'Invalid or expired magic link' });
    }

    // Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      magicLinkStore.delete(token);
      return res.status(401).json({ error: 'Invalid or expired magic link' });
    }

    if (decoded.type !== 'magic-link') {
      return res.status(401).json({ error: 'Invalid token type' });
    }

    // Get user
    const user = await User.findById(decoded.userId);
    if (!user) {
      magicLinkStore.delete(token);
      return res.status(401).json({ error: 'User not found' });
    }

    // Mark user as verified
    if (!user.isVerified) {
      user.isVerified = true;
      await user.save();
    }

    // Delete the used token
    magicLinkStore.delete(token);

    // Generate long-lived auth token
    const authToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token: authToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        studentId: user.studentId,
        isVerified: user.isVerified,
        rating: user.rating
      }
    });

  } catch (error) {
    console.error('Magic link verification error:', error);
    res.status(500).json({ error: 'Failed to verify magic link' });
  }
});

// Check if token is valid (without consuming it)
router.get('/check/:token', async (req, res) => {
  try {
    const { token } = req.params;

    const tokenData = magicLinkStore.get(token);
    if (!tokenData) {
      return res.json({ valid: false });
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET);
      res.json({ valid: true, email: tokenData.email });
    } catch (err) {
      magicLinkStore.delete(token);
      res.json({ valid: false });
    }
  } catch (error) {
    res.json({ valid: false });
  }
});

module.exports = router;
