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
const { protect, admin, finance } = require('../middleware/auth');

// Get all finances
router.get('/', protect, finance, getFinances);

// Get finance summary
router.get('/summary', protect, finance, getFinanceSummary);

// Get finances by branch
router.get('/branch/:branchId', protect, finance, getFinancesByBranch);

// Get finance by ID
router.get('/:id', protect, finance, getFinanceById);

// Create a finance record
router.post('/', protect, finance, createFinance);

// Update a finance record
router.put('/:id', protect, finance, updateFinance);

// Delete a finance record
router.delete('/:id', protect, finance, deleteFinance);

module.exports = router;
