const Content = require('../models/Content');

// @desc    Get all content
// @route   GET /api/content
// @access  Public
const getAllContent = async (req, res) => {
  try {
    const content = await Content.find({});
    res.json(content);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get content by section
// @route   GET /api/content/:section
// @access  Public
const getContentBySection = async (req, res) => {
  try {
    const content = await Content.findOne({ section: req.params.section });

    if (content) {
      res.json(content);
    } else {
      res.status(404).json({ message: 'Content not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create or update content
// @route   POST /api/content
// @access  Private/Admin
const createOrUpdateContent = async (req, res) => {
  try {
    const { section, title, content, image } = req.body;

    // Check if content exists
    const contentExists = await Content.findOne({ section });

    if (contentExists) {
      // Update
      contentExists.title = title || contentExists.title;
      contentExists.content = content || contentExists.content;
      contentExists.image = image || contentExists.image;

      const updatedContent = await contentExists.save();
      res.json(updatedContent);
    } else {
      // Create
      const newContent = new Content({
        section,
        title,
        content,
        image: image || '',
      });

      const createdContent = await newContent.save();
      res.status(201).json(createdContent);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete content
// @route   DELETE /api/content/:section
// @access  Private/Admin
const deleteContent = async (req, res) => {
  try {
    const content = await Content.findOne({ section: req.params.section });

    if (content) {
      await content.deleteOne();
      res.json({ message: 'Content removed' });
    } else {
      res.status(404).json({ message: 'Content not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllContent,
  getContentBySection,
  createOrUpdateContent,
  deleteContent,
};
