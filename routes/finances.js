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
const { protect, admin } = require('../middleware/auth');

// Get all finances
router.get('/', protect, admin, getFinances);

// Get finance summary
router.get('/summary', protect, admin, getFinanceSummary);

// Get finances by branch
router.get('/branch/:branchId', protect, admin, getFinancesByBranch);

// Get finance by ID
router.get('/:id', protect, admin, getFinanceById);

// Create a finance record
router.post('/', protect, admin, createFinance);

// Update a finance record
router.put('/:id', protect, admin, updateFinance);

// Delete a finance record
router.delete('/:id', protect, admin, deleteFinance);

module.exports = router;
