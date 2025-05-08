const express = require('express');
const router = express.Router();
const { uploadFile } = require('../controllers/uploadController');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Upload file
router.post('/', protect, admin, upload.single('file'), uploadFile);

module.exports = router;
