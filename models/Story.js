const mongoose = require('mongoose');

const StorySchema = new mongoose.Schema({
  hnId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    default: ''
  },
  points: {
    type: Number,
    default: 0
  },
  author: {
    type: String,
    default: 'Unknown'
  },
  postedAt: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Story', StorySchema);