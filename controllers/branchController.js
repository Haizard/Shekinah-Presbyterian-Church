const Branch = require('../models/Branch');

// @desc    Get all branches
// @route   GET /api/branches
// @access  Public
const getBranches = async (req, res) => {
  try {
    const branches = await Branch.find({});
    res.json(branches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get branch by ID
// @route   GET /api/branches/:id
// @access  Public
const getBranchById = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);

    if (branch) {
      res.json(branch);
    } else {
      res.status(404).json({ message: 'Branch not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a branch
// @route   POST /api/branches
// @access  Private/Admin
const createBranch = async (req, res) => {
  try {
    const { name, location, pastor, contactInfo, establishedDate, memberCount, description, image } = req.body;

    const branch = new Branch({
      name,
      location,
      pastor,
      contactInfo,
      establishedDate: establishedDate || '',
      memberCount: memberCount || 0,
      description: description || '',
      image: image || '',
    });

    const createdBranch = await branch.save();
    res.status(201).json(createdBranch);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a branch
// @route   PUT /api/branches/:id
// @access  Private/Admin
const updateBranch = async (req, res) => {
  try {
    const { name, location, pastor, contactInfo, establishedDate, memberCount, description, image } = req.body;

    const branch = await Branch.findById(req.params.id);

    if (branch) {
      branch.name = name || branch.name;
      branch.location = location || branch.location;
      branch.pastor = pastor || branch.pastor;
      branch.contactInfo = contactInfo || branch.contactInfo;
      branch.establishedDate = establishedDate || branch.establishedDate;
      branch.memberCount = memberCount !== undefined ? memberCount : branch.memberCount;
      branch.description = description || branch.description;
      branch.image = image || branch.image;

      const updatedBranch = await branch.save();
      res.json(updatedBranch);
    } else {
      res.status(404).json({ message: 'Branch not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a branch
// @route   DELETE /api/branches/:id
// @access  Private/Admin
const deleteBranch = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);

    if (branch) {
      await branch.deleteOne();
      res.json({ message: 'Branch removed' });
    } else {
      res.status(404).json({ message: 'Branch not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getBranches,
  getBranchById,
  createBranch,
  updateBranch,
  deleteBranch,
};
