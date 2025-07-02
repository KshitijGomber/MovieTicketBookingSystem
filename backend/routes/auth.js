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
router.get('/google', (req, res, next) => {
  const { redirect_uri } = req.query;
  const state = redirect_uri ? Buffer.from(JSON.stringify({ redirect_uri })).toString('base64') : undefined;
  
  const auth = passport.authenticate('google', { 
    scope: ['profile', 'email'],
    session: false,
    state,
    accessType: 'offline',
    prompt: 'consent'
  });
  
  auth(req, res, next);
});

router.get('/google/callback',
  (req, res, next) => {
    passport.authenticate('google', { 
      failureRedirect: `${process.env.FRONTEND_URL}/signin?error=oauth_failed`,
      session: false 
    }, (err, user, info) => {
      if (err) {
        console.error('OAuth error:', err);
        return res.redirect(`${process.env.FRONTEND_URL}/signin?error=oauth_error`);
      }
      if (!user) {
        return res.redirect(`${process.env.FRONTEND_URL}/signin?error=oauth_failed`);
      }
      
      // Generate JWT
      const token = jwt.sign(
        { 
          id: user._id, 
          name: user.name, 
          email: user.email,
          picture: user.profilePicture
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      // Get redirect URI from state
      let redirectUrl = `${process.env.FRONTEND_URL}/signin`;
      try {
        const state = req.query.state ? JSON.parse(Buffer.from(req.query.state, 'base64').toString()) : {};
        if (state.redirect_uri) {
          redirectUrl = state.redirect_uri;
        }
      } catch (e) {
        console.error('Error parsing state:', e);
      }
      
      // Add token to redirect URL
      const url = new URL(redirectUrl);
      url.searchParams.set('token', token);
      url.searchParams.set('name', encodeURIComponent(user.name));
      url.searchParams.set('email', encodeURIComponent(user.email));
      
      // Redirect back to frontend with token
      res.redirect(url.toString());
    })(req, res, next);
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