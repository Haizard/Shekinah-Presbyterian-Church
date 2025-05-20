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
const { protect, admin, finance, financeOnly } = require('../middleware/auth');

// Public routes
router.post('/', createDonation);

// Read-only routes - Both Admin and Finance can view
router.get('/', protect, finance, getDonations);
router.get('/stats', protect, finance, getDonationStats);
router.get('/status/:status', protect, finance, getDonationsByStatus);
router.get('/branch/:branchId', protect, finance, getDonationsByBranch);
router.get('/:id', protect, finance, getDonationById);

// Finance-only routes - Only Finance users can modify
router.put('/:id/status', protect, financeOnly, updateDonationStatus);
router.delete('/:id', protect, financeOnly, deleteDonation);

module.exports = router;
