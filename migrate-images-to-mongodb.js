/**
 * Script to migrate existing images from the filesystem to MongoDB
 * This script scans the uploads directory and stores all images in MongoDB
 */
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const mime = require('mime-types');

// Load environment variables
dotenv.config();

// Import the Image model
const Image = require('./models/Image');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected to: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Migrate images from filesystem to MongoDB
const migrateImages = async () => {
  try {
    console.log('Starting image migration to MongoDB...');
    
    // Connect to MongoDB
    const conn = await connectDB();
    
    // Get all files from the uploads directory
    const uploadsDir = path.join(__dirname, 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      console.error(`Uploads directory does not exist: ${uploadsDir}`);
      await mongoose.disconnect();
      return;
    }
    
    // Get all files in the uploads directory
    const files = fs.readdirSync(uploadsDir);
    console.log(`Found ${files.length} files in uploads directory`);
    
    // Skip hidden files and directories
    const imageFiles = files.filter(file => 
      !file.startsWith('.') && 
      fs.statSync(path.join(uploadsDir, file)).isFile()
    );
    
    console.log(`Found ${imageFiles.length} image files to migrate`);
    
    // Migrate each image to MongoDB
    let migratedCount = 0;
    let errorCount = 0;
    let skippedCount = 0;
    
    for (const filename of imageFiles) {
      try {
        // Check if the image already exists in MongoDB
        const existingImage = await Image.findOne({ filename });
        
        if (existingImage) {
          console.log(`Image already exists in MongoDB: ${filename}`);
          skippedCount++;
          continue;
        }
        
        // Get the file path
        const filePath = path.join(uploadsDir, filename);
        
        // Get file stats
        const stats = fs.statSync(filePath);
        
        // Read the file data
        const fileData = fs.readFileSync(filePath);
        
        // Determine the mimetype
        const mimetype = mime.lookup(filePath) || 'application/octet-stream';
        
        // Create a new Image document
        const image = new Image({
          filename,
          originalname: filename,
          mimetype,
          size: stats.size,
          data: fileData
        });
        
        // Save the image to MongoDB
        await image.save();
        console.log(`Migrated image to MongoDB: ${filename}`);
        migratedCount++;
      } catch (error) {
        console.error(`Error migrating image ${filename}:`, error);
        errorCount++;
      }
    }
    
    console.log(`Migration completed: ${migratedCount} images migrated, ${skippedCount} skipped, ${errorCount} errors`);
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error migrating images:', error);
    process.exit(1);
  }
};

// Run the script
migrateImages();
