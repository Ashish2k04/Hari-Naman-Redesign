const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const { protect } = require('../middleware/auth');

// @desc    Update admin settings (email, name, password)
// @route   PUT /api/admin/settings
// @access  Private
router.put('/settings', protect, async (req, res) => {
  const { name, email, currentPassword, newPassword } = req.body;

  try {
    // Get admin by ID (and select password field which was excluded in protect)
    const admin = await Admin.findById(req.admin.id);

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    // Check if password change is requested
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ success: false, message: 'Please provide current password to change password' });
      }

      // Check current password correctness
      const isMatch = await admin.matchPassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Current password is incorrect' });
      }

      // Validate new password length
      if (newPassword.length < 6) {
        return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
      }

      admin.password = newPassword;
    }

    // Check if email change is requested and verify uniqueness
    if (email && email !== admin.email) {
      const emailExists = await Admin.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ success: false, message: 'Email is already in use by another account' });
      }
      admin.email = email;
    }

    if (name) {
      admin.name = name;
    }

    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email
      }
    });
  } catch (error) {
    console.error('Update settings error:', error.message);
    res.status(500).json({ success: false, message: 'Server error during settings update' });
  }
});

module.exports = router;
