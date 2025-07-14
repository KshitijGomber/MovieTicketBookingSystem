const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  id: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  status: { 
    type: String, 
    enum: ['pending', 'succeeded', 'failed', 'refunded'],
    default: 'pending'
  },
  method: { type: String, default: 'card' },
  receiptUrl: String,
  gateway: { type: String, default: 'dummy' },
  createdAt: { type: Date, default: Date.now }
});

const refundSchema = new mongoose.Schema({
  id: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'succeeded', 'failed'],
    default: 'pending'
  },
  reason: String,
  processedAt: { type: Date, default: Date.now },
  gateway: { type: String, default: 'dummy' }
});

const bookingSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  show: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Show', 
    required: true 
  },
  theater: { // Reference to Theater
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theater',
    required: true
  },
  seat: { 
    type: Number, 
    required: true 
  },
  showTime: { 
    type: Date, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending_payment', 'booked', 'cancelled', 'completed'], 
    default: 'pending_payment' 
  },
  bookingReference: {
    type: String,
    unique: true,
    required: true
  },
  payment: {
    type: paymentSchema,
    required: true
  },
  refund: {
    type: refundSchema,
    required: false
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for faster queries
bookingSchema.index({ user: 1, status: 1 });
bookingSchema.index({ show: 1, theater: 1, showTime: 1, status: 1 });

module.exports = mongoose.model('Booking', bookingSchema); 