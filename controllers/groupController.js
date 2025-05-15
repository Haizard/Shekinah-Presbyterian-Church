const Group = require('../models/Group');
const GroupMember = require('../models/GroupMember');
const Member = require('../models/Member');

// @desc    Get all groups
// @route   GET /api/groups
// @access  Private/Admin
const getGroups = async (req, res) => {
  try {
    const groups = await Group.find({}).sort({ name: 1 });
    res.json(groups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get groups by branch
// @route   GET /api/groups/branch/:branchId
// @access  Private/Admin
const getGroupsByBranch = async (req, res) => {
  try {
    const groups = await Group.find({ branchId: req.params.branchId }).sort({ name: 1 });
    res.json(groups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get group by ID
// @route   GET /api/groups/:id
// @access  Private/Admin
const getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (group) {
      res.json(group);
    } else {
      res.status(404).json({ message: 'Group not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a group
// @route   POST /api/groups
// @access  Private/Admin
const createGroup = async (req, res) => {
  try {
    const { 
      name, 
      category, 
      description, 
      leader, 
      meetingTime, 
      meetingLocation, 
      branchId, 
      image 
    } = req.body;

    const group = new Group({
      name,
      category,
      description: description || '',
      leader,
      meetingTime: meetingTime || '',
      meetingLocation: meetingLocation || '',
      branchId: branchId || null,
      image: image || '',
    });

    const createdGroup = await group.save();
    res.status(201).json(createdGroup);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a group
// @route   PUT /api/groups/:id
// @access  Private/Admin
const updateGroup = async (req, res) => {
  try {
    const { 
      name, 
      category, 
      description, 
      leader, 
      meetingTime, 
      meetingLocation, 
      branchId, 
      image 
    } = req.body;

    const group = await Group.findById(req.params.id);

    if (group) {
      group.name = name || group.name;
      group.category = category || group.category;
      group.description = description || group.description;
      group.leader = leader || group.leader;
      group.meetingTime = meetingTime || group.meetingTime;
      group.meetingLocation = meetingLocation || group.meetingLocation;
      group.branchId = branchId !== undefined ? branchId : group.branchId;
      group.image = image || group.image;

      const updatedGroup = await group.save();
      res.json(updatedGroup);
    } else {
      res.status(404).json({ message: 'Group not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a group
// @route   DELETE /api/groups/:id
// @access  Private/Admin
const deleteGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (group) {
      // Delete all group members first
      await GroupMember.deleteMany({ groupId: group._id });
      
      // Then delete the group
      await group.deleteOne();
      res.json({ message: 'Group removed' });
    } else {
      res.status(404).json({ message: 'Group not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get members of a group
// @route   GET /api/groups/:id/members
// @access  Private/Admin
const getGroupMembers = async (req, res) => {
  try {
    const groupMembers = await GroupMember.find({ groupId: req.params.id })
      .populate('memberId', 'firstName lastName email phone membershipStatus image');
    
    res.json(groupMembers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add member to group
// @route   POST /api/groups/:id/members
// @access  Private/Admin
const addGroupMember = async (req, res) => {
  try {
    const { memberId, role, joinDate } = req.body;
    const groupId = req.params.id;

    // Check if group exists
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if member exists
    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    // Check if member is already in the group
    const existingMember = await GroupMember.findOne({ groupId, memberId });
    if (existingMember) {
      return res.status(400).json({ message: 'Member is already in this group' });
    }

    // Add member to group
    const groupMember = new GroupMember({
      groupId,
      memberId,
      role: role || 'member',
      joinDate: joinDate || new Date().toISOString().split('T')[0],
    });

    const createdGroupMember = await groupMember.save();
    
    // Populate member details for response
    const populatedGroupMember = await GroupMember.findById(createdGroupMember._id)
      .populate('memberId', 'firstName lastName email phone membershipStatus image');

    res.status(201).json(populatedGroupMember);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update group member
// @route   PUT /api/groups/members/:id
// @access  Private/Admin
const updateGroupMember = async (req, res) => {
  try {
    const { role, joinDate } = req.body;
    
    const groupMember = await GroupMember.findById(req.params.id);
    
    if (groupMember) {
      groupMember.role = role || groupMember.role;
      groupMember.joinDate = joinDate || groupMember.joinDate;
      
      const updatedGroupMember = await groupMember.save();
      
      // Populate member details for response
      const populatedGroupMember = await GroupMember.findById(updatedGroupMember._id)
        .populate('memberId', 'firstName lastName email phone membershipStatus image');
      
      res.json(populatedGroupMember);
    } else {
      res.status(404).json({ message: 'Group member not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Remove member from group
// @route   DELETE /api/groups/members/:id
// @access  Private/Admin
const removeGroupMember = async (req, res) => {
  try {
    const groupMember = await GroupMember.findById(req.params.id);
    
    if (groupMember) {
      await groupMember.deleteOne();
      res.json({ message: 'Member removed from group' });
    } else {
      res.status(404).json({ message: 'Group member not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getGroups,
  getGroupsByBranch,
  getGroupById,
  createGroup,
  updateGroup,
  deleteGroup,
  getGroupMembers,
  addGroupMember,
  updateGroupMember,
  removeGroupMember,
};
