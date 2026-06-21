const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  institution: String,
  degree: String,
  fieldOfStudy: String,
  startDate: String,
  endDate: String,
  gpa: String,
});

const experienceSchema = new mongoose.Schema({
  company: String,
  role: String,
  startDate: String,
  endDate: String,
  bullets: [String],
});

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  techStack: [String],
  link: String,
});

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      default: 'Untitled Resume',
    },
    personalInfo: {
      fullName: String,
      email: String,
      phone: String,
      location: String,
      linkedin: String,
      github: String,
      portfolio: String,
    },
    summary: {
      type: String,
      default: '',
    },
    education: [educationSchema],
    experience: [experienceSchema],
    skills: [String],
    projects: [projectSchema],
    template: {
      type: String,
      default: 'minimal',
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resume', resumeSchema);