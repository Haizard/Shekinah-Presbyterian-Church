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
const { protect, admin, finance, financeOnly } = require('../middleware/auth');

// Public routes
router.get('/active', getActivePaymentConfigs);

// Read-only routes - Both Admin and Finance can view
router.get('/', protect, finance, getPaymentConfigs);
router.get('/type/:gatewayType', protect, finance, getPaymentConfigsByType);
router.get('/:id', protect, finance, getPaymentConfigById);

// Finance-only routes - Only Finance users can modify
router.post('/', protect, financeOnly, createPaymentConfig);
router.put('/:id', protect, financeOnly, updatePaymentConfig);
router.delete('/:id', protect, financeOnly, deletePaymentConfig);

module.exports = router;
