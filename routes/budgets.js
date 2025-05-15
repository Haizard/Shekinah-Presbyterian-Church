const express = require('express');
const router = express.Router();
const {
  getBudgets,
  getBudgetByYearAndBranch,
  getBudgetById,
  createBudget,
  updateBudget,
  deleteBudget,
  updateBudgetActuals
} = require('../controllers/budgetController');
const { protect, admin, finance, financeOnly } = require('../middleware/auth');

// Get all budgets
router.get('/', protect, finance, getBudgets);

// Get budget by year and branch
router.get('/year/:year/branch/:branchId', protect, finance, getBudgetByYearAndBranch);

// Update budget actuals based on transactions
router.get('/update-actuals/:year/:branchId', protect, finance, updateBudgetActuals);

// Get budget by ID
router.get('/:id', protect, finance, getBudgetById);

// Create a budget - only finance users can create
router.post('/', protect, financeOnly, createBudget);

// Update a budget - only finance users can update
router.put('/:id', protect, financeOnly, updateBudget);

// Delete a budget - only finance users can delete
router.delete('/:id', protect, financeOnly, deleteBudget);

module.exports = router;
