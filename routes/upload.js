const express = require('express');
const router = express.Router();
const { uploadFile } = require('../controllers/uploadController');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  console.error('Multer error:', err);
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      message: 'File too large. Maximum size is 50MB.',
      error: err.message
    });
  }
  res.status(400).json({
    message: 'File upload error',
    error: err.message
  });
};

// Upload file with better error handling
router.post('/',
  protect,
  admin,
  (req, res, next) => {
    console.log('Upload route hit, processing authentication');
    next();
  },
  (req, res, next) => {
    upload.single('file')(req, res, (err) => {
      if (err) {
        console.error('Multer upload error:', err);
        return res.status(400).json({
          message: 'File upload failed',
          error: err.message
        });
      }
      next();
    });
  },
  uploadFile
);

module.exports = router;
