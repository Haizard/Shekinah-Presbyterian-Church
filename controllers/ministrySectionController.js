const MinistrySection = require('../models/MinistrySection');

// Get all ministry sections
const getAllMinistrySections = async (req, res) => {
  try {
    const sections = await MinistrySection.find().sort({ order: 1 });
    res.json(sections);
  } catch (error) {
    console.error('Error fetching ministry sections:', error);
    res.status(500).json({ message: 'Error fetching ministry sections', error: error.message });
  }
};

// Get a single ministry section by ID
const getMinistrySectionById = async (req, res) => {
  try {
    const section = await MinistrySection.findById(req.params.id);
    if (!section) {
      return res.status(404).json({ message: 'Ministry section not found' });
    }
    res.json(section);
  } catch (error) {
    console.error('Error fetching ministry section:', error);
    res.status(500).json({ message: 'Error fetching ministry section', error: error.message });
  }
};

// Get ministry section by sectionId
const getMinistrySectionBySectionId = async (req, res) => {
  try {
    const section = await MinistrySection.findOne({ sectionId: req.params.sectionId });
    if (!section) {
      return res.status(404).json({ message: 'Ministry section not found' });
    }
    res.json(section);
  } catch (error) {
    console.error('Error fetching ministry section:', error);
    res.status(500).json({ message: 'Error fetching ministry section', error: error.message });
  }
};

// Create a new ministry section
const createMinistrySection = async (req, res) => {
  try {
    const { title, description, image, focusAreas, order, sectionId } = req.body;

    if (!title || !description || !sectionId) {
      return res.status(400).json({ message: 'Title, description, and sectionId are required' });
    }

    const newSection = new MinistrySection({
      title,
      description,
      image: image || '',
      focusAreas: focusAreas || [],
      order: order || 0,
      sectionId,
    });

    const savedSection = await newSection.save();
    res.status(201).json(savedSection);
  } catch (error) {
    console.error('Error creating ministry section:', error);
    res.status(500).json({ message: 'Error creating ministry section', error: error.message });
  }
};

// Update a ministry section
const updateMinistrySection = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image, focusAreas, order, sectionId } = req.body;

    const section = await MinistrySection.findById(id);
    if (!section) {
      return res.status(404).json({ message: 'Ministry section not found' });
    }

    // Update fields
    if (title) section.title = title;
    if (description) section.description = description;
    if (image !== undefined) section.image = image;
    if (focusAreas) section.focusAreas = focusAreas;
    if (order !== undefined) section.order = order;
    if (sectionId) section.sectionId = sectionId;

    const updatedSection = await section.save();
    res.json(updatedSection);
  } catch (error) {
    console.error('Error updating ministry section:', error);
    res.status(500).json({ message: 'Error updating ministry section', error: error.message });
  }
};

// Delete a ministry section
const deleteMinistrySection = async (req, res) => {
  try {
    const { id } = req.params;

    const section = await MinistrySection.findByIdAndDelete(id);
    if (!section) {
      return res.status(404).json({ message: 'Ministry section not found' });
    }

    res.json({ message: 'Ministry section deleted successfully', section });
  } catch (error) {
    console.error('Error deleting ministry section:', error);
    res.status(500).json({ message: 'Error deleting ministry section', error: error.message });
  }
};

module.exports = {
  getAllMinistrySections,
  getMinistrySectionById,
  getMinistrySectionBySectionId,
  createMinistrySection,
  updateMinistrySection,
  deleteMinistrySection,
};

