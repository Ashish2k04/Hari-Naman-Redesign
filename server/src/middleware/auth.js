const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  let token;

  // Read JWT from httpOnly cookie
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route, no token found' });
  }

  try {

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get admin from DB (excluding password)
    req.admin = await Admin.findById(decoded.id).select('-password');
    
    if (!req.admin) {
      return res.status(401).json({ success: false, message: 'Admin account no longer exists' });
    }

    next();
  } catch (error) {
    console.error('JWT Verification Error:', error.message);
    return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};

module.exports = { protect };
