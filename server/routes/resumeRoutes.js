const express = require('express');
const router = express.Router();
const {
  createResume,
  getResumes,
  getResumeById,
  updateResume,
  deleteResume,
  getResumeBySlug,
} = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');

router.get('/public/:slug', getResumeBySlug);

router.route('/').post(protect, createResume).get(protect, getResumes);

router
  .route('/:id')
  .get(protect, getResumeById)
  .put(protect, updateResume)
  .delete(protect, deleteResume);

module.exports = router;