const express = require('express');
const router = express.Router();
const Show = require('../models/Show');

// GET /api/shows - Get all shows
router.get('/', async (req, res) => {
  try {
    const shows = await Show.find();
    res.json(shows);
  } catch (error) {
    console.error('Error fetching shows:', error);
    res.status(500).json({ message: 'Error fetching shows' });
  }
});

// GET /api/shows/:id - Get a specific show
router.get('/:id', async (req, res) => {
  try {
    const show = await Show.findById(req.params.id);
    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }
    res.json(show);
  } catch (error) {
    console.error('Error fetching show:', error);
    res.status(500).json({ message: 'Error fetching show' });
  }
});

module.exports = router; 