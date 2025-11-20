const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 1000
  },
  type: {
    type: String,
    enum: ['general', 'event', 'announcement', 'question', 'achievement'],
    default: 'general'
  },
  images: [{
    type: String
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    content: {
      type: String,
      required: true,
      maxlength: 500
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [{
    type: String
  }],
  visibility: {
    type: String,
    enum: ['public', 'friends', 'private'],
    default: 'public'
  }
}, {
  timestamps: true
});

// Index for faster queries
postSchema.index({ createdAt: -1 });
postSchema.index({ user: 1 });

module.exports = mongoose.model('Post', postSchema);
