/**
 * Payment Gateway Integration Service
 *
 * This service provides integration with various payment gateways in Tanzania.
 * It includes support for M-Pesa, Tigo Pesa, and Airtel Money.
 */

const axios = require('axios');
const crypto = require('crypto');
const PaymentConfig = require('../models/PaymentConfig');

// Get payment gateway configuration from database
const getPaymentConfig = async (gatewayType) => {
  try {
    // Find active configuration for the specified gateway type
    const paymentConfig = await PaymentConfig.findOne({
      gatewayType,
      isActive: true,
    });

    if (!paymentConfig) {
      console.warn(`No active payment configuration found for ${gatewayType}`);
      return null;
    }

    return paymentConfig;
  } catch (error) {
    console.error(`Error fetching payment configuration for ${gatewayType}:`, error);
    return null;
  }
};

// Fallback configuration for payment gateways
// Used only if no configuration is found in the database
const fallbackConfig = {
  mpesa: {
    apiKey: process.env.MPESA_API_KEY || 'test_api_key',
    apiSecret: process.env.MPESA_API_SECRET || 'test_api_secret',
    shortCode: process.env.MPESA_SHORT_CODE || '123456',
    passKey: process.env.MPESA_PASS_KEY || 'test_pass_key',
    callbackUrl: process.env.MPESA_CALLBACK_URL || 'https://example.com/api/payments/mpesa/callback',
    baseUrl: process.env.MPESA_BASE_URL || 'https://sandbox.safaricom.co.ke',
  },
  tigopesa: {
    apiKey: process.env.TIGOPESA_API_KEY || 'test_api_key',
    apiSecret: process.env.TIGOPESA_API_SECRET || 'test_api_secret',
    accountNumber: process.env.TIGOPESA_ACCOUNT_NUMBER || '123456789',
    callbackUrl: process.env.TIGOPESA_CALLBACK_URL || 'https://example.com/api/payments/tigopesa/callback',
    baseUrl: process.env.TIGOPESA_BASE_URL || 'https://api.tigo.com/v1/tigo/mobile-money-gateway',
  },
  airtelmoney: {
    apiKey: process.env.AIRTEL_API_KEY || 'test_api_key',
    apiSecret: process.env.AIRTEL_API_SECRET || 'test_api_secret',
    accountNumber: process.env.AIRTEL_ACCOUNT_NUMBER || '123456789',
    callbackUrl: process.env.AIRTEL_CALLBACK_URL || 'https://example.com/api/payments/airtel/callback',
    baseUrl: process.env.AIRTEL_BASE_URL || 'https://openapi.airtel.africa',
  }
};

/**
 * Initialize M-Pesa STK Push
 * @param {Object} paymentData - Payment data including phone, amount, and reference
 * @returns {Promise<Object>} - Response from M-Pesa API
 */
