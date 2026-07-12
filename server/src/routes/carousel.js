const express = require('express');
const router = express.Router();
const multer = require('multer');
const CarouselSlide = require('../models/CarouselSlide');
const { protect } = require('../middleware/auth');
const { handleImageUpload, deleteStoredImage } = require('../utils/imageStorage');

// Multer memory storage setup
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


// @desc    Get all carousel slides
// @route   GET /api/carousel
// @access  Public
router.get('/', async (req, res) => {
  try {
    const slides = await CarouselSlide.find({}).sort({ order: 1 });
    res.status(200).json({ success: true, count: slides.length, slides });
  } catch (error) {
    console.error('Get carousel error:', error.message);
    res.status(500).json({ success: false, message: 'Server error retrieving slides' });
  }
});

// @desc    Create a carousel slide
// @route   POST /api/carousel
// @access  Private
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const { badge, headlineLocal, description, highlight, trustLabel, trustSub, order } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a banner image' });
    }

    const uploadResult = await handleImageUpload(req.file);

    const slide = await CarouselSlide.create({
      badge,
      headlineLocal,
      description,
      highlight,
      imageUrl: uploadResult.url,
      imageFileId: uploadResult.fileId || '',
      trustLabel,
      trustSub,
      order: order ? Number(order) : 0
    });

    res.status(201).json({ success: true, slide });
  } catch (error) {
    console.error('Create carousel slide error:', error.message);
    res.status(400).json({ success: false, message: error.message });
  }
});

// @desc    Update a carousel slide
// @route   PUT /api/carousel/:id
// @access  Private
router.put('/:id', protect, upload.single('image'), async (req, res) => {
  try {
    const { badge, headlineLocal, description, highlight, trustLabel, trustSub, order } = req.body;
    let slide = await CarouselSlide.findById(req.params.id);

    if (!slide) {
      return res.status(404).json({ success: false, message: 'Slide not found' });
    }

    const updateData = {};
    if (badge !== undefined) updateData.badge = badge;
    if (headlineLocal !== undefined) updateData.headlineLocal = headlineLocal;
    if (description !== undefined) updateData.description = description;
    if (highlight !== undefined) updateData.highlight = highlight;
    if (trustLabel !== undefined) updateData.trustLabel = trustLabel;
    if (trustSub !== undefined) updateData.trustSub = trustSub;
    if (order !== undefined) updateData.order = Number(order);

    if (req.file) {
      const uploadResult = await handleImageUpload(req.file);
      updateData.imageUrl = uploadResult.url;
      updateData.imageFileId = uploadResult.fileId || '';

      if (slide.imageUrl || slide.imageFileId) {
        await deleteStoredImage(slide.imageUrl, slide.imageFileId);
      }
    }

    slide = await CarouselSlide.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, slide });
  } catch (error) {
    console.error('Update carousel slide error:', error.message);
    res.status(400).json({ success: false, message: error.message });
  }
});

// @desc    Delete a carousel slide
// @route   DELETE /api/carousel/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const slide = await CarouselSlide.findById(req.params.id);

    if (!slide) {
      return res.status(404).json({ success: false, message: 'Slide not found' });
    }

    await deleteStoredImage(slide.imageUrl, slide.imageFileId);
    await CarouselSlide.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Slide deleted successfully' });
  } catch (error) {
    console.error('Delete carousel slide error:', error.message);
    res.status(500).json({ success: false, message: 'Server error deleting slide' });
  }
});

module.exports = router;
