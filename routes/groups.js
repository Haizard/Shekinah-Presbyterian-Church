const express = require('express');
const router = express.Router();
const { 
  getGroups, 
  getGroupsByBranch,
  getGroupById, 
  createGroup, 
  updateGroup, 
  deleteGroup,
  getGroupMembers,
  addGroupMember,
  updateGroupMember,
  removeGroupMember
} = require('../controllers/groupController');
const { protect, admin } = require('../middleware/auth');

// Get all groups
router.get('/', protect, admin, getGroups);

// Get groups by branch
router.get('/branch/:branchId', protect, admin, getGroupsByBranch);

// Get group by ID
router.get('/:id', protect, admin, getGroupById);

// Create a group
router.post('/', protect, admin, createGroup);

// Update a group
router.put('/:id', protect, admin, updateGroup);

// Delete a group
router.delete('/:id', protect, admin, deleteGroup);

// Get members of a group
router.get('/:id/members', protect, admin, getGroupMembers);

// Add member to group
router.post('/:id/members', protect, admin, addGroupMember);

// Update group member
router.put('/members/:id', protect, admin, updateGroupMember);

// Remove member from group
router.delete('/members/:id', protect, admin, removeGroupMember);

module.exports = router;
