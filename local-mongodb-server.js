const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

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

// MongoDB Connection with local database
const connectDB = async () => {
  try {
    // Use a local MongoDB connection
    const mongoURI = 'mongodb://localhost:27017/shekinah';
    
    await mongoose.connect(mongoURI);
    console.log('Connected to local MongoDB successfully');
    
    // Initialize admin user if it doesn't exist
    await initializeAdmin();
    
    // Continue with server setup after successful connection
    setupRoutes();
    startServer();
  } catch (err) {
    console.error('MongoDB connection error:', err);
    console.log('Falling back to in-memory database...');
    
    // Continue with server setup even if MongoDB connection fails
    setupFallbackRoutes();
    startServer();
  }
};

// Initialize admin user
const initializeAdmin = async () => {
  try {
    const User = require('./models/User');
    
    // Check if admin user exists
    const adminExists = await User.findOne({ email: 'admin@shekinah.org' });
    
    if (!adminExists) {
      console.log('Creating admin user...');
      
      // Create admin user
      const bcrypt = require('bcryptjs');
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
  } catch (error) {
    console.error('Error initializing admin user:', error);
  }
};

// Setup routes
const setupRoutes = () => {
  // Import Routes
  try {
    const authRoutes = require('./routes/auth');
    const ministryRoutes = require('./routes/ministries');
    const sermonRoutes = require('./routes/sermons');
    const eventRoutes = require('./routes/events');
    const galleryRoutes = require('./routes/gallery');
    const contentRoutes = require('./routes/content');
    const contactRoutes = require('./routes/contact');
    const uploadRoutes = require('./routes/upload');

    // Use Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/ministries', ministryRoutes);
    app.use('/api/sermons', sermonRoutes);
    app.use('/api/events', eventRoutes);
    app.use('/api/gallery', galleryRoutes);
    app.use('/api/content', contentRoutes);
    app.use('/api/contact', contactRoutes);
    app.use('/api/upload', uploadRoutes);
  } catch (error) {
    console.error('Error setting up routes:', error);
    
    // Setup fallback routes if there's an error
    setupFallbackRoutes();
  }

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
};

// Fallback routes for testing
const setupFallbackRoutes = () => {
  console.log('Setting up fallback routes with in-memory database');
  
  // In-memory data store
  const db = {
    users: [
      {
        _id: 'admin123',
        name: 'Admin',
        email: 'admin@shekinah.org',
        password: 'admin123',
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
      const jwt = require('jsonwebtoken');
      const token = jwt.sign(
        { id: 'admin123', isAdmin: true },
        process.env.JWT_SECRET || 'shekinah_presbyterian_church_secret_key',
        { expiresIn: '30d' }
      );
      
      res.json({
        _id: 'admin123',
        name: 'Admin',
        email: 'admin@shekinah.org',
        isAdmin: true,
        token
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  });

  // Basic test routes for other endpoints
  app.get('/api/ministries', (req, res) => {
    res.json(db.ministries);
  });
  
  app.get('/api/sermons', (req, res) => {
    res.json(db.sermons);
  });
  
  app.get('/api/events', (req, res) => {
    res.json(db.events);
  });
  
  app.get('/api/gallery', (req, res) => {
    res.json(db.gallery);
  });
  
  app.get('/api/content', (req, res) => {
    res.json(db.content);
  });
};

// Start the server
const startServer = () => {
  const PORT = process.env.PORT || 5002;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Admin login credentials:');
    console.log('Email: admin@shekinah.org');
    console.log('Password: admin123');
  });
};

// Connect to MongoDB and start server
connectDB();
