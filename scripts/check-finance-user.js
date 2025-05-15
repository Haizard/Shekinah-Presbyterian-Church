/**
 * Script to check if the finance user exists in the database
 * 
 * Usage: 
 * 1. Make sure MongoDB is running
 * 2. Run: node scripts/check-finance-user.js
 */

const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/church_management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => {
  console.error('MongoDB Connection Error:', err);
  process.exit(1);
});

// Check if finance user exists
const checkFinanceUser = async () => {
  try {
    // Find the finance user
    const user = await User.findOne({ email: 'finance@shekinah.org' });
    
    if (user) {
      console.log('Finance user found:');
      console.log({
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin: user.isAdmin
      });
      
      // Create a test password to check if password matching works
      const isMatch = await user.matchPassword('finance123');
      console.log('Password match test:', isMatch ? 'Success' : 'Failed');
    } else {
      console.log('Finance user not found');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking finance user:', error);
    process.exit(1);
  }
};

// Run the function
checkFinanceUser();
