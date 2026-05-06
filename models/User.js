const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  bookmarks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);