const express = require('express');
const router = express.Router();
const Show = require('../models/Show');

// GET /api/shows - Get all shows
router.get('/', async (req, res) => {
  try {
    const { theaterId } = req.query;
    let query = {};
    
    // Validate and handle theaterId parameter
    if (theaterId) {
      // Check for invalid values like "[object Object]"
      if (theaterId === '[object Object]' || theaterId.includes('[object') || theaterId.includes('Object]')) {
        console.warn('Invalid theaterId received:', theaterId);
        return res.status(400).json({ 
          message: 'Invalid theater ID format',
          details: 'Theater ID must be a valid string, not an object'
        });
      }
      
      // Check if it's a valid MongoDB ObjectId format
      if (!/^[0-9a-fA-F]{24}$/.test(theaterId)) {
        console.warn('Invalid theaterId format:', theaterId);
        return res.status(400).json({ 
          message: 'Invalid theater ID format',
          details: 'Theater ID must be a valid MongoDB ObjectId'
        });
      }
      
      query['theaters.theater'] = theaterId;
    }
    
    console.log('Fetching shows with query:', query);
    const shows = await Show.find(query).populate('theaters.theater', 'name location');
    
    console.log(`Found ${shows.length} shows`);
    res.json(shows);
  } catch (error) {
    console.error('Error fetching shows:', error);
    res.status(500).json({ 
      message: 'Error fetching shows',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/shows/:id - Get a specific show
router.get('/:id', async (req, res) => {
  try {
    // Check if ID is provided and valid
    if (!req.params.id || req.params.id === 'undefined') {
      return res.status(400).json({ message: 'Show ID is required' });
    }

    // Check if ID is a valid MongoDB ObjectId (24 character hex string)
    if (!/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
      return res.status(400).json({ message: 'Invalid show ID format' });
    }

    const show = await Show.findById(req.params.id).populate('theaters.theater', 'name location screens');
    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }
    res.json(show);
  } catch (error) {
    console.error('Error fetching show:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid show ID' });
    }
    res.status(500).json({ message: 'Error fetching show' });
  }
});

module.exports = router; 