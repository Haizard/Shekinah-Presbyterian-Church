const express = require('express');
const router = express.Router();
const {
  getAllMinistrySections,
  getMinistrySectionById,
  getMinistrySectionBySectionId,
  createMinistrySection,
  updateMinistrySection,
  deleteMinistrySection,
} = require('../controllers/ministrySectionController');
const { protect, admin } = require('../middleware/auth');

// Public routes
router.get('/', getAllMinistrySections);
router.get('/by-id/:id', getMinistrySectionById);
router.get('/by-section/:sectionId', getMinistrySectionBySectionId);

// Admin routes
router.post('/', protect, admin, createMinistrySection);
router.put('/:id', protect, admin, updateMinistrySection);
router.delete('/:id', protect, admin, deleteMinistrySection);

module.exports = router;

