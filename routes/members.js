const express = require('express');
const router = express.Router();
const { 
  getMembers, 
  getMembersByBranch,
  getMemberById, 
  createMember, 
  updateMember, 
  deleteMember,
  getMemberStats
} = require('../controllers/memberController');
const { protect, admin } = require('../middleware/auth');

// Get all members
router.get('/', protect, admin, getMembers);

// Get member statistics
router.get('/stats', protect, admin, getMemberStats);

// Get members by branch
router.get('/branch/:branchId', protect, admin, getMembersByBranch);

// Get member by ID
router.get('/:id', protect, admin, getMemberById);

// Create a member
router.post('/', protect, admin, createMember);

// Update a member
router.put('/:id', protect, admin, updateMember);

// Delete a member
router.delete('/:id', protect, admin, deleteMember);

module.exports = router;
