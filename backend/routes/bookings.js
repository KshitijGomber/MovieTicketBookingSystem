const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Show = require('../models/Show');
const User = require('../models/User');
const checkJwt = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');
const { sendBookingConfirmationEmail, sendBookingCancellationEmail } = require('../utils/emailService');

// Mock payment processing
const processPayment = async (amount, paymentDetails) => {
  // In a real app, this would integrate with a payment gateway
  return {
    success: true,
    transactionId: `txn_${uuidv4()}`,
    amount,
    timestamp: new Date(),
    paymentMethod: paymentDetails?.method || 'card'
  };
};

// GET /api/bookings - Get user's bookings (protected route)
router.get('/', checkJwt, async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await Booking.find({ user: userId })
      .populate('show', 'title posterUrl duration')
      .sort({ createdAt: -1 }); // Most recent first
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
});

// POST /api/bookings - Create a new booking
router.post('/', checkJwt, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { showId, seats, showTime, paymentDetails } = req.body;
    const userId = req.user.id;
    
    if (!showId || !seats || !seats.length || !showTime) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Missing required fields: showId, seats, showTime' });
    }
    
    // Process payment (mock)
    const amount = seats.length * 10; // $10 per seat
    const paymentResult = await processPayment(amount, paymentDetails);
    
    if (!paymentResult.success) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Payment failed' });
    }

    // Check if the show exists
    const showDetails = await Show.findById(showId);
    if (!showDetails) {
      return res.status(404).json({ message: 'Show not found' });
    }

    // Check if any of the seats are already booked
    const existingBookings = await Booking.find({
      show: showId,
      seat: { $in: seats },
      showTime: showTime,
      status: 'booked'
    }).session(session);

    if (existingBookings.length > 0) {
      const bookedSeats = existingBookings.map(b => b.seat);
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ 
        message: `Seat(s) ${bookedSeats.join(', ')} are already booked`,
        bookedSeats
      });
    }

    // Check if the showtime is valid
    if (!showDetails.showTimes.includes(showTime)) {
      return res.status(400).json({ message: 'Invalid showtime' });
    }

    // Create bookings for each seat
    const bookingPromises = seats.map(seat => {
      const booking = new Booking({
        user: userId,
        show: showId,
        seat,
        showTime,
        status: 'confirmed',
        payment: {
          amount: 10, // $10 per seat
          method: paymentDetails?.method || 'card',
          status: 'completed',
          transactionId: paymentResult.transactionId,
          paymentDate: new Date()
        }
      });
      return booking.save({ session });
    });

    // Update available seats
    await Show.findByIdAndUpdate(
      showId,
      { $inc: { availableSeats: -seats.length } },
      { session }
    );

    // Execute all operations in transaction
    const bookings = await Promise.all(bookingPromises);
    await session.commitTransaction();
    session.endSession();

    // Send confirmation email
    const user = await User.findById(userId);
    const show = await Show.findById(showId);
    
    if (user && show) {
      await sendBookingConfirmationEmail(
        user.email,
        user.name,
        show.title,
        showTime,
        seats,
        amount
      );
    }

    res.status(201).json({ 
      success: true, 
      bookings,
      transactionId: paymentResult.transactionId,
      amount
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error creating booking:', error);
    res.status(500).json({ 
      message: 'Error creating booking',
      error: error.message 
    });
  }
});

// POST /api/bookings/check-seats - Check seat availability
router.post('/check-seats', async (req, res) => {
  try {
    const { showId, seats, showTime } = req.body;
    
    if (!showId || !seats || !seats.length || !showTime) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existingBookings = await Booking.find({
      show: showId,
      seat: { $in: seats },
      showTime: showTime,
      status: 'booked'
    });

    if (existingBookings.length > 0) {
      const bookedSeats = existingBookings.map(b => b.seat);
      return res.status(200).json({ 
        available: false, 
        message: `Seat(s) ${bookedSeats.join(', ')} are already booked`,
        bookedSeats
      });
    }

    res.json({ available: true });
  } catch (error) {
    console.error('Error checking seats:', error);
    res.status(500).json({ message: 'Error checking seat availability' });
  }
});

// POST /api/bookings/process-payment - Process payment (mock)
router.post('/process-payment', checkJwt, async (req, res) => {
  try {
    const { amount, paymentDetails } = req.body;
    
    if (!amount || !paymentDetails) {
      return res.status(400).json({ message: 'Amount and payment details are required' });
    }

    // Mock payment processing
    const paymentResult = await processPayment(amount, paymentDetails);
    
    res.json({
      success: paymentResult.success,
      transactionId: paymentResult.transactionId,
      timestamp: paymentResult.timestamp
    });
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Payment processing failed',
      error: error.message 
    });
  }
});

// POST /api/bookings/:id/cancel - Cancel a booking
router.post('/:id/cancel', checkJwt, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const userId = req.user.id;
    const booking = await Booking.findOne({ 
      _id: req.params.id, 
      user: userId 
    }).session(session);
    
    if (!booking) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status === 'cancelled') {
      await session.abortTransaction();
      session.endSession();
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
    await session.abortTransaction();
    session.endSession();
    console.error('Error cancelling booking:', error);
    res.status(500).json({ 
      message: 'Error cancelling booking',
      error: error.message 
    });
  }
});

// Public route - Get booked seats for a show (no authentication required)
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