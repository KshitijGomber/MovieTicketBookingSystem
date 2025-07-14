const mongoose = require('mongoose');

const showtimeSchema = new mongoose.Schema({
  show: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Show',
    required: true
  },
  theater: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theater',
    required: true
  },
  screen: {
    screenNumber: {
      type: Number,
      required: true
    },
    screenType: {
      type: String,
      enum: ['Standard', 'IMAX', '4DX', 'Premium'],
      default: 'Standard'
    }
  },
  showDate: {
    type: Date,
    required: true
  },
  showTime: {
    type: String,
    required: true
  },
  price: {
    base: {
      type: Number,
      required: true
    },
    premium: Number,
    vip: Number
  },
  availableSeats: {
    type: Number,
    required: true
  },
  totalSeats: {
    type: Number,
    required: true
  },
  bookedSeats: [{
    seatNumber: String,
    seatType: {
      type: String,
      enum: ['regular', 'premium', 'vip'],
      default: 'regular'
    },
    bookingDate: Date,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  language: {
    type: String,
    required: true
  },
  subtitles: [String],
  format: {
    type: String,
    enum: ['2D', '3D', 'IMAX', '4DX'],
    default: '2D'
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'sold_out', 'upcoming'],
    default: 'active'
  },
  specialOffers: [{
    name: String,
    description: String,
    discount: Number,
    validUntil: Date
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for datetime
showtimeSchema.virtual('dateTime').get(function() {
  const date = new Date(this.showDate);
  const [time, period] = this.showTime.split(' ');
  const [hours, minutes] = time.split(':');
  let hour = parseInt(hours);
  
  if (period === 'PM' && hour !== 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 0;
  
  date.setHours(hour, parseInt(minutes), 0, 0);
  return date;
});

// Indexes for efficient queries
showtimeSchema.index({ show: 1, theater: 1, showDate: 1 });
showtimeSchema.index({ theater: 1, showDate: 1 });
showtimeSchema.index({ show: 1, showDate: 1 });

module.exports = mongoose.model('Showtime', showtimeSchema);