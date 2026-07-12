const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  label: {
    type: String,
    required: [true, 'Variant label is required (e.g. 250g, 1 Kg)']
  },
  price: {
    type: Number,
    required: [true, 'Variant price is required']
  }
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  nameLocal: {
    type: String,
    trim: true,
    default: ''
  },
  category: {
    type: String,
    enum: ['vegetable', 'dairy'],
    required: [true, 'Category is required (vegetable or dairy)']
  },
  imageUrl: {
    type: String,
    required: [true, 'Product image URL is required']
  },
  variants: {
    type: [variantSchema],
    required: true,
    validate: [
      function(val) {
        return val && val.length > 0;
      },
      'Product must have at least one variant'
    ]
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  specialDeal: {
    type: Boolean,
    default: false
  },
  imageFileId: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
