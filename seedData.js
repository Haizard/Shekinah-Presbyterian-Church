// Script to seed the database with sample data
require('dotenv').config();
const mongoose = require('mongoose');
const Ministry = require('./models/Ministry');
const Sermon = require('./models/Sermon');
const Event = require('./models/Event');
const Gallery = require('./models/Gallery');
const Content = require('./models/Content');
const ChurchSettings = require('./models/ChurchSettings');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://haithammisape:hrz123@cluster0.jeis2ve.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

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
  },
  {
    title: 'Youth Ministry',
    category: 'youth',
    description: 'Our youth ministry helps teenagers navigate the challenges of adolescence while building a strong foundation in Christ through fellowship, Bible study, and mentoring.',
    image: '/images/SPCT/CHURCH.jpg',
    leader: 'Michael Johnson',
    meetingTime: 'Fridays at 6:00 PM'
  },
  {
    title: 'Women\'s Ministry',
    category: 'adults',
    description: 'This ministry provides opportunities for women to grow spiritually, build meaningful relationships, and serve together through Bible studies, retreats, and outreach projects.',
    image: '/images/SPCT/CHURCH.jpg',
    leader: 'Sarah Williams',
    meetingTime: 'First Saturday of each month at 10:00 AM'
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
  },
  {
    title: 'The Power of Prayer',
    speaker: 'Rev. Emanuel Nzelah',
    date: 'May 29, 2023',
    scripture: 'James 5:13-18',
    category: 'prayer',
    image: '/images/SPCT/CHURCH.jpg',
    audioUrl: '#',
    videoUrl: '#',
    notesUrl: '#',
    description: 'An exploration of the transformative power of prayer in the life of a believer and the community of faith.'
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
  },
  {
    title: 'Bible Study',
    date: 'June 15, 2023',
    time: '6:00 PM - 8:00 PM',
    location: 'Fellowship Hall',
    category: 'study',
    description: 'A deep dive into the book of Romans, exploring the foundations of our faith and the implications for our lives today.',
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
  },
  {
    title: 'Youth Fellowship',
    category: 'youth',
    image: '/images/SPCT/CHURCH.jpg',
    date: 'May 20, 2023',
    description: 'Our youth gathering for fellowship and fun.'
  }
];

// Sample content data
const contentData = [
  {
    section: 'about',
    title: 'Who We Are',
    content: '<p><strong>Shekinah Presbyterian Church Tanzania</strong> is a Christ-centered community committed to proclaiming the Kingdom of God across Tanzania and beyond. We exist to raise up mature disciples of Jesus, build Gospel-driven communities, and extend the love and truth of Christ to every sphere of life.</p><p>We are not just building churches—we are cultivating a missional culture where every believer is equipped to live for Christ, serve others, and make disciples who make disciples.</p>',
    image: '/images/SPCT/CHURCH.jpg'
  },
  {
    section: 'vision',
    title: 'Our Vision',
    content: '<p>To see a generation of disciples who are rooted in the truth, shaped by the Gospel, and released to transform communities for the glory of Christ.</p><p>We envision believers who are spiritually mature, mission-minded, and actively involved in making Jesus known—locally and globally.</p>',
    image: '/images/SPCT/CHURCH BCND.jpg'
  }
];

// Seed the database
const seedDatabase = async () => {
  try {
    // Clear existing data
    await Ministry.deleteMany({});
    await Sermon.deleteMany({});
    await Event.deleteMany({});
    await Gallery.deleteMany({});
    await Content.deleteMany({});
    
    console.log('Existing data cleared');
    
    // Insert new data
    await Ministry.insertMany(ministriesData);
    await Sermon.insertMany(sermonsData);
    await Event.insertMany(eventsData);
    await Gallery.insertMany(galleryData);
    await Content.insertMany(contentData);

    // Initialize default church settings
    await initializeChurchSettings();

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

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

// Run the function
seedDatabase();
