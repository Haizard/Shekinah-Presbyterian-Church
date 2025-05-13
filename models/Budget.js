const mongoose = require('mongoose');

// Budget Item Schema (for items within a budget)
const budgetItemSchema = mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['income', 'expense'],
  },
  amount: {
    type: Number,
    required: true,
    default: 0,
  },
  actual: {
    type: Number,
    default: 0,
  },
});

// Main Budget Schema
const budgetSchema = mongoose.Schema(
  {
    year: {
      type: Number,
      required: true,
    },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Branch',
      default: null,
    },
    items: [budgetItemSchema],
    notes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['draft', 'active', 'archived'],
      default: 'draft',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Create a compound index for year and branchId to ensure uniqueness
budgetSchema.index({ year: 1, branchId: 1 }, { unique: true });

const Budget = mongoose.model('Budget', budgetSchema);

module.exports = Budget;
