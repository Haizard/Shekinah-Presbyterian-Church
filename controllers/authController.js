const User = require('../models/User');
const { generateToken } = require('../config/auth');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Determine if user should be admin based on role
    const isAdmin = role === 'admin';

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      isAdmin, // Set based on role
      role: role || 'user', // Default to 'user' if not specified
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        role: user.role,
        token: generateToken(user._id, user.email, user.role),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    console.log('Login attempt received:', req.body);
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });
    console.log('User found:', user ? 'Yes' : 'No');

    if (user) {
      const isMatch = await user.matchPassword(password);
      console.log('Password match:', isMatch ? 'Yes' : 'No');

      if (isMatch) {
        // Log the user ID to see what we're working with
        console.log('User ID for token:', user._id, 'Type:', typeof user._id);

        const token = generateToken(user._id, user.email, user.role);
        console.log('Token generated successfully with email and role included');

        const userData = {
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          role: user.role,
          token: token,
        };

        console.log('Sending user data:', userData);
        res.json(userData);
      } else {
        console.log('Invalid password');
        res.status(401).json({ message: 'Invalid email or password' });
      }
    } else {
      console.log('User not found');
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        role: user.role,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      // Only allow admin to update role
      if (req.user.isAdmin && req.body.role) {
        user.role = req.body.role;
        // Update isAdmin based on role
        user.isAdmin = req.body.role === 'admin';
      }

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        role: updatedUser.role,
        token: generateToken(updatedUser._id, updatedUser.email, updatedUser.role),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
};
