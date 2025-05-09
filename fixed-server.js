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

// MongoDB Connection with improved error handling
const connectDB = async () => {
  try {
    // Use a modified connection string with more options
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://haithammisape:hrz123@cluster0.jeis2ve.mongodb.net/shekinah?retryWrites=true&w=majority';
    
    // Set mongoose connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
      socketTimeoutMS: 45000, // Increase socket timeout
    };

    await mongoose.connect(mongoURI, options);
    console.log('MongoDB connected successfully');
    
    // Continue with server setup after successful connection
    setupRoutes();
    startServer();
  } catch (err) {
    console.error('MongoDB connection error:', err);
    console.log('Falling back to local test server...');
    
    // Continue with server setup even if MongoDB connection fails
    setupRoutes();
    startServer();
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
  console.log('Setting up fallback routes for testing');
  
  // Auth routes
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    console.log('Login attempt received:', { email, password });

    // Simple test authentication
    if (email === 'admin@shekinah.org' && password === 'admin123') {
      res.json({
        _id: '123456789',
        name: 'Admin',
        email: 'admin@shekinah.org',
        isAdmin: true,
        token: 'test-token-123456789'
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  });

  // Basic test routes for other endpoints
  app.get('/api/ministries', (req, res) => {
    res.json([
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
    ]);
  });

  // Add more fallback routes as needed
};

// Start the server
const startServer = () => {
  const PORT = process.env.PORT || 5002; // Use a different port
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Admin login credentials:');
    console.log('Email: admin@shekinah.org');
    console.log('Password: admin123');
  });
};

// Connect to MongoDB and start server
connectDB();
