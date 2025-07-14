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
    // In a real app, this would integrate with a payment gateway
    const paymentAmount = parseFloat(amount);
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      throw new Error('Invalid payment amount');
    }

    // In a real app, this would integrate with a payment gateway
    return {
      success: true,
      transactionId: paymentDetails.transactionId || `txn_${Math.random().toString(36).substring(2, 15)}`,
      amount: paymentAmount,
      timestamp: new Date(),
      paymentMethod: paymentDetails.method || 'card',
      currency: paymentDetails.currency || 'USD',
      status: 'succeeded'
    };
  } catch (error) {
    console.error('Payment processing error:', error);
    return {
      success: false,
      error: error.message || 'Payment processing failed',
      transactionId: null
    };
  }
};

// Mock refund processing - Always succeeds for demo purposes
const processRefund = async (refundDetails) => {
  try {
    const { paymentId, amount, reason } = refundDetails;
    console.log('Processing refund:', { paymentId, amount, reason });
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Always return success for demo purposes
    return {
      success: true,
      refundId: `re_${Math.random().toString(36).substring(2, 15)}`,
      amount: amount,
      currency: 'USD',
      status: 'succeeded',
      reason: reason,
      processedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Refund processing error:', error);
    // Even if there's an error, we'll still proceed with the cancellation
    // but log the error for debugging
    return {
      success: false,
      error: error.message || 'Refund processing failed',
      refundId: null,
      status: 'failed',
      // Include these fields to ensure the cancellation can still proceed
      amount: refundDetails.amount,
      currency: 'USD',
      reason: refundDetails.reason,
      processedAt: new Date().toISOString()
    };
  }
};

// GET /api/bookings - Get user's bookings (protected route)
router.get('/', checkJwt, async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await Booking.find({ user: userId })
      .populate('show', 'title image duration')
      .populate('theater', 'name location')
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
    const { showId, theaterId, seats, showTime, paymentDetails } = req.body;
    const userId = req.user.id;
    
    console.log('Processing booking:', { showId, theaterId, seats, showTime, userId });
    
    if (!showId) {
      throw new Error('Missing required field: showId');
    }
    if (!theaterId) {
      throw new Error('Missing required field: theaterId');
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

    // Check if the show exists and has the theater
    const showDetails = await Show.findById(showId).populate('theaters.theater');
    if (!showDetails) {
      return res.status(404).json({ message: 'Show not found' });
    }

    // Find the specific theater for this show
    const theaterShowData = showDetails.theaters.find(
      t => t.theater._id.toString() === theaterId
    );
    
    if (!theaterShowData) {
      return res.status(400).json({ message: 'Show not available in this theater' });
    }

    // Check if the showtime is valid for this theater
    if (!theaterShowData.showTimes.includes(showTime)) {
      return res.status(400).json({ message: 'Invalid showtime for this theater' });
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
      theater: theaterId,
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
        theater: theaterId,
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

    // Update available seats for the specific theater
    await Show.findOneAndUpdate(
      { 
        _id: showId,
        'theaters.theater': theaterId
      },
      { 
        $inc: { 'theaters.$.availableSeats': -seats.length }
      },
      { session, new: true }
    );

    // Execute all operations in transaction
    const bookings = await Promise.all(bookingPromises);
    await session.commitTransaction();
    session.endSession();
    
    console.log('Booking created successfully:', {
      bookingIds: bookings.map(b => b._id),
      seats,
      showTime: showDateTime
    });

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
    const bookingResponse = {
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
      totalAmount: amount,
      transactionId: paymentResult.transactionId,
      paymentStatus: 'completed'
    };
    
    console.log('Sending booking response:', {
      success: true,
      data: [bookingResponse],
      transactionId: paymentResult.transactionId,
      amount
    });
    
    res.status(201).json({ 
      success: true, 
      data: [bookingResponse],
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
      try {
        refundResult = await processRefund({
          paymentId: booking.payment.transactionId || booking.payment.id || `pay_${booking._id}`,
          amount: booking.payment.amount,
          reason: 'cancellation'
        });

        if (!refundResult.success) {
          console.error('Refund failed but continuing with cancellation:', refundResult.error);
          // Use the refund result even if it failed, as it contains the necessary fields
          refundResult = {
            ...refundResult,
            amount: booking.payment.amount,
            status: 'failed',
            reason: 'cancellation',
            processedAt: new Date().toISOString()
          };
        }
      } catch (error) {
        console.error('Error processing refund:', error);
        // Create a failed refund result to continue with cancellation
        refundResult = {
          success: false,
          error: error.message || 'Refund processing error',
          refundId: null,
          status: 'failed',
          amount: booking.payment.amount,
          currency: 'USD',
          reason: 'cancellation',
          processedAt: new Date().toISOString()
        };
      }
    }

    try {
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
      await booking.save({ session });

      // Update the show's bookedSeats array
      if (booking.show && booking.seat) {
        await Show.updateOne(
          { _id: booking.show },
          { 
            $pull: { 
              bookedSeats: { 
                seatNumber: booking.seat,
                showTime: booking.showTime
              } 
            },
            $inc: { availableSeats: 1 }
          },
          { session }
        );
      }

      // Commit the transaction
      await session.commitTransaction();
      
      // Send cancellation email (outside of transaction)
      try {
        const user = await User.findById(booking.user);
        if (user && user.email) {
          await sendBookingCancellationEmail({
            to: user.email,
            movieName: booking.show?.title || 'Your movie',
            bookingId: booking.bookingReference || booking._id.toString(),
            refundAmount: refundResult?.amount || (booking.payment?.amount || 0),
            showTime: booking.showTime || booking.show?.showTime
          });
        } else {
          console.log('No email found for user, skipping cancellation email');
        }
      } catch (emailError) {
        console.error('Failed to send cancellation email:', emailError);
        // Don't fail the request if email fails
      }

      res.json({ 
        success: true,
        message: 'Booking cancelled successfully', 
        booking: booking.toObject(),
        refund: refundResult
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
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
    const { showTime, theaterId } = req.query;
    const { showId } = req.params;
    
    if (!showTime) {
      return res.status(400).json({ message: 'Showtime is required' });
    }
    
    if (!theaterId) {
      return res.status(400).json({ message: 'Theater ID is required' });
    }

    // Parse the showTime string to a Date object
    let showTimeDate;
    try {
      showTimeDate = parseShowTime(showTime);
    } catch (error) {
      return res.status(400).json({ message: 'Invalid showtime format. Expected format: "10:00 AM"' });
    }

    // Calculate time window for the show (2-hour window)
    const startTime = new Date(showTimeDate);
    startTime.setHours(startTime.getHours() - 1); // 1 hour before
    
    const endTime = new Date(showTimeDate);
    endTime.setHours(endTime.getHours() + 1); // 1 hour after

    // Get seats from Show model's bookedSeats array
    const show = await Show.findById(showId);
    let bookedSeatsFromShow = [];
    
    if (show && Array.isArray(show.bookedSeats)) {
      // Filter seats for the specific show time window
      bookedSeatsFromShow = show.bookedSeats
        .filter(seat => {
          if (!seat || !seat.showTime) return false;
          const seatTime = new Date(seat.showTime);
          return seatTime >= startTime && seatTime <= endTime;
        })
        .map(seat => seat.seatNumber || seat);
    }

    // Get seats from Bookings collection
    const bookings = await Booking.find({
      show: showId,
      theater: theaterId,
      showTime: {
        $gte: startTime,
        $lte: endTime
      },
      status: { $in: ['booked', 'pending_payment'] }
    }).select('seat');

    // Combine and deduplicate seat numbers from both sources
    const seatNumbersFromBookings = bookings.map(booking => booking.seat);
    const allBookedSeats = [...new Set([...bookedSeatsFromShow, ...seatNumbersFromBookings])];
    
    console.log('Booked seats:', {
      fromShow: bookedSeatsFromShow,
      fromBookings: seatNumbersFromBookings,
      combined: allBookedSeats,
      showTime: showTimeDate,
      timeWindow: { start: startTime, end: endTime }
    });
    
    res.json(allBookedSeats);
  } catch (error) {
    console.error('Error fetching booked seats:', error);
    res.status(500).json({ 
      message: 'Error fetching booked seats', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;