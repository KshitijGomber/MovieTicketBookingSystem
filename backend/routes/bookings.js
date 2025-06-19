const express = require('express');
const router = express.Router();

// Basic booking routes - placeholder for now
router.get('/', (req, res) => {
  res.status(501).json({ message: 'Bookings not implemented yet' });
});

router.post('/', (req, res) => {
  res.status(501).json({ message: 'Bookings not implemented yet' });
});

module.exports = router; 