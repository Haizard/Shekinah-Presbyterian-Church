// Script to check content in the database
require('dotenv').config();
const mongoose = require('mongoose');
const Content = require('./models/Content');

// Connect to MongoDB
console.log('Connecting to MongoDB Atlas...');

// Use environment variable for MongoDB connection string or fallback to the standard connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://haithammisape:hrz123@cluster0.jeis2ve.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB with additional options
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
  socketTimeoutMS: 45000, // Increase socket timeout to 45 seconds
  family: 4, // Use IPv4, skip trying IPv6
  maxPoolSize: 10 // Maintain up to 10 socket connections
})
  .then(() => {
    console.log('MongoDB connected successfully');
    checkContent();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Function to check content
async function checkContent() {
  try {
    // Get all content
    const content = await Content.find({});
    
    console.log('Total content items:', content.length);
    
    // Print each content item
    content.forEach((item, index) => {
      console.log(`\n--- Content Item ${index + 1} ---`);
      console.log('Section:', item.section);
      console.log('Title:', item.title);
      console.log('Content (first 100 chars):', item.content.substring(0, 100) + (item.content.length > 100 ? '...' : ''));
      console.log('Image:', item.image);
      console.log('Created At:', item.createdAt);
      console.log('Updated At:', item.updatedAt);
    });
    
    mongoose.disconnect();
  } catch (error) {
    console.error('Error checking content:', error);
    mongoose.disconnect();
  }
}
