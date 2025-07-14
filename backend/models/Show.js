const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  theaters: [
    {
      theater: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Theater',
        required: true
      },
      showTimes: [{
        type: String,
        required: true
      }],
      availableSeats: {
        type: Number,
        required: true,
        default: 100
      }
    }
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model('Show', showSchema); 