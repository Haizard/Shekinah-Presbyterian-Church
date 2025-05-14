const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:5002', 'http://localhost:5001'], // Allow requests from frontend origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static file serving configuration
if (process.env.NODE_ENV === 'production') {
  console.log('Setting up static file serving for production...');

  // CRITICAL: First, set up a direct route for uploads to ensure they're always accessible
  // This is the most important change - it ensures uploads are served directly without any middleware interference
  app.get('/uploads/*', (req, res, next) => {
    console.log('Direct uploads route hit:', req.path);

    // Try to serve from public/uploads first
    const publicPath = path.join(__dirname, 'public', req.path);
    if (fs.existsSync(publicPath)) {
      console.log('Serving from public uploads:', publicPath);
      return res.sendFile(publicPath);
    }

    // If not found in public, try dist/uploads
    const distPath = path.join(__dirname, 'jsmart1-react', 'dist', req.path);
    if (fs.existsSync(distPath)) {
      console.log('Serving from dist uploads:', distPath);
      return res.sendFile(distPath);
    }

    // If not found in either location, continue to next middleware
    console.log('File not found in uploads directories:', req.path);
    next();
  });

  // Special handling for the uploads directory to ensure it's always accessible
  // This is crucial for user-uploaded content - serve from public/uploads first
  app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads'), {
    maxAge: '0', // Disable caching for uploads
    etag: false, // Disable etag for uploads
    lastModified: false // Disable last-modified for uploads
  }));

  // Also serve from the dist/uploads directory as a fallback
  app.use('/uploads', express.static(path.join(__dirname, 'jsmart1-react', 'dist', 'uploads'), {
    maxAge: '0', // Disable caching for uploads
    etag: false, // Disable etag for uploads
    lastModified: false // Disable last-modified for uploads
  }));

  // Then serve static files from the public directory
  // This ensures public files take precedence over dist files
  app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: '1d' // Cache for 1 day
  }));

  // Finally serve static files from the React build directory
  app.use(express.static(path.join(__dirname, 'jsmart1-react', 'dist'), {
    maxAge: '1d' // Cache for 1 day
  }));

  console.log('Static file paths configured for production:');
  console.log('- Uploads direct route (highest priority)');
  console.log('- Uploads (1): ' + path.join(__dirname, 'public', 'uploads'));
  console.log('- Uploads (2): ' + path.join(__dirname, 'jsmart1-react', 'dist', 'uploads'));
  console.log('- Public: ' + path.join(__dirname, 'public'));
  console.log('- Dist: ' + path.join(__dirname, 'jsmart1-react', 'dist'));
} else {
  // In development, serve files from the public directory
  console.log('Setting up static file serving for development...');
  app.use(express.static(path.join(__dirname, 'public')));
  console.log('Static files served from: ' + path.join(__dirname, 'public'));
}

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
    console.log('MongoDB connected to:', mongoose.connection.host);
    console.log('Database name:', mongoose.connection.name);
    console.log('Connection state:', mongoose.connection.readyState);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.log('Server will continue to run, but database functionality may be limited');
  });

// Connection event handlers
mongoose.connection.on('connecting', () => {
  console.log('Connecting to MongoDB...');
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('disconnected', () => {
  console.log('Disconnected from MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Import Routes
const authRoutes = require('./routes/auth');
const ministryRoutes = require('./routes/ministries');
const sermonRoutes = require('./routes/sermons');
const eventRoutes = require('./routes/events');
const galleryRoutes = require('./routes/gallery');
const contentRoutes = require('./routes/content');
const contactRoutes = require('./routes/contact');
const uploadRoutes = require('./routes/upload');
const branchRoutes = require('./routes/branches');
const financeRoutes = require('./routes/finances');
const budgetRoutes = require('./routes/budgets');
const memberRoutes = require('./routes/members');
const groupRoutes = require('./routes/groups');
const imageVerifyRoutes = require('./routes/image-verify');

// Health check endpoint for Render
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/ministries', ministryRoutes);
app.use('/api/sermons', sermonRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/finances', financeRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/image-verify', imageVerifyRoutes);

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
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
