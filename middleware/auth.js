const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose');

// Protect routes
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'shekinah_presbyterian_church_secret_key');

      // Get user from the token
      // Log the decoded token for debugging
      console.log('Decoded token:', decoded);

      // Check if the ID is a valid MongoDB ObjectId
      let user;
      try {
        // If it's a valid ObjectId, find by ID
        if (mongoose.Types.ObjectId.isValid(decoded.id)) {
          user = await User.findById(decoded.id).select('-password');
        }

        // If no user found by ID or ID is invalid, try to find by email
        if (!user) {
          console.log('User not found by ID, trying to find by email');
          // Try to extract email from token if available
          const email = decoded.email || 'admin@shekinah.org';
          user = await User.findOne({ email }).select('-password');
        }

        if (!user) {
          throw new Error('User not found');
        }

        req.user = user;
      } catch (idError) {
        console.error('User lookup error:', idError);
        throw new Error('Invalid user ID or user not found');
      }

      if (!req.user) {
        throw new Error('User not found');
      }

      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      res.status(401).json({ message: 'Not authorized, token failed', error: error.message });
    }
    return; // Add return to prevent the next if block from executing
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Admin middleware
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

// Finance middleware - allows access to finance users and admins (read-only for admins)
const finance = (req, res, next) => {
  if (req.user && (req.user.isAdmin || req.user.role === 'finance')) {
    // Add a flag to indicate if the user is a finance user or admin
    req.isFinanceUser = req.user.role === 'finance';
    req.isAdminUser = req.user.isAdmin;
    next();
  } else {
    res.status(401).json({ message: 'Not authorized to access finance features' });
  }
};

// Finance-only middleware - only allows finance users to perform CRUD operations
const financeOnly = (req, res, next) => {
  if (req.user && req.user.role === 'finance') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized to modify finance data' });
  }
};

module.exports = { protect, admin, finance, financeOnly };
