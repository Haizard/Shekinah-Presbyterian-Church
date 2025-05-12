const mongoose = require('mongoose');

const financeSchema = mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['income', 'expense'],
    },
    category: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    reference: {
      type: String,
      default: '',
    },
    approvedBy: {
      type: String,
      default: '',
    },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Branch',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Finance = mongoose.model('Finance', financeSchema);

module.exports = Finance;
