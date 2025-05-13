const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const jwt = require('jsonwebtoken');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// CORS configuration
const corsOptions = {
  origin: '*', // Allow requests from any origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'jsmart1-react', 'dist')));
}

// In-memory data store
const db = {
  users: [
    {
      _id: 'admin123',
      name: 'Admin',
      email: 'admin@shekinah.org',
      password: '$2a$10$ij3DjRQbxvbTEcHtEV6Q4OtQX2qHQu6yXnSKnZvLPLv.f2qT5kEou', // hashed 'admin123'
      isAdmin: true
    }
  ],
  ministries: [
    {
      _id: 'ministry1',
      title: 'Worship Ministry',
      category: 'worship',
      description: 'Our worship ministry leads the congregation in praise and worship.',
      image: '/images/SPCT/CHURCH.jpg',
      leader: 'John Doe',
      meetingTime: 'Saturdays at 4:00 PM'
    },
    {
      _id: 'ministry2',
      title: 'Children\'s Ministry',
      category: 'children',
      description: 'We provide a safe, fun, and Bible-based environment for children.',
      image: '/images/SPCT/CHURCH.jpg',
      leader: 'Jane Smith',
      meetingTime: 'Sundays during service'
    }
  ],
  sermons: [
    {
      _id: 'sermon1',
      title: 'The Power of Faith',
      preacher: 'Pastor James',
      date: '2023-05-28',
      scripture: 'Hebrews 11:1-6',
      audioUrl: '/sermons/faith.mp3',
      description: 'A powerful message about the importance of faith in our daily lives.'
    }
  ],
  events: [
    {
      _id: 'event1',
      title: 'Annual Church Conference',
      date: '2023-07-15',
      time: '9:00 AM - 4:00 PM',
      location: 'Main Sanctuary',
      description: 'Join us for our annual church conference with guest speakers and worship.',
      image: '/images/SPCT/CHURCH.jpg'
    }
  ],
  gallery: [
    {
      _id: 'gallery1',
      title: 'Sunday Worship Service',
      category: 'worship',
      image: '/images/SPCT/CHURCH.jpg',
      date: 'May 28, 2023',
      description: 'Moments from our Sunday worship service.'
    }
  ],
  content: [
    {
      _id: 'content1',
      section: 'about',
      title: 'Who We Are',
      content: '<p><strong>Shekinah Presbyterian Church Tanzania</strong> is a Christ-centered community committed to proclaiming the Kingdom of God across Tanzania and beyond.</p>',
      image: '/images/SPCT/CHURCH.jpg'
    },
    {
      _id: 'content2',
      section: 'leadership',
      title: 'Our Leadership',
      content: JSON.stringify({
        introduction: 'Meet the dedicated leaders who guide our church.',
        leaders: [
          {
            name: 'Pastor John Doe',
            position: 'Senior Pastor',
            bio: 'Pastor John has been serving our church for over 10 years.',
            image: '/images/SPCT/CHURCH.jpg'
          },
          {
            name: 'Elder Jane Smith',
            position: 'Elder',
            bio: 'Elder Jane oversees our children\'s ministry.',
            image: '/images/SPCT/CHURCH.jpg'
          }
        ]
      }),
      image: '/images/SPCT/CHURCH.jpg'
    },
    {
      _id: 'content3',
      section: 'weekly_schedule',
      title: 'Weekly Schedule',
      content: JSON.stringify([
        {
          day: 'Sunday',
          events: [
            {
              name: 'Sunday School',
              time: '9:00 AM - 10:00 AM',
              location: 'Education Building'
            },
            {
              name: 'Worship Service',
              time: '10:30 AM - 12:00 PM',
              location: 'Main Sanctuary'
            }
          ]
        },
        {
          day: 'Wednesday',
          events: [
            {
              name: 'Bible Study',
              time: '7:00 PM - 8:30 PM',
              location: 'Fellowship Hall'
            }
          ]
        }
      ]),
      image: ''
    }
  ],
  contacts: []
};

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  console.log('Login attempt received:', { email, password });

  // Simple test authentication
  if (email === 'admin@shekinah.org' && password === 'admin123') {
    const user = {
      _id: 'admin123',
      name: 'Admin',
      email: 'admin@shekinah.org',
      isAdmin: true
    };

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || 'shekinah_presbyterian_church_secret_key',
      { expiresIn: '30d' }
    );

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
});

