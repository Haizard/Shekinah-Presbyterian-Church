const express = require('express');
const router = express.Router();
const { submitContactForm, getContactSubmissions, getContactById, updateContactStatus, deleteContact } = require('../controllers/contactController');
const { protect, admin } = require('../middleware/auth');

// Submit contact form
router.post('/', submitContactForm);

// Get all contact submissions
router.get('/', protect, admin, getContactSubmissions);

// Get contact submission by ID
router.get('/:id', protect, admin, getContactById);

// Update contact status
router.put('/:id', protect, admin, updateContactStatus);

// Delete contact submission
router.delete('/:id', protect, admin, deleteContact);

module.exports = router;
