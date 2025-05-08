const express = require('express');
const router = express.Router();
const { getAllContent, getContentBySection, createOrUpdateContent, deleteContent } = require('../controllers/contentController');
const { protect, admin } = require('../middleware/auth');

// Get all content
router.get('/', getAllContent);

// Get content by section
router.get('/:section', getContentBySection);

// Create or update content
router.post('/', protect, admin, createOrUpdateContent);

// Delete content
router.delete('/:section', protect, admin, deleteContent);

module.exports = router;
