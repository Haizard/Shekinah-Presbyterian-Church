const Donation = require('../models/Donation');
const paymentGateways = require('../services/paymentGateways');

// @desc    Process M-Pesa payment
// @route   POST /api/payments/mpesa
// @access  Public
const processMpesaPayment = async (req, res) => {
  try {
    const { phone, amount, donationId } = req.body;

    // Validate request
    if (!phone || !amount || !donationId) {
      return res.status(400).json({
        success: false,
        message: 'Phone number, amount, and donation ID are required'
      });
    }

    // Find the donation
    const donation = await Donation.findById(donationId);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    // Initiate M-Pesa payment
    const paymentResult = await paymentGateways.initiateMpesaPayment({
      phone,
      amount,
      reference: donation.transactionId
    });

    if (!paymentResult.success) {
      return res.status(400).json(paymentResult);
    }

    // Update donation with payment information
    donation.paymentStatus = 'processing';
    await donation.save();

    res.json(paymentResult);
  } catch (error) {
    console.error('Error processing M-Pesa payment:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Process Tigo Pesa payment
// @route   POST /api/payments/tigopesa
// @access  Public
const processTigoPesaPayment = async (req, res) => {
  try {
    const { phone, amount, donationId } = req.body;

    // Validate request
    if (!phone || !amount || !donationId) {
      return res.status(400).json({
        success: false,
        message: 'Phone number, amount, and donation ID are required'
      });
    }

    // Find the donation
    const donation = await Donation.findById(donationId);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    // Initiate Tigo Pesa payment
    const paymentResult = await paymentGateways.initiateTigoPesaPayment({
      phone,
      amount,
      reference: donation.transactionId
    });

    if (!paymentResult.success) {
      return res.status(400).json(paymentResult);
    }

    // Update donation with payment information
    donation.paymentStatus = 'processing';
    await donation.save();

    res.json(paymentResult);
  } catch (error) {
    console.error('Error processing Tigo Pesa payment:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Process Airtel Money payment
// @route   POST /api/payments/airtel
// @access  Public
const processAirtelMoneyPayment = async (req, res) => {
  try {
    const { phone, amount, donationId } = req.body;

    // Validate request
    if (!phone || !amount || !donationId) {
      return res.status(400).json({
        success: false,
        message: 'Phone number, amount, and donation ID are required'
      });
    }

    // Find the donation
    const donation = await Donation.findById(donationId);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    // Initiate Airtel Money payment
    const paymentResult = await paymentGateways.initiateAirtelMoneyPayment({
      phone,
      amount,
      reference: donation.transactionId
    });

    if (!paymentResult.success) {
      return res.status(400).json(paymentResult);
    }

    // Update donation with payment information
    donation.paymentStatus = 'processing';
    await donation.save();

    res.json(paymentResult);
  } catch (error) {
    console.error('Error processing Airtel Money payment:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    M-Pesa callback
// @route   POST /api/payments/mpesa/callback
// @access  Public
const mpesaCallback = async (req, res) => {
  try {
    const { Body } = req.body;

    // Check if the callback is for a successful transaction
    if (Body.stkCallback.ResultCode === 0) {
      const { CallbackMetadata } = Body.stkCallback;

      // Extract transaction details
      const items = CallbackMetadata.Item;
      const amount = items.find(item => item.Name === 'Amount').Value;
      const mpesaReceiptNumber = items.find(item => item.Name === 'MpesaReceiptNumber').Value;
      const transactionDate = items.find(item => item.Name === 'TransactionDate').Value;
      const phoneNumber = items.find(item => item.Name === 'PhoneNumber').Value;

      // Find the donation by transaction reference
      const donation = await Donation.findOne({
        transactionId: Body.stkCallback.CheckoutRequestID
      });

      if (donation) {
        // Update donation status
        donation.paymentStatus = 'completed';
        donation.paymentReference = mpesaReceiptNumber;
        await donation.save();
      }
    }

    // Always respond with success to M-Pesa
    res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  } catch (error) {
    console.error('Error processing M-Pesa callback:', error);
    // Always respond with success to M-Pesa
    res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  }
};

// @desc    Tigo Pesa callback
// @route   POST /api/payments/tigopesa/callback
// @access  Public
const tigoPesaCallback = async (req, res) => {
  try {
    // Implementation will depend on Tigo Pesa's callback format
    // This is a placeholder for the actual implementation
    res.json({ status: 'success' });
  } catch (error) {
    console.error('Error processing Tigo Pesa callback:', error);
    res.json({ status: 'success' });
  }
};

// @desc    Airtel Money callback
// @route   POST /api/payments/airtel/callback
// @access  Public
const airtelMoneyCallback = async (req, res) => {
  try {
    // Implementation will depend on Airtel Money's callback format
    // This is a placeholder for the actual implementation
    res.json({ status: 'success' });
  } catch (error) {
    console.error('Error processing Airtel Money callback:', error);
    res.json({ status: 'success' });
  }
};

// @desc    Verify payment status
// @route   GET /api/payments/verify/:method/:id
// @access  Public
const verifyPayment = async (req, res) => {
  try {
    const { method, id } = req.params;

    // Find the donation
    const donation = await Donation.findById(id);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    // Verify payment status
    const verificationResult = await paymentGateways.verifyPayment(
      method,
      donation.transactionId
    );

    if (verificationResult.success && verificationResult.status === 'completed') {
      // Update donation status if payment is completed
      donation.paymentStatus = 'completed';
      await donation.save();
    }

    res.json({
      success: true,
      paymentStatus: donation.paymentStatus,
      verificationResult
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get bank account details
// @route   GET /api/payments/bank-details
// @access  Public
const getBankDetails = async (req, res) => {
  try {
    // Get bank account details from payment gateway service
    const bankDetailsResult = await paymentGateways.getBankDetails();

    if (!bankDetailsResult.success) {
      return res.status(404).json({
        success: false,
        message: 'Bank account details not found'
      });
    }

    res.json(bankDetailsResult);
  } catch (error) {
    console.error('Error getting bank account details:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  processMpesaPayment,
  processTigoPesaPayment,
  processAirtelMoneyPayment,
  mpesaCallback,
  tigoPesaCallback,
  airtelMoneyCallback,
  verifyPayment,
  getBankDetails
};
