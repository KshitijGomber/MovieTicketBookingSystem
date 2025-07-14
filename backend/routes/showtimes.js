const express = require('express');
const router = express.Router();
const Showtime = require('../models/ShowTime');
const Show = require('../models/Show');
const Theater = require('../models/Theater');

// GET /api/showtimes - Get all showtimes with filtering
router.get('/', async (req, res) => {
  try {
    const { 
      movieId, 
      theaterId, 
      date, 
      city, 
      format, 
      language,
      page = 1, 
      limit = 20 
    } = req.query;
    
    const query = { status: 'active' };
    
    // Filter by movie
    if (movieId) {
      query.show = movieId;
    }
    
    // Filter by theater
    if (theaterId) {
      query.theater = theaterId;
    }
    
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
    
    // Filter by format
    if (format) {
      query.format = format;
    }
    
    // Filter by language
    if (language) {
      query.language = language;
    }
    
    const skip = (page - 1) * limit;
    
    let showtimes = await Showtime.find(query)
      .populate('show', 'title image duration genre language rating')
      .populate('theater', 'name location amenities')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ showDate: 1, showTime: 1 });
    
    // Filter by city if specified
    if (city) {
      showtimes = showtimes.filter(showtime => 
        showtime.theater && 
        showtime.theater.location.city.toLowerCase().includes(city.toLowerCase())
      );
    }
    
    const total = await Showtime.countDocuments(query);
    
    res.json({
      showtimes,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: showtimes.length,
        totalRecords: total
      }
    });
  } catch (error) {
    console.error('Error fetching showtimes:', error);
    res.status(500).json({ message: 'Error fetching showtimes', error: error.message });
  }
});

// GET /api/showtimes/:id - Get specific showtime
router.get('/:id', async (req, res) => {
  try {
    const showtime = await Showtime.findById(req.params.id)
      .populate('show')
      .populate('theater');
    
    if (!showtime) {
      return res.status(404).json({ message: 'Showtime not found' });
    }
    
    res.json(showtime);
  } catch (error) {
    console.error('Error fetching showtime:', error);
    res.status(500).json({ message: 'Error fetching showtime', error: error.message });
  }
});

// POST /api/showtimes - Create new showtime (admin only)
router.post('/', async (req, res) => {
  try {
    const showtime = new Showtime(req.body);
    await showtime.save();
    
    const populatedShowtime = await Showtime.findById(showtime._id)
      .populate('show')
      .populate('theater');
    
    res.status(201).json(populatedShowtime);
  } catch (error) {
    console.error('Error creating showtime:', error);
    res.status(400).json({ message: 'Error creating showtime', error: error.message });
  }
});

// PUT /api/showtimes/:id - Update showtime (admin only)
router.put('/:id', async (req, res) => {
  try {
    const showtime = await Showtime.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('show').populate('theater');
    
    if (!showtime) {
      return res.status(404).json({ message: 'Showtime not found' });
    }
    
    res.json(showtime);
  } catch (error) {
    console.error('Error updating showtime:', error);
    res.status(400).json({ message: 'Error updating showtime', error: error.message });
  }
});

// DELETE /api/showtimes/:id - Cancel showtime (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const showtime = await Showtime.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    );
    
    if (!showtime) {
      return res.status(404).json({ message: 'Showtime not found' });
    }
    
    res.json({ message: 'Showtime cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling showtime:', error);
    res.status(500).json({ message: 'Error cancelling showtime', error: error.message });
  }
});

module.exports = router;