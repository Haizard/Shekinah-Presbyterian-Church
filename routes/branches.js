const express = require('express');
const router = express.Router();
const { 
  getBranches, 
  getBranchById, 
  createBranch, 
  updateBranch, 
  deleteBranch 
} = require('../controllers/branchController');
const { protect, admin } = require('../middleware/auth');

// Get all branches
router.get('/', getBranches);

// Get branch by ID
router.get('/:id', getBranchById);

// Create a branch
router.post('/', protect, admin, createBranch);

// Update a branch
router.put('/:id', protect, admin, updateBranch);

// Delete a branch
router.delete('/:id', protect, admin, deleteBranch);

module.exports = router;
