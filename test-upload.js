const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

// Create Express app
const app = express();

// Enable CORS
app.use(cors());

// Serve static files
app.use(express.static('public'));

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Created uploads directory:', uploadDir);
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Initialize multer upload
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Simple upload endpoint
app.post('/api/test-upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      console.log('No file received');
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    console.log('File uploaded successfully:', req.file);
    
    res.json({
      message: 'File uploaded successfully',
      filePath: `/uploads/${req.file.filename}`,
      file: req.file
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Simple test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Test endpoint working' });
});

// Start server
const PORT = 5003;
app.listen(PORT, () => {
  console.log(`Test upload server running on port ${PORT}`);
  console.log(`Upload directory: ${uploadDir}`);
});
