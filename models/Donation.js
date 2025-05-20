const mongoose = require('mongoose');

const donationSchema = mongoose.Schema(
  {
    // Donor information
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: '',
    },
    
    // Donation details
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'Tsh',
    },
    donationType: {
      type: String,
      required: true,
      enum: ['one-time', 'monthly', 'quarterly', 'annually'],
    },
    category: {
      type: String,
      required: true,
      enum: ['tithe', 'offering', 'missions', 'building', 'charity', 'other'],
    },
    designation: {
      type: String,
      default: '',
    },
    
    // Payment information
    paymentMethod: {
      type: String,
      required: true,
      enum: ['mpesa', 'tigopesa', 'airtelmoney', 'bank', 'card', 'cash'],
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    transactionId: {
      type: String,
      default: '',
    },
    paymentReference: {
      type: String,
      default: '',
    },
    
    // Church branch information
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Branch',
      default: null,
    },
    
    // Additional information
    notes: {
      type: String,
      default: '',
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    receiptSent: {
      type: Boolean,
      default: false,
    },
    receiptId: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for common queries
donationSchema.index({ paymentStatus: 1 });
donationSchema.index({ donationType: 1 });
donationSchema.index({ category: 1 });
donationSchema.index({ branchId: 1 });
donationSchema.index({ createdAt: 1 });

const Donation = mongoose.model('Donation', donationSchema);

module.exports = Donation;
