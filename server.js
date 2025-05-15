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

  // Note: We no longer need a direct route for uploads because we're serving images from MongoDB
  // through the /api/upload/:filename route

  // Serve static files from the public directory
  app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: '1d' // Cache for 1 day
  }));

  // Serve static files from the React build directory
  app.use(express.static(path.join(__dirname, 'jsmart1-react', 'dist'), {
    maxAge: '1d' // Cache for 1 day
  }));

  console.log('Static file paths configured for production:');
  console.log('- Public: ' + path.join(__dirname, 'public'));
  console.log('- Dist: ' + path.join(__dirname, 'jsmart1-react', 'dist'));
  console.log('- Images are served from MongoDB through /api/upload/:filename');
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

// Function to restore images from MongoDB to filesystem
const restoreImagesFromMongoDB = async () => {
  try {
    // Only run in production
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    console.log('Restoring images from MongoDB to filesystem...');

    // Import the Image model
    const Image = require('./models/Image');

    // Get all images from MongoDB
    const images = await Image.find();

    if (!images || images.length === 0) {
      console.log('No images found in database');
      return;
    }

    console.log(`Found ${images.length} images in database`);

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(__dirname, 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('Created uploads directory:', uploadsDir);
    }

    // Create dist/uploads directory if it doesn't exist
    const distUploadsDir = path.join(__dirname, 'jsmart1-react', 'dist', 'uploads');
    if (fs.existsSync(path.join(__dirname, 'jsmart1-react', 'dist'))) {
      if (!fs.existsSync(distUploadsDir)) {
        fs.mkdirSync(distUploadsDir, { recursive: true });
        console.log('Created dist/uploads directory:', distUploadsDir);
      }
    }

    // Restore each image to the filesystem
    let restoredCount = 0;
    let errorCount = 0;

    for (const image of images) {
      try {
        // Write to public/uploads
        const filePath = path.join(uploadsDir, image.filename);
        fs.writeFileSync(filePath, image.data);

        // Write to dist/uploads if it exists
        if (fs.existsSync(distUploadsDir)) {
          const distFilePath = path.join(distUploadsDir, image.filename);
          fs.writeFileSync(distFilePath, image.data);
        }

        restoredCount++;
      } catch (error) {
        console.error(`Error restoring image ${image.filename}:`, error);
        errorCount++;
      }
    }

    console.log(`Restored ${restoredCount} images with ${errorCount} errors`);
  } catch (error) {
    console.error('Error restoring images:', error);
  }
};

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  // Restore images from MongoDB to filesystem
  await restoreImagesFromMongoDB();
});
