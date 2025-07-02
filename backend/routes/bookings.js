const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Show = require('../models/Show');
const User = require('../models/User');
const checkJwt = require('../middleware/auth');
const { sendBookingConfirmationEmail, sendBookingCancellationEmail } = require('../utils/emailService');
const { processPayment, processRefund } = require('../utils/paymentService');

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
    const { showId, seat, showTime, paymentMethod = 'card' } = req.body;
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

    // Get user details for email
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Process payment
    const paymentAmount = show.price || 0;
    const paymentResult = await processPayment({
      amount: paymentAmount,
      currency: 'INR',
      paymentMethod,
      description: `Booking for ${show.title} - Seat ${seat}`
    });

    if (!paymentResult.success) {
      return res.status(400).json({ 
        message: 'Payment failed',
        error: paymentResult.error
      });
    }

    // Create the booking with payment reference
    const booking = new Booking({
      user: userId,
      show: showId,
      seat: seat,
      showTime: showTime,
      status: 'booked',
      payment: {
        id: paymentResult.paymentId,
        amount: paymentAmount,
        status: paymentResult.status,
        method: paymentMethod,
        receiptUrl: paymentResult.receiptUrl
      },
      bookingReference: `BK${Date.now().toString().slice(-8)}`
    });

    await booking.save();

    // Send booking confirmation email
    try {
      await sendBookingConfirmationEmail({
        to: user.email,
        movieName: show.title,
        showTime: showTime,
        seats: [seat],
        totalAmount: paymentAmount,
        bookingId: booking.bookingReference,
        theatreName: show.theatre || 'Cineplex',
        paymentId: paymentResult.paymentId
      });
    } catch (emailError) {
      console.error('Failed to send booking confirmation email:', emailError);
      // Don't fail the request if email fails
    }

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
    }).populate('show').populate('user', 'email name');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    // Process refund if payment was made
    let refundResult = null;
    if (booking.payment && booking.payment.status === 'succeeded') {
      refundResult = await processRefund({
        paymentId: booking.payment.id,
        amount: booking.payment.amount,
        reason: 'cancellation'
      });

      if (!refundResult.success) {
        console.error('Refund failed:', refundResult.error);
        // Continue with cancellation even if refund fails, but log it
      }
    }

    // Update booking status
    booking.status = 'cancelled';
    if (refundResult) {
      booking.refund = {
        id: refundResult.refundId,
        amount: refundResult.amount,
        status: refundResult.status,
        processedAt: new Date()
      };
    }
    await booking.save();

    // Send cancellation email
    try {
      await sendBookingCancellationEmail({
        to: booking.user.email,
        movieName: booking.show.title,
        bookingId: booking.bookingReference || booking._id.toString(),
        refundAmount: refundResult?.amount || 0,
        showTime: booking.showTime
      });
    } catch (emailError) {
      console.error('Failed to send cancellation email:', emailError);
      // Don't fail the request if email fails
    }

    res.json({ 
      message: 'Booking cancelled successfully', 
      booking,
      refund: refundResult
    });
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