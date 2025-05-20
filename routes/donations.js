const express = require('express');
const router = express.Router();
const {
  getDonations,
  getDonationsByStatus,
  getDonationsByBranch,
  getDonationById,
  createDonation,
  updateDonationStatus,
  deleteDonation,
  getDonationStats
} = require('../controllers/donationController');
const { protect, admin, finance } = require('../middleware/auth');

// Public routes
router.post('/', createDonation);

// Protected routes - Admin and Finance
router.get('/', protect, finance, getDonations);
router.get('/stats', protect, finance, getDonationStats);
router.get('/status/:status', protect, finance, getDonationsByStatus);
router.get('/branch/:branchId', protect, finance, getDonationsByBranch);
router.get('/:id', protect, finance, getDonationById);
router.put('/:id/status', protect, finance, updateDonationStatus);

// Admin-only routes
router.delete('/:id', protect, admin, deleteDonation);

module.exports = router;
