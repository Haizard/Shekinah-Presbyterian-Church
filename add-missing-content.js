// Script to add missing content sections to the database
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
    addMissingContent();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Missing content sections to add
const missingContentData = [
  {
    section: 'hero',
    title: 'Welcome to Shekinah Presbyterian Church',
    content: '<p>A Christ-centered community committed to proclaiming the Kingdom of God.</p>',
    image: '/images/SPCT/CHURCH.jpg'
  },
  {
    section: 'about',
    title: 'Who We Are',
    content: '<p><strong>Shekinah Presbyterian Church Tanzania</strong> is a Christ-centered community committed to proclaiming the Kingdom of God across Tanzania and beyond. We exist to raise up mature disciples of Jesus, build Gospel-driven communities, and extend the love and truth of Christ to every sphere of life.</p><p>We are not just building churches—we are cultivating a missional culture where every believer is equipped to live for Christ, serve others, and make disciples who make disciples.</p>',
    image: '/images/SPCT/CHURCH.jpg'
  },
  {
    section: 'vision',
    title: 'Our Vision',
    content: '<p>To be a beacon of light and hope, transforming lives through the Gospel of Jesus Christ.</p>',
    image: '/images/SPCT/CHURCH.jpg'
  },
  {
    section: 'mission',
    title: 'Our Mission',
    content: '<p>To make disciples of all nations, teaching them to observe all that Jesus has commanded.</p>',
    image: '/images/SPCT/CHURCH.jpg'
  },
  // Add any other missing sections here
];

// Function to add missing content
async function addMissingContent() {
  try {
    console.log('Checking for missing content sections...');
    
    // Check each section and add if missing
    for (const contentItem of missingContentData) {
      const existingContent = await Content.findOne({ section: contentItem.section });
      
      if (existingContent) {
        console.log(`Content section "${contentItem.section}" already exists. Skipping...`);
      } else {
        // Create new content
        await Content.create(contentItem);
        console.log(`Content section "${contentItem.section}" created successfully.`);
      }
    }
    
    // Also check if our_vision and our_mission exist, and if so, create aliases
    const ourVision = await Content.findOne({ section: 'our_vision' });
    if (ourVision && !(await Content.findOne({ section: 'vision' }))) {
      const visionAlias = {
        section: 'vision',
        title: ourVision.title,
        content: ourVision.content,
        image: ourVision.image
      };
      await Content.create(visionAlias);
      console.log('Created "vision" alias for "our_vision"');
    }
    
    const ourMission = await Content.findOne({ section: 'our_mission' });
    if (ourMission && !(await Content.findOne({ section: 'mission' }))) {
      const missionAlias = {
        section: 'mission',
        title: ourMission.title,
        content: ourMission.content,
        image: ourMission.image
      };
      await Content.create(missionAlias);
      console.log('Created "mission" alias for "our_mission"');
    }
    
    console.log('Missing content sections added successfully.');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error adding missing content:', error);
    mongoose.disconnect();
  }
}
