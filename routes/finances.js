const express = require('express');
const router = express.Router();
const {
  getFinances,
  getFinancesByBranch,
  getFinanceById,
  createFinance,
  updateFinance,
  deleteFinance,
  getFinanceSummary
} = require('../controllers/financeController');
const { protect, admin, finance, financeOnly } = require('../middleware/auth');

// Get all finances
router.get('/', protect, finance, getFinances);

// Get finance summary
router.get('/summary', protect, finance, getFinanceSummary);

// Get finances by branch
router.get('/branch/:branchId', protect, finance, getFinancesByBranch);

// Get finance by ID
router.get('/:id', protect, finance, getFinanceById);

// Create a finance record - only finance users can create
router.post('/', protect, financeOnly, createFinance);

// Update a finance record - only finance users can update
router.put('/:id', protect, financeOnly, updateFinance);

// Delete a finance record - only finance users can delete
router.delete('/:id', protect, financeOnly, deleteFinance);

module.exports = router;
