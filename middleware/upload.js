const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists with absolute path
const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Created uploads directory:', uploadDir);
}

// Set storage engine with better error handling
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Double-check directory exists before saving
    if (!fs.existsSync(uploadDir)) {
      return cb(new Error(`Upload directory does not exist: ${uploadDir}`));
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    try {
      // Create a safe filename
      const filename = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
      console.log('Creating file:', filename);
      cb(null, filename);
    } catch (error) {
      console.error('Error creating filename:', error);
      cb(error);
    }
  },
});

// Check file type with better error handling
function checkFileType(file, cb) {
  try {
    // Allowed extensions
    const filetypes = /jpeg|jpg|png|gif|mp3|mp4|pdf|doc|docx/;

    // Check extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    // Define allowed MIME types
    const allowedMimeTypes = [
      // Images
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif',
      // Audio
      'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg',
      // Video
      'video/mp4', 'video/mpeg', 'video/quicktime',
      // Documents
      'application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    // Check MIME type
    const validMime = allowedMimeTypes.includes(file.mimetype);

    console.log('File check:', {
      filename: file.originalname,
      mimetype: file.mimetype,
      extname: path.extname(file.originalname).toLowerCase(),
      isValidExt: extname,
      isValidMime: validMime,
      allowedMimeTypes: allowedMimeTypes.includes(file.mimetype)
    });

    // Accept if either extension or MIME type is valid
    if (extname || validMime) {
      return cb(null, true);
    } else {
      cb(new Error('Error: Only images, audio, video, documents, and PDF files are allowed!'));
    }
  } catch (error) {
    console.error('Error checking file type:', error);
    cb(error);
  }
}

// Initialize upload with better error handling
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // Increased to 50MB
  fileFilter: function (req, file, cb) {
    try {
      checkFileType(file, cb);
    } catch (error) {
      console.error('Multer filter error:', error);
      cb(error);
    }
  },
});

module.exports = upload;
