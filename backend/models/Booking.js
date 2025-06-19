const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.Mixed, // Allow both ObjectId and String
    required: false, // Make it optional for now
    default: 'temp-user-id'
  },
  show: { type: mongoose.Schema.Types.ObjectId, ref: 'Show', required: true },
  seat: { type: Number, required: true },
  showTime: { type: String, required: true },
  status: { type: String, enum: ['booked', 'cancelled'], default: 'booked' },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema); 