const express = require('express');
const router = express.Router();
const { getEvents, getEventById, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController');
const { protect, admin } = require('../middleware/auth');

// Get all events
router.get('/', getEvents);

// Get event by ID
router.get('/:id', getEventById);

// Create an event
router.post('/', protect, admin, createEvent);

// Update an event
router.put('/:id', protect, admin, updateEvent);

// Delete an event
router.delete('/:id', protect, admin, deleteEvent);

module.exports = router;
