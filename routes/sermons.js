const express = require('express');
const router = express.Router();
const { getSermons, getSermonById, createSermon, updateSermon, deleteSermon } = require('../controllers/sermonController');
const { protect, admin } = require('../middleware/auth');

// Get all sermons
router.get('/', getSermons);

// Get sermon by ID
router.get('/:id', getSermonById);

// Create a sermon
router.post('/', protect, admin, createSermon);

// Update a sermon
router.put('/:id', protect, admin, updateSermon);

// Delete a sermon
router.delete('/:id', protect, admin, deleteSermon);

module.exports = router;
