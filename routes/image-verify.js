/**
 * Image verification routes
 * These routes help diagnose image loading issues in production
 */
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { protect, admin } = require('../middleware/auth');

// Check if a file exists in various possible locations
const checkFileExists = (imagePath) => {
  const possibleLocations = [
    // Remove leading slash if present
    path.join(__dirname, '..', 'public', imagePath.replace(/^\//, '')),
    path.join(__dirname, '..', 'jsmart1-react', 'dist', imagePath.replace(/^\//, '')),
    path.join(__dirname, '..', 'jsmart1-react', 'dist', 'public', imagePath.replace(/^\//, '')),
    // Try with uploads explicitly in the path
    path.join(__dirname, '..', 'public', 'uploads', path.basename(imagePath)),
    path.join(__dirname, '..', 'jsmart1-react', 'dist', 'uploads', path.basename(imagePath)),
  ];

  const results = possibleLocations.map(location => {
    const exists = fs.existsSync(location);
    return {
      path: location,
      exists,
      size: exists ? fs.statSync(location).size : null,
      isDirectory: exists ? fs.statSync(location).isDirectory() : null,
    };
  });

  return {
    originalPath: imagePath,
    exists: results.some(r => r.exists),
    locations: results
  };
};

// Verify an image path
router.get('/verify', protect, admin, (req, res) => {
  const { path: imagePath } = req.query;
  
  if (!imagePath) {
    return res.status(400).json({ 
      success: false, 
      message: 'Image path is required' 
    });
  }

  try {
    const result = checkFileExists(imagePath);
    
    res.json({
      success: true,
      imagePath,
      exists: result.exists,
      locations: result.locations,
      serverInfo: {
        environment: process.env.NODE_ENV || 'development',
        workingDirectory: process.cwd(),
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error verifying image:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error verifying image', 
      error: error.message 
    });
  }
});

// List all files in the uploads directory
router.get('/list-uploads', protect, admin, (req, res) => {
  try {
    const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
    const distUploadsDir = path.join(__dirname, '..', 'jsmart1-react', 'dist', 'uploads');
    
    // Check if directories exist
    const uploadsDirExists = fs.existsSync(uploadsDir);
    const distUploadsDirExists = fs.existsSync(distUploadsDir);
    
    // Get files from public/uploads if it exists
    let publicFiles = [];
    if (uploadsDirExists) {
      publicFiles = fs.readdirSync(uploadsDir)
        .filter(file => !file.startsWith('.')) // Exclude hidden files
        .map(file => {
          const filePath = path.join(uploadsDir, file);
          const stats = fs.statSync(filePath);
          return {
            name: file,
            path: `/uploads/${file}`,
            size: stats.size,
            created: stats.birthtime,
            modified: stats.mtime
          };
        });
    }
    
    // Get files from dist/uploads if it exists
    let distFiles = [];
    if (distUploadsDirExists) {
      distFiles = fs.readdirSync(distUploadsDir)
        .filter(file => !file.startsWith('.')) // Exclude hidden files
        .map(file => {
          const filePath = path.join(distUploadsDir, file);
          const stats = fs.statSync(filePath);
          return {
            name: file,
            path: `/uploads/${file}`,
            size: stats.size,
            created: stats.birthtime,
            modified: stats.mtime
          };
        });
    }
    
    // Compare the two directories
    const onlyInPublic = publicFiles.filter(
      pFile => !distFiles.some(dFile => dFile.name === pFile.name)
    );
    
    const onlyInDist = distFiles.filter(
      dFile => !publicFiles.some(pFile => pFile.name === dFile.name)
    );
    
    const inBoth = publicFiles.filter(
      pFile => distFiles.some(dFile => dFile.name === pFile.name)
    );
    
    res.json({
      success: true,
      publicUploadsExists: uploadsDirExists,
      distUploadsExists: distUploadsDirExists,
      publicFiles: publicFiles.length,
      distFiles: distFiles.length,
      onlyInPublic: onlyInPublic.length,
      onlyInDist: onlyInDist.length,
      inBoth: inBoth.length,
      files: {
        public: publicFiles,
        dist: distFiles,
        onlyInPublic,
        onlyInDist
      },
      serverInfo: {
        environment: process.env.NODE_ENV || 'development',
        workingDirectory: process.cwd(),
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error listing uploads:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error listing uploads', 
      error: error.message 
    });
  }
});

module.exports = router;
