const Resume = require('../models/Resume');

// @desc    Create a new resume
// @route   POST /api/resumes
const createResume = async (req, res) => {
  try {
    const resume = await Resume.create({
      user: req.user._id,
      title: req.body.title || 'Untitled Resume',
    });
    res.status(201).json(resume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all resumes for logged-in user
// @route   GET /api/resumes
const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single resume by ID
// @route   GET /api/resumes/:id
const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    if (resume.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update resume
// @route   PUT /api/resumes/:id
const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    if (resume.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedResume = await Resume.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(updatedResume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete resume
// @route   DELETE /api/resumes/:id
const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    if (resume.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await resume.deleteOne();
    res.json({ message: 'Resume removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get public resume by slug or ID
// @route   GET /api/resumes/public/:slug
const getResumeBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    let resume = await Resume.findOne({ slug, isPublic: true });
    
    // If not found and slug resembles an ObjectId, lookup by _id
    if (!resume && slug.match(/^[0-9a-fA-F]{24}$/)) {
      resume = await Resume.findOne({ _id: slug, isPublic: true });
    }

    if (!resume) {
      return res.status(404).json({ message: 'Public resume not found or is set to private.' });
    }

    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createResume,
  getResumes,
  getResumeById,
  updateResume,
  deleteResume,
  getResumeBySlug,
};