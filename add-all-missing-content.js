// Script to add all missing content sections to the database
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
    addAllMissingContent();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// All content sections that should exist in the database
const allContentData = [
  // Basic sections
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
  // Additional sections
  {
    section: 'who_we_are',
    title: 'Who We Are',
    content: '<p><strong>Shekinah Presbyterian Church Tanzania</strong> is a Christ-centered community committed to proclaiming the Kingdom of God across Tanzania and beyond. We exist to raise up mature disciples of Jesus, build Gospel-driven communities, and extend the love and truth of Christ to every sphere of life.</p>',
    image: '/images/SPCT/CHURCH.jpg'
  },
  {
    section: 'our_vision',
    title: 'Our Vision',
    content: '<p>To be a beacon of light and hope, transforming lives through the Gospel of Jesus Christ.</p>',
    image: '/images/SPCT/CHURCH.jpg'
  },
  {
    section: 'our_mission',
    title: 'Our Mission',
    content: '<p>To make disciples of all nations, teaching them to observe all that Jesus has commanded.</p>',
    image: '/images/SPCT/CHURCH.jpg'
  },
  {
    section: 'our_story',
    title: 'Our Story',
    content: '<p>Shekinah Presbyterian Church Tanzania was founded with a vision to bring the transformative power of the Gospel to communities across Tanzania. Our journey began with a small group of believers committed to authentic discipleship and has grown into a vibrant community of faith.</p>',
    image: '/images/SPCT/CHURCH.jpg'
  },
  {
    section: 'our_motto',
    title: 'Our Motto',
    content: '<p>"Proclaiming Christ, Building Communities, Transforming Lives"</p>',
    image: '/images/SPCT/CHURCH.jpg'
  },
  {
    section: 'how_we_serve',
    title: 'How We Serve',
    content: JSON.stringify([
      {
        title: 'Community Outreach',
        description: 'We provide food, clothing, and support to those in need in our community.',
        icon: 'faHandsHelping'
      },
      {
        title: 'Youth Ministry',
        description: 'Engaging programs for children and teens to grow in faith and fellowship.',
        icon: 'faUsers'
      },
      {
        title: 'Worship Services',
        description: 'Inspiring worship services with powerful messages and uplifting music.',
        icon: 'faChurch'
      },
      {
        title: 'Bible Study',
        description: 'In-depth Bible studies for all ages to deepen understanding of Scripture.',
        icon: 'faBookOpen'
      }
    ]),
    image: '/images/SPCT/CHURCH.jpg'
  },
  {
    section: 'weekly_schedule',
    title: 'Weekly Schedule',
    content: JSON.stringify([
      {
        day: 'Sunday',
        events: [
          { time: '9:00 AM', title: 'Sunday School' },
          { time: '10:30 AM', title: 'Worship Service' },
          { time: '5:00 PM', title: 'Youth Group' }
        ]
      },
      {
        day: 'Wednesday',
        events: [
          { time: '6:30 PM', title: 'Bible Study' },
          { time: '7:30 PM', title: 'Prayer Meeting' }
        ]
      },
      {
        day: 'Friday',
        events: [
          { time: '7:00 PM', title: 'Choir Practice' }
        ]
      }
    ]),
    image: '/images/SPCT/CHURCH.jpg'
  },
  {
    section: 'featured_event',
    title: 'Featured Event',
    content: JSON.stringify({
      title: 'Easter Sunday Service',
      date: '2023-04-09',
      time: '10:30 AM',
      location: 'Main Sanctuary',
      description: 'Join us for a special Easter celebration as we commemorate the resurrection of Jesus Christ.'
    }),
    image: '/images/SPCT/CHURCH.jpg'
  },
  {
    section: 'video_gallery',
    title: 'Video Gallery',
    content: JSON.stringify([
      {
        title: 'Sunday Sermon: The Power of Faith',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: '/images/SPCT/CHURCH.jpg',
        description: 'Pastor James delivers a powerful message on the importance of faith in our daily lives.'
      },
      {
        title: 'Youth Conference Highlights',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: '/images/SPCT/CHURCH.jpg',
        description: 'Highlights from our annual youth conference featuring worship, teaching, and fellowship.'
      }
    ]),
    image: '/images/SPCT/CHURCH.jpg'
  }
];

// Function to add all missing content
async function addAllMissingContent() {
  try {
    console.log('Checking for missing content sections...');
    
    // Get all existing content sections
    const existingContent = await Content.find({});
    const existingSections = existingContent.map(item => item.section);
    
    console.log('Existing content sections:', existingSections);
    
    // Check each section and add if missing
    for (const contentItem of allContentData) {
      if (existingSections.includes(contentItem.section)) {
        console.log(`Content section "${contentItem.section}" already exists. Skipping...`);
      } else {
        // Create new content
        await Content.create(contentItem);
        console.log(`Content section "${contentItem.section}" created successfully.`);
      }
    }
    
    console.log('All missing content sections added successfully.');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error adding missing content:', error);
    mongoose.disconnect();
  }
}