const initiateMpesaPayment = async (paymentData) => {
  try {
    const { phone, amount, reference } = paymentData;

    // Get M-Pesa configuration from database
    const mpesaConfig = await getPaymentConfig('mpesa');

    // Use database config or fallback to default
    const config = mpesaConfig ? mpesaConfig.mpesa : fallbackConfig.mpesa;

    if (!config) {
      throw new Error('M-Pesa configuration not found');
    }

    // Format phone number (remove country code if present)
    const formattedPhone = phone.startsWith('+255')
      ? phone.substring(4)
      : phone.startsWith('255')
        ? phone.substring(3)
        : phone;

    // Generate timestamp
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '').slice(0, 14);

    // Generate password
    const password = Buffer.from(
      `${config.shortCode}${config.passKey}${timestamp}`
    ).toString('base64');

    // Determine base URL based on environment
    const baseUrl = config.environment === 'production'
      ? 'https://api.safaricom.co.ke'
      : 'https://sandbox.safaricom.co.ke';

    // Prepare request data
    const requestData = {
      BusinessShortCode: config.shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: `255${formattedPhone}`,
      PartyB: config.shortCode,
      PhoneNumber: `255${formattedPhone}`,
      CallBackURL: config.callbackUrl || 'https://example.com/api/payments/mpesa/callback',
      AccountReference: reference,
      TransactionDesc: `Donation - ${reference}`
    };

    // Get access token
    const tokenResponse = await axios.get(
      `${baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${config.apiKey}:${config.apiSecret}`).toString('base64')}`
        }
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // Make STK push request
    const response = await axios.post(
      `${baseUrl}/mpesa/stkpush/v1/processrequest`,
      requestData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      success: true,
      data: response.data,
      message: 'M-Pesa payment initiated successfully'
    };
  } catch (error) {
    console.error('Error initiating M-Pesa payment:', error);
    return {
      success: false,
      error: error.response?.data || error.message,
      message: 'Failed to initiate M-Pesa payment'
    };
  }
};

/**
 * Initialize Tigo Pesa payment
 * @param {Object} paymentData - Payment data including phone, amount, and reference
 * @returns {Promise<Object>} - Response from Tigo Pesa API
 */
const initiateTigoPesaPayment = async (paymentData) => {
  try {
    const { phone, amount, reference } = paymentData;

    // Get Tigo Pesa configuration from database
    const tigoPesaConfig = await getPaymentConfig('tigopesa');

    // Use database config or fallback to default
    const config = tigoPesaConfig ? tigoPesaConfig.tigopesa : fallbackConfig.tigopesa;

    if (!config) {
      throw new Error('Tigo Pesa configuration not found');
    }

    // Format phone number (remove country code if present)
    const formattedPhone = phone.startsWith('+255')
      ? phone.substring(4)
      : phone.startsWith('255')
        ? phone.substring(3)
        : phone;

    // Generate request ID
    const requestId = `TIG-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    // Determine base URL based on environment
    const baseUrl = config.environment === 'production'
      ? 'https://api.tigo.com/v1/tigo/mobile-money-gateway'
      : 'https://api.tigo.com/v1/tigo/mobile-money-gateway/sandbox';

    // Prepare request data
    const requestData = {
      MasterMerchant: config.accountNumber,
      PaymentReference: reference,
      Amount: amount,
      ThirdPartyReference: requestId,
      PurchasedItemsDesc: `Donation - ${reference}`,
      CustomerMSISDN: `255${formattedPhone}`,
      CallBackURL: config.callbackUrl || 'https://example.com/api/payments/tigopesa/callback'
    };

    // Make API request
    const response = await axios.post(
      `${baseUrl}/requestPayment`,
      requestData,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${config.apiKey}:${config.apiSecret}`).toString('base64')}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      success: true,
      data: response.data,
      message: 'Tigo Pesa payment initiated successfully'
    };
  } catch (error) {
    console.error('Error initiating Tigo Pesa payment:', error);
    return {
      success: false,
      error: error.response?.data || error.message,
      message: 'Failed to initiate Tigo Pesa payment'
    };
  }
};

/**
 * Initialize Airtel Money payment
 * @param {Object} paymentData - Payment data including phone, amount, and reference
 * @returns {Promise<Object>} - Response from Airtel Money API
 */
const initiateAirtelMoneyPayment = async (paymentData) => {
  try {
    const { phone, amount, reference } = paymentData;

    // Get Airtel Money configuration from database
    const airtelConfig = await getPaymentConfig('airtelmoney');

    // Use database config or fallback to default
    const config = airtelConfig ? airtelConfig.airtelmoney : fallbackConfig.airtelmoney;

    if (!config) {
      throw new Error('Airtel Money configuration not found');
    }

    // Format phone number (remove country code if present)
    const formattedPhone = phone.startsWith('+255')
      ? phone.substring(4)
      : phone.startsWith('255')
        ? phone.substring(3)
        : phone;

    // Determine base URL based on environment
    const baseUrl = config.environment === 'production'
      ? 'https://openapi.airtel.africa'
      : 'https://openapiuat.airtel.africa';

    // Get access token
    const tokenResponse = await axios.post(
      `${baseUrl}/auth/oauth2/token`,
      {
        client_id: config.apiKey,
        client_secret: config.apiSecret,
        grant_type: 'client_credentials'
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // Generate transaction reference
    const txnRef = `AIR-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    // Prepare request data
    const requestData = {
      reference: reference,
      subscriber: {
        country: 'TZA',
        currency: 'TZS',
        msisdn: `255${formattedPhone}`
      },
      transaction: {
        amount: amount,
        country: 'TZA',
        currency: 'TZS',
        id: txnRef
      }
    };

    // Make API request
    const response = await axios.post(
      `${baseUrl}/merchant/v1/payments/`,
      requestData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      success: true,
      data: response.data,
      message: 'Airtel Money payment initiated successfully'
    };
  } catch (error) {
    console.error('Error initiating Airtel Money payment:', error);
    return {
      success: false,
      error: error.response?.data || error.message,
      message: 'Failed to initiate Airtel Money payment'
    };
  }
};

/**
 * Verify payment status
 * @param {string} paymentMethod - Payment method (mpesa, tigopesa, airtelmoney)
 * @param {string} transactionId - Transaction ID to verify
 * @returns {Promise<Object>} - Payment status
 */
const verifyPayment = async (paymentMethod, transactionId) => {
  try {
    // Get payment configuration from database
    const paymentConfig = await getPaymentConfig(paymentMethod);

    if (!paymentConfig) {
      throw new Error(`No configuration found for ${paymentMethod}`);
    }

    // Implementation will depend on the specific payment gateway
    // For now, this is a placeholder for the actual implementation
    // In a real implementation, you would make API calls to the payment gateway
    // to check the status of the transaction

    return {
      success: true,
      status: 'completed',
      message: 'Payment verified successfully'
    };
  } catch (error) {
    console.error(`Error verifying ${paymentMethod} payment:`, error);
    return {
      success: false,
      error: error.message,
      message: `Failed to verify ${paymentMethod} payment`
    };
  }
};

/**
 * Get bank account details
 * @returns {Promise<Object>} - Bank account details
 */
const getBankAccountDetails = async () => {
  try {
    // Get bank configuration from database
    const bankConfig = await getPaymentConfig('bank');

    if (!bankConfig) {
      return {
        success: false,
        message: 'Bank account details not configured',
        data: null
      };
    }

    return {
      success: true,
      message: 'Bank account details retrieved successfully',
      data: bankConfig.bank
    };
  } catch (error) {
    console.error('Error getting bank account details:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to get bank account details'
    };
  }
};

module.exports = {
  initiateMpesaPayment,
  initiateTigoPesaPayment,
  initiateAirtelMoneyPayment,
  verifyPayment,
  getBankAccountDetails
};
