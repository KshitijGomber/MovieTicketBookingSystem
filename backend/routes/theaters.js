const express = require('express');
const router = express.Router();
const Theater = require('../models/Theater');
const Showtime = require('../models/ShowTime');
const Show = require('../models/Show');

// GET /api/theaters - Get all theaters with optional filtering
router.get('/', async (req, res) => {
  try {
    const { city, amenities, search, page = 1, limit = 10 } = req.query;
    const query = { isActive: true };
    
    // Filter by city
    if (city) {
      query['location.city'] = new RegExp(city, 'i');
    }
    
    // Filter by amenities
    if (amenities) {
      const amenityList = amenities.split(',');
      query.amenities = { $in: amenityList };
    }
    
    // Search by name or location
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { 'location.address': new RegExp(search, 'i') },
        { 'location.city': new RegExp(search, 'i') }
      ];
    }
    
    const skip = (page - 1) * limit;
    const theaters = await Theater.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ name: 1 });
    
    const total = await Theater.countDocuments(query);
    
    res.json({
      theaters,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: theaters.length,
        totalRecords: total
      }
    });
  } catch (error) {
    console.error('Error fetching theaters:', error);
    res.status(500).json({ message: 'Error fetching theaters', error: error.message });
  }
});

// GET /api/theaters/:id - Get specific theater details
router.get('/:id', async (req, res) => {
  try {
    const theater = await Theater.findById(req.params.id);
    if (!theater) {
      return res.status(404).json({ message: 'Theater not found' });
    }
    res.json(theater);
  } catch (error) {
    console.error('Error fetching theater:', error);
    res.status(500).json({ message: 'Error fetching theater', error: error.message });
  }
});

// GET /api/theaters/:id/showtimes - Get theater-specific showtimes
router.get('/:id/showtimes', async (req, res) => {
  try {
    const { date, movieId } = req.query;
    const query = { theater: req.params.id };
    
    // Filter by date
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.showDate = { $gte: startDate, $lt: endDate };
    } else {
      // Default to today and future dates
      query.showDate = { $gte: new Date() };
    }
    
    // Filter by movie
    if (movieId) {
      query.show = movieId;
    }
    
    const showtimes = await Showtime.find(query)
      .populate('show', 'title image duration genre language rating')
      .populate('theater', 'name location')
      .sort({ showDate: 1, showTime: 1 });
    
    res.json(showtimes);
  } catch (error) {
    console.error('Error fetching theater showtimes:', error);
    res.status(500).json({ message: 'Error fetching showtimes', error: error.message });
  }
});

// GET /api/theaters/movie/:movieId - Get theaters showing specific movie
router.get('/movie/:movieId', async (req, res) => {
  try {
    const { date, city } = req.query;
    const movieId = req.params.movieId;
    
    console.log('Fetching theaters for movie:', movieId);
    
    // Check if movieId is valid
    if (!movieId || !/^[0-9a-fA-F]{24}$/.test(movieId)) {
      return res.status(400).json({ message: 'Invalid movie ID format' });
    }
    
    // Find the show with theater information
    const show = await Show.findById(movieId).populate('theaters.theater');
    
    if (!show) {
      console.log('Show not found for ID:', movieId);
      return res.status(404).json({ message: 'Movie not found' });
    }
    
    console.log('Found show:', show.title, 'with', show.theaters.length, 'theaters');
    
    // Extract theaters with their showtimes
    const theaters = [];
    
    show.theaters.forEach(theaterEntry => {
      const theater = theaterEntry.theater;
      if (!theater || !theater.isActive) {
        console.log('Skipping inactive theater:', theater?.name || 'null');
        return;
      }
      
      // Filter by city if specified
      if (city && !theater.location.city.toLowerCase().includes(city.toLowerCase())) {
        console.log('Skipping theater not in city:', theater.name, 'in', theater.location.city);
        return;
      }
      
      console.log('Adding theater:', theater.name);
      
      theaters.push({
        _id: theater._id,
        name: theater.name,
        location: theater.location,
        amenities: theater.amenities,
        screens: theater.screens,
        contactInfo: theater.contactInfo,
        isActive: theater.isActive,
        showtimes: theaterEntry.showTimes.map(time => ({
          showTime: time,
          showDate: new Date(), // For now, use current date
          availableSeats: 30, // 30 seats per showtime
          totalSeats: 30,
          price: show.price
        }))
      });
    });
    
    console.log('Returning', theaters.length, 'theaters');
    res.json(theaters);
  } catch (error) {
    console.error('Error fetching theaters for movie:', error);
    res.status(500).json({ message: 'Error fetching theaters', error: error.message });
  }
});

// POST /api/theaters - Add new theater (admin only)
router.post('/', async (req, res) => {
  try {
    const theater = new Theater(req.body);
    await theater.save();
    res.status(201).json(theater);
  } catch (error) {
    console.error('Error creating theater:', error);
    res.status(400).json({ message: 'Error creating theater', error: error.message });
  }
});

// PUT /api/theaters/:id - Update theater details (admin only)
router.put('/:id', async (req, res) => {
  try {
    const theater = await Theater.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!theater) {
      return res.status(404).json({ message: 'Theater not found' });
    }
    
    res.json(theater);
  } catch (error) {
    console.error('Error updating theater:', error);
    res.status(400).json({ message: 'Error updating theater', error: error.message });
  }
});

// DELETE /api/theaters/:id - Soft delete theater (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const theater = await Theater.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!theater) {
      return res.status(404).json({ message: 'Theater not found' });
    }
    
    res.json({ message: 'Theater deactivated successfully' });
  } catch (error) {
    console.error('Error deactivating theater:', error);
    res.status(500).json({ message: 'Error deactivating theater', error: error.message });
  }
});

module.exports = router;