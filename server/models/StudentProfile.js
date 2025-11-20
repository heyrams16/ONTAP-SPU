const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  profilePicture: {
    type: String,
    default: 'https://via.placeholder.com/150/4CAF50/FFFFFF?text=Student'
  },
  bio: {
    type: String,
    maxlength: 500
  },
  university: {
    type: String,
    default: 'Saint Peters University'
  },
  major: {
    type: String,
    required: true
  },
  year: {
    type: String,
    enum: ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'],
    required: true
  },
  areasOfInterest: [{
    type: String
  }],
  skills: [{
    type: String
  }],
  hobbies: [{
    type: String
  }],
  socialMedia: {
    instagram: String,
    linkedin: String,
    twitter: String
  },
  lookingFor: [{
    type: String,
    enum: ['Study Partner', 'Project Collaborator', 'Mentor', 'Friend', 'Networking']
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  connections: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

studentProfileSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
