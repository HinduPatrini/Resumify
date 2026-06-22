const express = require('express');
const router = express.Router();
const multer = require('multer');
const { improveBullet, atsCheck, parseLinkedin } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

// Multer memory storage configuration for LinkedIn PDF imports
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// All AI feature routes are protected
router.post('/improve-bullet', protect, improveBullet);
router.post('/ats-check', protect, atsCheck);
router.post('/parse-linkedin', protect, upload.single('file'), parseLinkedin);

module.exports = router;
