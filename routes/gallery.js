const express = require('express');
const router = express.Router();
const { getGalleryItems, getGalleryItemById, createGalleryItem, updateGalleryItem, deleteGalleryItem } = require('../controllers/galleryController');
const { protect, admin } = require('../middleware/auth');

// Get all gallery items
router.get('/', getGalleryItems);

// Get gallery item by ID
router.get('/:id', getGalleryItemById);

// Create a gallery item
router.post('/', protect, admin, createGalleryItem);

// Update a gallery item
router.put('/:id', protect, admin, updateGalleryItem);

// Delete a gallery item
router.delete('/:id', protect, admin, deleteGalleryItem);

module.exports = router;
