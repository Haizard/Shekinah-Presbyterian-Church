/**
 * Script to create a finance user in the database
 * 
 * Usage: 
 * 1. Make sure MongoDB is running
 * 2. Run: node scripts/create-finance-user.js
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

// Finance user data
const financeUser = {
  name: 'Finance Manager',
  email: 'finance@shekinah.org',
  password: 'finance123',
  isAdmin: false,
  role: 'finance'
};

// Create finance user
const createFinanceUser = async () => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: financeUser.email });
    
    if (existingUser) {
      console.log('Finance user already exists');
      process.exit(0);
    }
    
    // Create new user
    const user = await User.create(financeUser);
    
    console.log('Finance user created successfully:');
    console.log({
      name: user.name,
      email: user.email,
      role: user.role,
      isAdmin: user.isAdmin
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating finance user:', error);
    process.exit(1);
  }
};

// Run the function
createFinanceUser();
