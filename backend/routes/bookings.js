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
const processPayment = async (amount, paymentDetails = {}) => {
  try {
    // Validate amount
    const paymentAmount = parseFloat(amount);
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      return {
        success: false,
        message: 'Invalid payment amount',
        details: { amount: paymentAmount }
      };
    }

    // In a real app, this would integrate with a payment gateway
    return {
      success: true,
      transactionId: paymentDetails.transactionId || `txn_${uuidv4()}`,
      amount: paymentAmount,
      timestamp: new Date(),
      paymentMethod: paymentDetails.method || 'card',
      currency: paymentDetails.currency || 'USD'
    };
  } catch (error) {
    console.error('Payment processing error:', error);
    return {
      success: false,
      message: 'Payment processing failed',
      details: error.message
    };
  }
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
    console.error('Error fetching bookings:', {
      error: error.message,
      stack: error.stack,
      body: req.body,
      user: req.user
    });
    res.status(500).json({ 
      message: 'Error fetching bookings', 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// POST /api/bookings - Create a new booking
router.post('/', checkJwt, async (req, res) => {
  console.log('Received booking request:', {
    body: req.body,
    user: req.user
  });

  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { showId, seats, showTime, paymentDetails } = req.body;
    const userId = req.user.id;
    
    console.log('Processing booking:', { showId, seats, showTime, userId });
    
    if (!showId) {
      throw new Error('Missing required field: showId');
    }
    if (!seats || !Array.isArray(seats) || !seats.length) {
      throw new Error('Invalid or missing seats array');
    }
    if (!showTime) {
      throw new Error('Missing required field: showTime');
    }
    
    // Process payment (mock)
    const amount = paymentDetails?.amount || (seats.length * 10);
    const paymentResult = await processPayment(amount, paymentDetails);
    
    if (!paymentResult.success) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ 
        message: paymentResult.message || 'Payment failed',
        details: paymentResult.details
      });
    }

    // Check if the show exists
    const showDetails = await Show.findById(showId);
    if (!showDetails) {
      return res.status(404).json({ message: 'Show not found' });
    }

    // Convert showTime string to a Date object
    const parseShowTime = (timeStr) => {
      try {
        const [time, period] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        
        // Convert to 24-hour format
        if (period === 'PM' && hours < 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        
        // Create a date object for today with the specified time
        const showDate = new Date();
        showDate.setHours(hours, minutes, 0, 0);
        
        return showDate;
      } catch (error) {
        console.error('Error parsing showTime:', { timeStr, error });
        throw new Error('Invalid show time format. Expected format: "HH:MM AM/PM"');
      }
    };

    const showDateTime = parseShowTime(showTime);
    
    // Check if any of the seats are already booked
    const existingBookings = await Booking.find({
      show: showId,
      seat: { $in: seats },
      showTime: {
        $gte: new Date(showDateTime.getFullYear(), showDateTime.getMonth(), showDateTime.getDate()),
        $lt: new Date(showDateTime.getFullYear(), showDateTime.getMonth(), showDateTime.getDate() + 1)
      },
      status: { $in: ['booked', 'pending_payment'] }
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

    // Generate a unique booking reference
    const generateBookingReference = () => {
      return `BK-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    };

    // Create bookings for each seat
    const seatPrice = (paymentDetails.amount / seats.length).toFixed(2);
    const bookingPromises = seats.map(seat => {
      const bookingReference = generateBookingReference();
      const booking = new Booking({
        user: userId,
        show: showId,
        seat,
        showTime: showDateTime,
        status: 'booked',
        bookingReference,
        payment: {
          id: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          amount: parseFloat(seatPrice),
          method: paymentDetails?.method || 'card',
          status: 'succeeded',
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
    
    // Send email confirmation
    if (user && show) {
      try {
        await sendBookingConfirmationEmail({
          to: user.email,
          movieName: show.title,
          showTime: showDateTime, // Use the Date object for consistent formatting
          seats: seats,
          totalAmount: amount,
          bookingId: bookings[0]?.bookingReference || 'N/A',
          paymentId: paymentResult.transactionId,
          theatreName: 'Cineplex' // Default theatre name
        });
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
        // Don't fail the booking if email fails
      }
    }

    // Get the first booking to include in the response
    const firstBooking = bookings[0];
    
    res.status(201).json({ 
      success: true, 
      data: [{
        ...firstBooking.toObject(),
        show: show ? {
          _id: show._id,
          title: show.title,
          image: show.image,
          duration: show.duration
        } : null,
        user: user ? {
          _id: user._id,
          name: user.name,
          email: user.email
        } : null,
        showTime: showTime, // Include the original showTime string
        totalAmount: amount
      }],
      transactionId: paymentResult.transactionId,
      amount
    });
  } catch (error) {
    console.error('Error creating booking:', {
      error: error.message,
      stack: error.stack,
      body: req.body,
      user: req.user
    });
    
    try {
      await session.abortTransaction();
    } catch (abortError) {
      console.error('Error aborting transaction:', abortError);
    }
    
    try {
      await session.endSession();
    } catch (endSessionError) {
      console.error('Error ending session:', endSessionError);
    }
    
    res.status(500).json({ 
      message: 'Error creating booking', 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
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

// Helper function to convert time string to Date object
const parseShowTime = (timeStr) => {
  // Expected format: "10:00 AM"
  const [time, period] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  
  if (period === 'PM' && hours < 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};

// Public route - Get booked seats for a show (no authentication required)
router.get('/show/:showId/seats', async (req, res) => {
  try {
    const { showTime } = req.query;
    
    if (!showTime) {
      return res.status(400).json({ message: 'Showtime is required' });
    }

    // Parse the showTime string to a Date object
    let showTimeDate;
    try {
      showTimeDate = parseShowTime(showTime);
    } catch (error) {
      return res.status(400).json({ message: 'Invalid showtime format. Expected format: "10:00 AM"' });
    }

    // Find bookings for the same show and time (ignoring seconds and milliseconds)
    const startTime = new Date(showTimeDate);
    const endTime = new Date(showTimeDate);
    endTime.setMinutes(endTime.getMinutes() + 1); // 1-minute window

    const bookedSeats = await Booking.find({
      show: req.params.showId,
      showTime: {
        $gte: startTime,
        $lt: endTime
      },
      status: 'booked'
    }).select('seat');

    const seatNumbers = bookedSeats.map(booking => booking.seat);
    
    res.json({ bookedSeats: seatNumbers });
  } catch (error) {
    console.error('Error fetching booked seats:', error);
    res.status(500).json({ 
      message: 'Error fetching booked seats',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router; 