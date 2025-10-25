const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use environment variable for MongoDB connection string
    // MONGODB_URI MUST be set in .env file
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set. Please configure it in your .env file.');
    }

    // Connect to MongoDB
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
