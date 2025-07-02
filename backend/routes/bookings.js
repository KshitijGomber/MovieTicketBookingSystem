const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Show = require('../models/Show');
const checkJwt = require('../middleware/auth');

// Protect all booking routes
router.use(checkJwt);

// GET /api/bookings - Get user's bookings
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await Booking.find({ user: userId }).populate('show');
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

// POST /api/bookings - Create a new booking
router.post('/', async (req, res) => {
  try {
    const { showId, seat, showTime } = req.body;
    const userId = req.user.id;
    
    if (!showId || !seat || !showTime) {
      return res.status(400).json({ message: 'Missing required fields: showId, seat, showTime' });
    }

    // Check if the show exists
    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }

    // Check if the seat is already booked for this show and showtime
    const existingBooking = await Booking.findOne({
      show: showId,
      seat: seat,
      showTime: showTime,
      status: 'booked'
    });

    if (existingBooking) {
      return res.status(400).json({ message: `Seat ${seat} is already booked` });
    }

    // Check if the showtime is valid
    if (!show.showTimes.includes(showTime)) {
      return res.status(400).json({ message: 'Invalid showtime' });
    }

    // Create the booking
    const booking = new Booking({
      show: showId,
      seat: seat,
      showTime: showTime,
      status: 'booked',
      user: userId
    });

    await booking.save();

    // Populate the show details before sending response
    await booking.populate('show');

    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Error creating booking' });
  }
});

// POST /api/bookings/:id/cancel - Cancel a booking
router.post('/:id/cancel', async (req, res) => {
  try {
    const userId = req.user.id;
    const booking = await Booking.findOne({ 
      _id: req.params.id, 
      user: userId 
    }).populate('show');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    // Cancel the booking
    booking.status = 'cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ message: 'Error cancelling booking' });
  }
});

// GET /api/bookings/show/:showId/seats - Get booked seats for a show
router.get('/show/:showId/seats', async (req, res) => {
  try {
    const { showTime } = req.query;
    
    if (!showTime) {
      return res.status(400).json({ message: 'Showtime is required' });
    }

    const bookedSeats = await Booking.find({
      show: req.params.showId,
      showTime: showTime,
      status: 'booked'
    }).select('seat');

    const seatNumbers = bookedSeats.map(booking => booking.seat);
    
    res.json({ bookedSeats: seatNumbers });
  } catch (error) {
    console.error('Error fetching booked seats:', error);
    res.status(500).json({ message: 'Error fetching booked seats' });
  }
});

module.exports = router; 