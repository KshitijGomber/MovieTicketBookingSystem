const mongoose = require('mongoose');

const theaterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  seatingCapacity: {
    type: Number,
    required: true,
    min: 1
  },
  amenities: [{
    type: String,
    enum: [
      'IMAX',
      '4DX',
      'Dolby Atmos',
      'Recliner Seats',
      'Food Court',
      'Parking',
      'Wheelchair Accessible',
      'Air Conditioning',
      'Premium Lounge',
      'Concessions',
      'Online Booking',
      'Mobile Tickets'
    ]
  }],
  screens: [{
    screenNumber: {
      type: Number,
      required: true
    },
    screenType: {
      type: String,
      enum: ['Standard', 'IMAX', '4DX', 'Premium'],
      default: 'Standard'
    },
    seatingCapacity: {
      type: Number,
      required: true
    }
  }],
  contactInfo: {
    phone: String,
    email: String,
    website: String
  },
  operatingHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String }
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  images: [String],
  priceRange: {
    min: Number,
    max: Number
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full address
theaterSchema.virtual('fullAddress').get(function() {
  return `${this.location.address}, ${this.location.city}, ${this.location.state} ${this.location.zipCode}`;
});

// Index for location-based queries
theaterSchema.index({ 'location.coordinates': '2dsphere' });
theaterSchema.index({ 'location.city': 1 });
theaterSchema.index({ name: 'text', 'location.city': 'text' });

module.exports = mongoose.model('Theater', theaterSchema);