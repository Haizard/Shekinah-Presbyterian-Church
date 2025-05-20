const mongoose = require('mongoose');

const paymentConfigSchema = mongoose.Schema(
  {
    // General settings
    name: {
      type: String,
      required: true,
      unique: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    
    // Gateway type
    gatewayType: {
      type: String,
      required: true,
      enum: ['mpesa', 'tigopesa', 'airtelmoney', 'bank', 'card'],
    },
    
    // M-Pesa settings
    mpesa: {
      businessName: String,
      businessNumber: String,
      shortCode: String,
      accountNumber: String,
      apiKey: String,
      apiSecret: String,
      passKey: String,
      initiatorName: String,
      initiatorPassword: String,
      callbackUrl: String,
      timeoutUrl: String,
      resultUrl: String,
      environment: {
        type: String,
        enum: ['sandbox', 'production'],
        default: 'sandbox',
      },
    },
    
    // Tigo Pesa settings
    tigopesa: {
      businessName: String,
      businessNumber: String,
      accountNumber: String,
      apiKey: String,
      apiSecret: String,
      callbackUrl: String,
      environment: {
        type: String,
        enum: ['sandbox', 'production'],
        default: 'sandbox',
      },
    },
    
    // Airtel Money settings
    airtelmoney: {
      businessName: String,
      businessNumber: String,
      accountNumber: String,
      apiKey: String,
      apiSecret: String,
      callbackUrl: String,
      environment: {
        type: String,
        enum: ['sandbox', 'production'],
        default: 'sandbox',
      },
    },
    
    // Bank account settings
    bank: {
      bankName: String,
      accountName: String,
      accountNumber: String,
      branchName: String,
      swiftCode: String,
      routingNumber: String,
      instructions: String,
    },
    
    // Card payment settings
    card: {
      provider: String,
      merchantId: String,
      publicKey: String,
      privateKey: String,
      environment: {
        type: String,
        enum: ['sandbox', 'production'],
        default: 'sandbox',
      },
    },
    
    // Display settings
    displayOrder: {
      type: Number,
      default: 0,
    },
    displayName: String,
    description: String,
    iconClass: String,
    
    // Additional settings
    additionalSettings: {
      type: Map,
      of: String,
    },
  },
  {
    timestamps: true,
  }
);

const PaymentConfig = mongoose.model('PaymentConfig', paymentConfigSchema);

module.exports = PaymentConfig;
