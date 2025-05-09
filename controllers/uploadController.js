const path = require('path');
const fs = require('fs');

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
