// Script to initialize the local MongoDB database with sample data
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Import models
const User = require('./models/User');
const Ministry = require('./models/Ministry');
const Sermon = require('./models/Sermon');
const Event = require('./models/Event');
const Gallery = require('./models/Gallery');
const Content = require('./models/Content');

// Sample data
const sampleData = {
  // Sample ministries data
  ministries: [
    {
      title: 'Worship Ministry',
      category: 'worship',
      description: 'Our worship ministry leads the congregation in praise and worship.',
      image: '/images/SPCT/CHURCH.jpg',
      leader: 'John Doe',
      meetingTime: 'Saturdays at 4:00 PM'
    },
    {
      title: 'Children\'s Ministry',
      category: 'children',
      description: 'We provide a safe, fun, and Bible-based environment for children.',
      image: '/images/SPCT/CHURCH.jpg',
      leader: 'Jane Smith',
      meetingTime: 'Sundays during service'
    },
    {
      title: 'Youth Ministry',
      category: 'youth',
      description: 'Engaging young people in spiritual growth and community service.',
      image: '/images/SPCT/CHURCH.jpg',
      leader: 'Michael Johnson',
      meetingTime: 'Fridays at 6:00 PM'
    }
  ],

  // Sample sermons data
  sermons: [
    {
      title: 'The Power of Faith',
      preacher: 'Pastor James',
      date: '2023-05-28',
      scripture: 'Hebrews 11:1-6',
      audioUrl: '/sermons/faith.mp3',
      description: 'A powerful message about the importance of faith in our daily lives.'
    },
    {
      title: 'Walking in Love',
      preacher: 'Pastor Sarah',
      date: '2023-06-04',
      scripture: '1 Corinthians 13:1-13',
      audioUrl: '/sermons/love.mp3',
      description: 'Understanding the true meaning of love according to the Bible.'
    }
  ],

  // Sample events data
  events: [
    {
      title: 'Annual Church Conference',
      date: '2023-07-15',
      time: '9:00 AM - 4:00 PM',
      location: 'Main Sanctuary',
      description: 'Join us for our annual church conference with guest speakers and worship.',
      image: '/images/SPCT/CHURCH.jpg'
    },
    {
      title: 'Community Outreach',
      date: '2023-08-05',
      time: '10:00 AM - 2:00 PM',
      location: 'Community Center',
      description: 'Serving our community through various outreach activities.',
      image: '/images/SPCT/CHURCH.jpg'
    }
  ],

  // Sample gallery data
  gallery: [
    {
      title: 'Sunday Worship Service',
      category: 'worship',
      image: '/images/SPCT/CHURCH.jpg',
      date: 'May 28, 2023',
      description: 'Moments from our Sunday worship service.'
    },
    {
      title: 'Youth Camp',
      category: 'youth',
      image: '/images/SPCT/CHURCH.jpg',
      date: 'June 15, 2023',
      description: 'Highlights from our annual youth camp.'
    }
  ],

  // Sample content data
  content: [
    {
      section: 'about',
      title: 'Who We Are',
      content: '<p><strong>Shekinah Presbyterian Church Tanzania</strong> is a Christ-centered community committed to proclaiming the Kingdom of God across Tanzania and beyond.</p>',
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
    }
  ]
};

// Connect to MongoDB
const connectDB = async () => {
  try {
    // Set mongoose connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 60000, // Increase timeout to 60 seconds
      socketTimeoutMS: 90000, // Increase socket timeout
      family: 4, // Use IPv4, skip trying IPv6
      connectTimeoutMS: 60000 // Increase connection timeout
    };

    // Use the standard MongoDB Atlas connection string
    await mongoose.connect('mongodb+srv://haithammisape:hrz123@cluster0.jeis2ve.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    console.log('Connected to MongoDB successfully');
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return false;
  }
};

// Initialize database with sample data
const initializeDB = async () => {
  try {
    // Connect to MongoDB
    const connected = await connectDB();
    if (!connected) {
      console.error('Failed to connect to MongoDB. Exiting...');
      process.exit(1);
    }

    // Create admin user if it doesn't exist
    const adminExists = await User.findOne({ email: 'admin@shekinah.org' });
    if (!adminExists) {
      console.log('Creating admin user...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);

      await User.create({
        name: 'Admin',
        email: 'admin@shekinah.org',
        password: hashedPassword,
        isAdmin: true
      });

      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }

    // Check if data already exists
    const ministriesCount = await Ministry.countDocuments();
    const sermonsCount = await Sermon.countDocuments();
    const eventsCount = await Event.countDocuments();
    const galleryCount = await Gallery.countDocuments();
    const contentCount = await Content.countDocuments();

    if (ministriesCount === 0 && sermonsCount === 0 && eventsCount === 0 && galleryCount === 0 && contentCount === 0) {
      console.log('Inserting sample data...');

      // Insert sample data
      await Ministry.insertMany(sampleData.ministries);
      await Sermon.insertMany(sampleData.sermons);
      await Event.insertMany(sampleData.events);
      await Gallery.insertMany(sampleData.gallery);
      await Content.insertMany(sampleData.content);

      console.log('Sample data inserted successfully');
    } else {
      console.log('Data already exists in the database');
    }

    console.log('Database initialization completed successfully');
    console.log('\nYou can now run the application with:');
    console.log('node server.js');
    console.log('\nAdmin login:');
    console.log('Email: admin@shekinah.org');
    console.log('Password: admin123');

    // Disconnect from MongoDB
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

// Run the initialization function
initializeDB();
