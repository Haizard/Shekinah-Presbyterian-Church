const express = require('express');
const router = express.Router();
const { getChurchSettings, updateChurchSettings } = require('../controllers/churchSettingsController');
const { protect, admin } = require('../middleware/auth');

// Public route - get church settings
router.get('/', getChurchSettings);

// Admin only - update church settings
router.put('/', protect, admin, updateChurchSettings);

module.exports = router;

