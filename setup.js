// Script to set up the project
require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const User = require('./models/User');
const Ministry = require('./models/Ministry');
const Sermon = require('./models/Sermon');
const Event = require('./models/Event');
const Gallery = require('./models/Gallery');
const Content = require('./models/Content');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://haithammisape:hrz123@cluster0.jeis2ve.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
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

// Sample ministries data
const ministriesData = [
  {
    title: 'Worship Ministry',
    category: 'worship',
    description: 'Our worship ministry leads the congregation in praise and worship, creating an atmosphere for encountering God through music, prayer, and the arts.',
    image: '/images/SPCT/CHURCH.jpg',
    leader: 'John Doe',
    meetingTime: 'Rehearsals: Saturdays at 4:00 PM'
  },
  {
    title: 'Children\'s Ministry',
    category: 'children',
    description: 'We provide a safe, fun, and Bible-based environment where children can learn about Jesus and grow in their faith through age-appropriate activities.',
    image: '/images/SPCT/CHURCH.jpg',
    leader: 'Jane Smith',
    meetingTime: 'Sundays during service'
  }
];

// Sample sermons data
const sermonsData = [
  {
    title: 'Walking in Faith',
    speaker: 'Rev. Dr. Daniel John Seni',
    date: 'June 5, 2023',
    scripture: 'Hebrews 11:1-6',
    category: 'faith',
    image: '/images/SPCT/CHURCH.jpg',
    audioUrl: '#',
    videoUrl: '#',
    notesUrl: '#',
    description: 'This sermon explores what it means to walk by faith and not by sight, drawing from the examples of the heroes of faith in Hebrews 11.'
  }
];

// Sample events data
const eventsData = [
  {
    title: 'Sunday Worship Service',
    date: 'June 12, 2023',
    time: '9:00 AM - 12:00 PM',
    location: 'Main Sanctuary',
    category: 'worship',
    description: 'Join us for our weekly Sunday worship service as we gather to praise God, hear His Word, and fellowship together.',
    image: '/images/SPCT/CHURCH.jpg'
  }
];

// Sample gallery data
const galleryData = [
  {
    title: 'Sunday Worship Service',
    category: 'worship',
    image: '/images/SPCT/CHURCH.jpg',
    date: 'May 28, 2023',
    description: 'Moments from our Sunday worship service.'
  }
];

// Sample content data
const contentData = [
  {
    section: 'about',
    title: 'Who We Are',
    content: '<p><strong>Shekinah Presbyterian Church Tanzania</strong> is a Christ-centered community committed to proclaiming the Kingdom of God across Tanzania and beyond.</p>',
    image: '/images/SPCT/CHURCH.jpg'
  }
];

// Create uploads directory if it doesn't exist
const uploadsDir = path.join('public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads directory');
}

// Setup function
const setup = async () => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ email: adminData.email });
    
    if (!adminExists) {
      // Create admin user
      const admin = new User(adminData);
      await admin.save();
      console.log('Admin user created successfully');
      console.log('Email:', adminData.email);
      console.log('Password:', adminData.password);
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
      // Insert sample data
      await Ministry.insertMany(ministriesData);
      await Sermon.insertMany(sermonsData);
      await Event.insertMany(eventsData);
      await Gallery.insertMany(galleryData);
      await Content.insertMany(contentData);
      
      console.log('Sample data inserted successfully');
    } else {
      console.log('Data already exists in the database');
    }
    
    console.log('Setup completed successfully');
    console.log('\nYou can now run the application with:');
    console.log('npm run dev');
    console.log('\nAdmin login:');
    console.log('Email: admin@shekinah.org');
    console.log('Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error during setup:', error);
    process.exit(1);
  }
};

// Run the setup function
setup();
