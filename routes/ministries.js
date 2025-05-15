const express = require('express');
const router = express.Router();
const { getMinistries, getMinistryById, createMinistry, updateMinistry, deleteMinistry } = require('../controllers/ministryController');
const { protect, admin } = require('../middleware/auth');

// Get all ministries
router.get('/', getMinistries);

// Get ministry by ID
router.get('/:id', getMinistryById);

// Create a ministry
router.post('/', protect, admin, createMinistry);

// Update a ministry
router.put('/:id', protect, admin, updateMinistry);

// Delete a ministry
router.delete('/:id', protect, admin, deleteMinistry);

module.exports = router;
