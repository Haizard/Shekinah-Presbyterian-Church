const express = require('express');
const router = express.Router();
const {
  processMpesaPayment,
  processTigoPesaPayment,
  processAirtelMoneyPayment,
  mpesaCallback,
  tigoPesaCallback,
  airtelMoneyCallback,
  verifyPayment,
  getBankDetails
} = require('../controllers/paymentController');

// Payment processing routes
router.post('/mpesa', processMpesaPayment);
router.post('/tigopesa', processTigoPesaPayment);
router.post('/airtel', processAirtelMoneyPayment);

// Payment callback routes
router.post('/mpesa/callback', mpesaCallback);
router.post('/tigopesa/callback', tigoPesaCallback);
router.post('/airtel/callback', airtelMoneyCallback);

// Payment verification route
router.get('/verify/:method/:id', verifyPayment);

// Bank details route
router.get('/bank-details', getBankDetails);

module.exports = router;