app.get('/api/auth/profile', (req, res) => {
  res.json({
    _id: 'admin123',
    name: 'Admin',
    email: 'admin@shekinah.org',
    isAdmin: true
  });
});

// Ministries routes
app.get('/api/ministries', (req, res) => {
  res.json(db.ministries);
});

app.get('/api/ministries/:id', (req, res) => {
  const ministry = db.ministries.find(m => m._id === req.params.id);
  if (ministry) {
    res.json(ministry);
  } else {
    res.status(404).json({ message: 'Ministry not found' });
  }
});

// Sermons routes
app.get('/api/sermons', (req, res) => {
  res.json(db.sermons);
});

app.get('/api/sermons/:id', (req, res) => {
  const sermon = db.sermons.find(s => s._id === req.params.id);
  if (sermon) {
    res.json(sermon);
  } else {
    res.status(404).json({ message: 'Sermon not found' });
  }
});

// Events routes
app.get('/api/events', (req, res) => {
  res.json(db.events);
});

app.get('/api/events/:id', (req, res) => {
  const event = db.events.find(e => e._id === req.params.id);
  if (event) {
    res.json(event);
  } else {
    res.status(404).json({ message: 'Event not found' });
  }
});

// Gallery routes
app.get('/api/gallery', (req, res) => {
  res.json(db.gallery);
});

app.get('/api/gallery/:id', (req, res) => {
  const galleryItem = db.gallery.find(g => g._id === req.params.id);
  if (galleryItem) {
    res.json(galleryItem);
  } else {
    res.status(404).json({ message: 'Gallery item not found' });
  }
});

// Content routes
app.get('/api/content', (req, res) => {
  console.log('GET /api/content - Returning all content:', db.content.length, 'items');
  res.json(db.content);
});

app.get('/api/content/:section', (req, res) => {
  console.log(`GET /api/content/${req.params.section} - Looking for content section`);
  const contentItem = db.content.find(c => c.section === req.params.section);
  if (contentItem) {
    console.log(`Content section "${req.params.section}" found:`, contentItem);
    res.json(contentItem);
  } else {
    console.log(`Content section "${req.params.section}" not found`);
    res.status(404).json({ message: 'Content not found' });
  }
});

app.post('/api/content', (req, res) => {
  console.log('POST /api/content - Creating or updating content:', req.body);
  const { section, title, content, image } = req.body;

  // Check if content exists
  const existingIndex = db.content.findIndex(c => c.section === section);

  if (existingIndex !== -1) {
    // Update existing content
    console.log(`Updating existing content section "${section}"`);
    db.content[existingIndex] = {
      ...db.content[existingIndex],
      title: title || db.content[existingIndex].title,
      content: content || db.content[existingIndex].content,
      image: image || db.content[existingIndex].image
    };
    res.json(db.content[existingIndex]);
  } else {
    // Create new content
    console.log(`Creating new content section "${section}"`);
    const newContent = {
      _id: `content${db.content.length + 1}`,
      section,
      title,
      content,
      image: image || ''
    };
    db.content.push(newContent);
    res.status(201).json(newContent);
  }
});

// Contact routes
app.post('/api/contact', (req, res) => {
  const newContact = {
    _id: `contact${db.contacts.length + 1}`,
    ...req.body,
    status: 'new',
    createdAt: new Date().toISOString()
  };
  db.contacts.push(newContact);
  res.status(201).json(newContact);
});

// Serve React app for any other routes in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'jsmart1-react', 'dist', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Set port and start server
const PORT = 5001; // Use a different port
app.listen(PORT, () => {
  console.log(`Local server running on port ${PORT}`);
  console.log('Using in-memory database instead of MongoDB');
  console.log('Admin login credentials:');
  console.log('Email: admin@shekinah.org');
  console.log('Password: admin123');
});
