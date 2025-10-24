const mongoose = require('mongoose');
const Content = require('./models/Content');
const ChurchSettings = require('./models/ChurchSettings');
const { initializeMinisterySections } = require('./utils/initializeMinisterySections');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// MongoDB Connection
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
    initializeContent();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Sample content data
const contentData = [
  {
    section: 'how_we_serve',
    title: 'How We Serve',
    content: JSON.stringify([
      {
        title: 'Service Area 1',
        description: 'Describe your first area of ministry and service.',
        icon: 'faHandsHelping'
      },
      {
        title: 'Service Area 2',
        description: 'Describe your second area of ministry and service.',
        icon: 'faUsers'
      },
      {
        title: 'Service Area 3',
        description: 'Describe your third area of ministry and service.',
        icon: 'faChurch'
      },
      {
        title: 'Service Area 4',
        description: 'Describe your fourth area of ministry and service.',
        icon: 'faBookOpen'
      }
    ]),
    image: '/images/SPCT/CHURCH.jpg'
  },
  {
    section: 'video_gallery',
    title: 'Video Gallery',
    content: JSON.stringify([
      {
        title: 'Sunday Worship Service',
        date: 'June 4, 2023',
        thumbnail: '/images/SPCT/CHURCH.jpg',
        url: 'https://www.youtube.com/watch?v=example1'
      },
      {
        title: 'Bible Study: The Book of John',
        date: 'May 28, 2023',
        thumbnail: '/images/SPCT/CHURCH.jpg',
        url: 'https://www.youtube.com/watch?v=example2'
      },
      {
        title: 'Testimony: God\'s Faithfulness',
        date: 'May 21, 2023',
        thumbnail: '/images/SPCT/CHURCH.jpg',
        url: 'https://www.youtube.com/watch?v=example3'
      }
    ]),
    image: '/images/SPCT/CHURCH.jpg'
  },
  {
    section: 'featured_event',
    title: 'Annual Church Conference',
    content: JSON.stringify({
      date: 'June 15, 2023',
      time: '9:00 AM - 4:00 PM',
      location: 'Main Sanctuary',
      description: 'Join us for our annual church conference with guest speakers and worship. This year\'s theme is "Rooted in Christ, Growing in Faith."',
      link: '/events'
    }),
    image: '/images/SPCT/CHURCH.jpg'
  },
  {
    section: 'our_vision',
    title: 'Our Vision',
    content: 'To be a beacon of hope and light in our community, transforming lives through the love of Christ.',
    image: '/images/SPCT/CHURCH.jpg'
  },
  {
    section: 'our_mission',
    title: 'Our Mission',
    content: 'To make disciples of Jesus Christ for the transformation of the world by proclaiming the good news of God\'s grace.',
    image: '/images/SPCT/CHURCH.jpg'
  }
];

// Function to initialize content
async function initializeContent() {
  try {
    // Check if content already exists
    for (const content of contentData) {
      const existingContent = await Content.findOne({ section: content.section });

      if (existingContent) {
        console.log(`Content section "${content.section}" already exists. Skipping...`);
      } else {
        // Create new content
        await Content.create(content);
        console.log(`Content section "${content.section}" created successfully.`);
      }
    }

    // Initialize default church settings
    await initializeChurchSettings();

    // Initialize default ministry sections
    await initializeMinisterySectionsLocal();

    console.log('Content initialization completed.');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error initializing content:', error);
    mongoose.disconnect();
  }
}

// Function to initialize default church settings
async function initializeChurchSettings() {
  try {
    // Check if church settings already exist
    const settingsExists = await ChurchSettings.findOne();

    if (settingsExists) {
      console.log('Church settings already exist. Skipping...');
      return;
    }

    // Create default empty church settings
    const defaultSettings = new ChurchSettings({
      churchName: '',
      churchDescription: '',
      logo: '',
      favicon: '',
      address: '',
      city: '',
      country: '',
      postalCode: '',
      phone: '',
      email: '',
      serviceTimes: [],
      socialMedia: {},
      bankDetails: {},
      mapCoordinates: {},
      timezone: 'UTC',
      currency: 'USD',
      language: 'en',
    });

    await defaultSettings.save();
    console.log('Default church settings created successfully');
  } catch (error) {
    console.error('Error initializing church settings:', error);
  }
}

// Initialize ministry sections
async function initializeMinisterySectionsLocal() {
  try {
    await initializeMinisterySections();
  } catch (error) {
    console.error('Error initializing ministry sections:', error);
  }
}
