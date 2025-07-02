const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/User');

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }
    const user = new User({ 
      username: name.replace(/\s+/g, '').toLowerCase(),
      name,
      email, 
      password 
    });
    await user.save();
    const token = jwt.sign({ id: user._id, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name,
        email: user.email 
      } 
    });
  } catch (err) {
    res.status(500).json({ message: 'Error signing up', error: err.message });
  }
});

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    session: false
  })
);

router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/login',
    session: false 
  }),
  async (req, res) => {
    try {
      // Generate JWT
      const token = jwt.sign(
        { id: req.user._id, name: req.user.name, email: req.user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
      
      // Redirect back to frontend with token
      res.redirect(`${process.env.FRONTEND_URL}/signin?token=${token}&name=${encodeURIComponent(req.user.name)}&email=${encodeURIComponent(req.user.email)}`);
    } catch (err) {
      console.error('Error in Google OAuth callback:', err);
      res.redirect(`${process.env.FRONTEND_URL}/signin?error=oauth_failed`);
    }
  }
);

// POST /api/auth/signin
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Error signing in', error: err.message });
  }
});

module.exports = router; 