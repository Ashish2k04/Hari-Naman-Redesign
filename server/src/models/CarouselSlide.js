const mongoose = require('mongoose');

const carouselSlideSchema = new mongoose.Schema({
  badge: {
    type: String,
    required: [true, 'Badge text is required'],
    trim: true
  },
  headlineLocal: {
    type: String,
    required: [true, 'Gujarati headline is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  highlight: {
    type: String,
    required: [true, 'Highlight offer text is required'],
    trim: true
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required'],
    trim: true
  },
  imageFileId: {
    type: String,
    default: ''
  },
  trustLabel: {
    type: String,
    required: [true, 'Trust label is required'],
    trim: true
  },
  trustSub: {
    type: String,
    required: [true, 'Trust sub-label is required'],
    trim: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CarouselSlide', carouselSlideSchema);
