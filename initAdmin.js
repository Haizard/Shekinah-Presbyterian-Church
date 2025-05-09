// Script to initialize the database with an admin user
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shekinah')
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Admin user data
const adminData = {
  name: 'Admin',
  email: 'admin@shekinah.org',
  password: 'admin123',
  isAdmin: true
};

// Create admin user
const createAdmin = async () => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ email: adminData.email });

    if (adminExists) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create new admin user
    const admin = new User(adminData);

    await admin.save();

    console.log('Admin user created successfully');
    console.log('Email:', adminData.email);
    console.log('Password:', adminData.password);

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

// Run the function
createAdmin();
