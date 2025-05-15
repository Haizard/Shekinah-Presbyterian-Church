/**
 * Script to recreate the finance user in the database with a simpler password
 * 
 * Usage: 
 * 1. Make sure MongoDB is running
 * 2. Run: node scripts/recreate-finance-user.js
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

// Finance user data with simpler password
const financeUser = {
  name: 'Finance Manager',
  email: 'finance@shekinah.org',
  password: '123456',
  isAdmin: false,
  role: 'finance'
};

// Recreate finance user
const recreateFinanceUser = async () => {
  try {
    // Delete existing finance user if it exists
    await User.deleteOne({ email: financeUser.email });
    console.log('Deleted existing finance user (if any)');
    
    // Create new user
    const user = await User.create(financeUser);
    
    console.log('Finance user recreated successfully:');
    console.log({
      name: user.name,
      email: user.email,
      role: user.role,
      isAdmin: user.isAdmin
    });
    
    console.log('Login credentials:');
    console.log(`Email: ${financeUser.email}`);
    console.log(`Password: ${financeUser.password}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error recreating finance user:', error);
    process.exit(1);
  }
};

// Run the function
recreateFinanceUser();
