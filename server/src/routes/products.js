const express = require('express');
const router = express.Router();
const multer = require('multer');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');
const { handleImageUpload, deleteStoredImage } = require('../utils/imageStorage');

// Multer memory storage setup (files are stored in buffer before upload)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

const parseBooleanValue = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const lowered = value.toLowerCase().trim();
    return lowered === 'true' || lowered === '1' || lowered === 'on' || lowered === 'yes';
  }
  if (typeof value === 'number') return value === 1;
  return false;
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({}).sort({ name: 1 });
    res.status(200).json({ success: true, count: products.length, products });
  } catch (error) {
    console.error('Get products error:', error.message);
    res.status(500).json({ success: false, message: 'Server error retrieving products' });
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const { name, nameLocal, category, isAvailable, specialDeal } = req.body;
    let variants;

    // Variants are sent as a JSON string in form-data
    try {
      variants = JSON.parse(req.body.variants);
    } catch (e) {
      return res.status(400).json({ success: false, message: 'Invalid variants format' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a product image' });
    }

    // Process image upload
    const uploadResult = await handleImageUpload(req.file);

    const product = await Product.create({
      name,
      nameLocal: nameLocal || '',
      category,
      imageUrl: uploadResult.url,
      imageFileId: uploadResult.fileId || '',
      variants,
      isAvailable: parseBooleanValue(isAvailable),
      specialDeal: parseBooleanValue(specialDeal)
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    console.error('Create product error:', error.message);
    res.status(400).json({ success: false, message: error.message });
  }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private
router.put('/:id', protect, upload.single('image'), async (req, res) => {
  try {
    const { name, nameLocal, category, isAvailable, specialDeal } = req.body;
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    let variants;
    if (req.body.variants) {
      try {
        variants = JSON.parse(req.body.variants);
      } catch (e) {
        return res.status(400).json({ success: false, message: 'Invalid variants format' });
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (nameLocal !== undefined) updateData.nameLocal = nameLocal;
    if (category) updateData.category = category;
    if (variants) updateData.variants = variants;
    if (isAvailable !== undefined) {
      updateData.isAvailable = parseBooleanValue(isAvailable);
    }
    if (specialDeal !== undefined) {
      updateData.specialDeal = parseBooleanValue(specialDeal);
    }

    // If new image file uploaded
    if (req.file) {
      const uploadResult = await handleImageUpload(req.file);
      updateData.imageUrl = uploadResult.url;
      updateData.imageFileId = uploadResult.fileId || '';

      if (product.imageUrl || product.imageFileId) {
        await deleteStoredImage(product.imageUrl, product.imageFileId);
      }
    }

    product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error('Update product error:', error.message);
    res.status(400).json({ success: false, message: error.message });
  }
});

// @desc    Toggle product availability directly
// @route   PATCH /api/products/:id/toggle
// @access  Private
router.patch('/:id/toggle', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    product.isAvailable = !product.isAvailable;
    await product.save();

    res.status(200).json({ success: true, isAvailable: product.isAvailable, product });
  } catch (error) {
    console.error('Toggle product error:', error.message);
    res.status(500).json({ success: false, message: 'Server error toggling availability' });
  }
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await deleteStoredImage(product.imageUrl, product.imageFileId);
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error.message);
    res.status(500).json({ success: false, message: 'Server error deleting product' });
  }
});

module.exports = router;
