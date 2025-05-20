const express = require('express');
const router = express.Router();
const {
  getPaymentConfigs,
  getActivePaymentConfigs,
  getPaymentConfigById,
  getPaymentConfigsByType,
  createPaymentConfig,
  updatePaymentConfig,
  deletePaymentConfig,
} = require('../controllers/paymentConfigController');
const { protect, admin } = require('../middleware/auth');

// Public routes
router.get('/active', getActivePaymentConfigs);

// Admin routes
router.route('/')
  .get(protect, admin, getPaymentConfigs)
  .post(protect, admin, createPaymentConfig);

router.route('/:id')
  .get(protect, admin, getPaymentConfigById)
  .put(protect, admin, updatePaymentConfig)
  .delete(protect, admin, deletePaymentConfig);

router.get('/type/:gatewayType', protect, admin, getPaymentConfigsByType);

module.exports = router;
