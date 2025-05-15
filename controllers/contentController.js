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

    console.log(`API: Processing ${section} content update/create request`);

    // For leadership content, log more details
    if (section === 'leadership' && content) {
      try {
        const contentObj = JSON.parse(content);
        if (contentObj.leaders && Array.isArray(contentObj.leaders)) {
          console.log(`API: Leadership content has ${contentObj.leaders.length} leaders in the request`);
        }
      } catch (e) {
        console.error('API: Error parsing leadership content in request:', e);
      }
    }

    // Check if content exists
    const contentExists = await Content.findOne({ section });

    if (contentExists) {
      // Update
      contentExists.title = title || contentExists.title;

      // Special handling for leadership content - complete replacement instead of merging
      if (section === 'leadership' && content) {
        try {
          // Parse new content to validate it
          const newData = JSON.parse(content);

          // Check if it has the expected structure
          if (newData.leaders && Array.isArray(newData.leaders)) {
            console.log(`Leadership content update: Replacing with ${newData.leaders.length} leaders`);

            // Simply use the new content directly - no merging
            contentExists.content = content;
          } else {
            // Fallback to standard update if structure is unexpected
            contentExists.content = content;
            console.log('Using standard update for leadership (unexpected structure)');
          }
        } catch (err) {
          console.error('Error parsing leadership content:', err);
          // If parsing fails, just update normally
          contentExists.content = content || contentExists.content;
        }
      } else {
        // Standard update for non-leadership content
        contentExists.content = content || contentExists.content;
      }

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
