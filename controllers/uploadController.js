const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// Function to calculate file hash for verification
const calculateFileHash = (filePath) => {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash('md5');
    hashSum.update(fileBuffer);
    return hashSum.digest('hex');
  } catch (error) {
    console.error(`Error calculating hash for ${filePath}:`, error);
    return null;
  }
};

// Function to copy a file with verification
const copyFile = (source, destination) => {
  try {
    // Calculate source file hash before copying
    const sourceHash = calculateFileHash(source);

    // Copy the file
    fs.copyFileSync(source, destination);

    // Verify the copy was successful by comparing file hashes
    const destHash = calculateFileHash(destination);

    if (sourceHash && destHash && sourceHash === destHash) {
      console.log(`Copied and verified: ${source} -> ${destination}`);
      return true;
    } else {
      console.error(`File verification failed for ${destination}. Hash mismatch.`);
      return false;
    }
  } catch (error) {
    console.error(`Error copying file ${source}:`, error);
    return false;
  }
};

// @desc    Upload file
// @route   POST /api/upload
// @access  Private/Admin
const uploadFile = async (req, res) => {
  try {
    console.log('Upload request received:', {
      headers: req.headers,
      body: req.body,
      file: req.file ? 'File present' : 'No file'
    });

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('Created uploads directory:', uploadsDir);
    }

    // Verify the file exists
    const filePath = path.join(uploadsDir, req.file.filename);
    if (!fs.existsSync(filePath)) {
      console.error('File not saved to disk:', filePath);
      return res.status(500).json({ message: 'File upload failed - file not saved to disk' });
    }

    // CRITICAL FIX: Also save to persistent directory if it's defined
    const persistentDir = process.env.PERSISTENT_DIR;
    if (persistentDir) {
      // Ensure the persistent directory exists
      if (!fs.existsSync(persistentDir)) {
        fs.mkdirSync(persistentDir, { recursive: true });
        console.log('Created persistent directory:', persistentDir);
      }

      // Copy the file to the persistent directory
      const persistentPath = path.join(persistentDir, req.file.filename);
      const copySuccess = copyFile(filePath, persistentPath);

      if (copySuccess) {
        console.log(`File also saved to persistent directory: ${persistentPath}`);
      } else {
        console.error(`Failed to save file to persistent directory: ${persistentPath}`);
      }
    }

    // CRITICAL FIX: Also save to dist/uploads directory
    const distUploadsDir = path.join(__dirname, '..', 'jsmart1-react', 'dist', 'uploads');
    if (fs.existsSync(path.join(__dirname, '..', 'jsmart1-react', 'dist'))) {
      // Ensure the dist/uploads directory exists
      if (!fs.existsSync(distUploadsDir)) {
        fs.mkdirSync(distUploadsDir, { recursive: true });
        console.log('Created dist/uploads directory:', distUploadsDir);
      }

      // Copy the file to the dist/uploads directory
      const distPath = path.join(distUploadsDir, req.file.filename);
      const distCopySuccess = copyFile(filePath, distPath);

      if (distCopySuccess) {
        console.log(`File also saved to dist/uploads directory: ${distPath}`);
      } else {
        console.error(`Failed to save file to dist/uploads directory: ${distPath}`);
      }
    }

    console.log('File uploaded successfully:', {
      filename: req.file.filename,
      originalname: req.file.originalname,
      size: req.file.size,
      path: filePath,
      mimetype: req.file.mimetype
    });

    // Return the file path that can be used in the frontend
    res.json({
      message: 'File uploaded successfully',
      filePath: `/uploads/${req.file.filename}`,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  uploadFile,
};
