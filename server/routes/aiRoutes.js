const express = require('express');
const router = express.Router();
const { improveBullet } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

// Secure route using protect middleware
router.post('/improve-bullet', protect, improveBullet);

module.exports = router;
