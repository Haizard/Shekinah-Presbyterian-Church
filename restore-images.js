/**
 * Script to restore images from MongoDB to the filesystem
 * This script runs on server startup to ensure that images are available in the filesystem
 */
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import the Image model
const Image = require('./models/Image');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB connected to: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Restore images from MongoDB to filesystem
const restoreImages = async () => {
  try {
    console.log('Starting image restoration from MongoDB...');
    
    // Connect to MongoDB
    const conn = await connectDB();
    
    // Get all images from MongoDB
    const images = await Image.find();
    
    if (!images || images.length === 0) {
      console.log('No images found in database');
      await mongoose.disconnect();
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
        
        // Skip if the file already exists and has the same size
        if (fs.existsSync(filePath) && fs.statSync(filePath).size === image.size) {
          console.log(`File already exists with correct size: ${filePath}`);
        } else {
          fs.writeFileSync(filePath, image.data);
          console.log(`Restored image to public/uploads: ${image.filename}`);
        }
        
        // Write to dist/uploads if it exists
        if (fs.existsSync(distUploadsDir)) {
          const distFilePath = path.join(distUploadsDir, image.filename);
          
          // Skip if the file already exists and has the same size
          if (fs.existsSync(distFilePath) && fs.statSync(distFilePath).size === image.size) {
            console.log(`File already exists with correct size: ${distFilePath}`);
          } else {
            fs.writeFileSync(distFilePath, image.data);
            console.log(`Restored image to dist/uploads: ${image.filename}`);
          }
        }
        
        restoredCount++;
      } catch (error) {
        console.error(`Error restoring image ${image.filename}:`, error);
        errorCount++;
      }
    }
    
    console.log(`Restored ${restoredCount} images with ${errorCount} errors`);
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error restoring images:', error);
    process.exit(1);
  }
};

// Run the script
restoreImages();
