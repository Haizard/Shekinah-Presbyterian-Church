const Ministry = require('../models/Ministry');

// @desc    Get all ministries
// @route   GET /api/ministries
// @access  Public
const getMinistries = async (req, res) => {
  try {
    const ministries = await Ministry.find({});
    res.json(ministries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get ministry by ID
// @route   GET /api/ministries/:id
// @access  Public
const getMinistryById = async (req, res) => {
  try {
    const ministry = await Ministry.findById(req.params.id);

    if (ministry) {
      res.json(ministry);
    } else {
      res.status(404).json({ message: 'Ministry not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a ministry
// @route   POST /api/ministries
// @access  Private/Admin
const createMinistry = async (req, res) => {
  try {
    const { title, category, description, image, leader, meetingTime } = req.body;

    const ministry = new Ministry({
      title,
      category,
      description,
      image,
      leader,
      meetingTime,
    });

    const createdMinistry = await ministry.save();
    res.status(201).json(createdMinistry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a ministry
// @route   PUT /api/ministries/:id
// @access  Private/Admin
const updateMinistry = async (req, res) => {
  try {
    const { title, category, description, image, leader, meetingTime } = req.body;

    const ministry = await Ministry.findById(req.params.id);

    if (ministry) {
      ministry.title = title || ministry.title;
      ministry.category = category || ministry.category;
      ministry.description = description || ministry.description;
      ministry.image = image || ministry.image;
      ministry.leader = leader || ministry.leader;
      ministry.meetingTime = meetingTime || ministry.meetingTime;

      const updatedMinistry = await ministry.save();
      res.json(updatedMinistry);
    } else {
      res.status(404).json({ message: 'Ministry not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a ministry
// @route   DELETE /api/ministries/:id
// @access  Private/Admin
const deleteMinistry = async (req, res) => {
  try {
    const ministry = await Ministry.findById(req.params.id);

    if (ministry) {
      await ministry.deleteOne();
      res.json({ message: 'Ministry removed' });
    } else {
      res.status(404).json({ message: 'Ministry not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getMinistries,
  getMinistryById,
  createMinistry,
  updateMinistry,
  deleteMinistry,
};
