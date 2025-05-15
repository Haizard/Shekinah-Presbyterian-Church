const Member = require('../models/Member');

// @desc    Get all members
// @route   GET /api/members
// @access  Private/Admin
const getMembers = async (req, res) => {
  try {
    const members = await Member.find({}).sort({ lastName: 1, firstName: 1 });
    res.json(members);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get members by branch
// @route   GET /api/members/branch/:branchId
// @access  Private/Admin
const getMembersByBranch = async (req, res) => {
  try {
    const members = await Member.find({ branchId: req.params.branchId }).sort({ lastName: 1, firstName: 1 });
    res.json(members);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get member by ID
// @route   GET /api/members/:id
// @access  Private/Admin
const getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);

    if (member) {
      res.json(member);
    } else {
      res.status(404).json({ message: 'Member not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a member
// @route   POST /api/members
// @access  Private/Admin
const createMember = async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      address, 
      dateOfBirth, 
      joinDate, 
      baptismDate, 
      membershipStatus, 
      branchId, 
      image, 
      notes 
    } = req.body;

    const member = new Member({
      firstName,
      lastName,
      email: email || '',
      phone,
      address: address || '',
      dateOfBirth: dateOfBirth || '',
      joinDate,
      baptismDate: baptismDate || '',
      membershipStatus,
      branchId: branchId || null,
      image: image || '',
      notes: notes || '',
    });

    const createdMember = await member.save();
    res.status(201).json(createdMember);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a member
// @route   PUT /api/members/:id
// @access  Private/Admin
const updateMember = async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      address, 
      dateOfBirth, 
      joinDate, 
      baptismDate, 
      membershipStatus, 
      branchId, 
      image, 
      notes 
    } = req.body;

    const member = await Member.findById(req.params.id);

    if (member) {
      member.firstName = firstName || member.firstName;
      member.lastName = lastName || member.lastName;
      member.email = email || member.email;
      member.phone = phone || member.phone;
      member.address = address || member.address;
      member.dateOfBirth = dateOfBirth || member.dateOfBirth;
      member.joinDate = joinDate || member.joinDate;
      member.baptismDate = baptismDate || member.baptismDate;
      member.membershipStatus = membershipStatus || member.membershipStatus;
      member.branchId = branchId !== undefined ? branchId : member.branchId;
      member.image = image || member.image;
      member.notes = notes || member.notes;

      const updatedMember = await member.save();
      res.json(updatedMember);
    } else {
      res.status(404).json({ message: 'Member not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a member
// @route   DELETE /api/members/:id
// @access  Private/Admin
const deleteMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);

    if (member) {
      await member.deleteOne();
      res.json({ message: 'Member removed' });
    } else {
      res.status(404).json({ message: 'Member not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get member statistics
// @route   GET /api/members/stats
// @access  Private/Admin
const getMemberStats = async (req, res) => {
  try {
    // Get total members
    const totalMembers = await Member.countDocuments();

    // Get members by status
    const membersByStatus = await Member.aggregate([
      { $group: { _id: '$membershipStatus', count: { $sum: 1 } } }
    ]);

    // Get members by branch
    const membersByBranch = await Member.aggregate([
      { $group: { _id: '$branchId', count: { $sum: 1 } } }
    ]);

    res.json({
      totalMembers,
      membersByStatus,
      membersByBranch
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getMembers,
  getMembersByBranch,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
  getMemberStats,
};
