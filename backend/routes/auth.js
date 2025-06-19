const express = require('express');
const router = express.Router();

// Basic auth routes - placeholder for now
router.post('/signin', (req, res) => {
  res.status(501).json({ message: 'Auth not implemented yet' });
});

router.post('/signup', (req, res) => {
  res.status(501).json({ message: 'Auth not implemented yet' });
});

module.exports = router; 