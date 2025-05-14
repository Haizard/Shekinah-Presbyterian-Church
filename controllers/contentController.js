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

      // Special handling for leadership content to preserve existing leaders
      if (section === 'leadership' && content && contentExists.content) {
        try {
          // Parse existing content
          const existingData = JSON.parse(contentExists.content);
          // Parse new content
          const newData = JSON.parse(content);

          // If both have leaders array, merge them
          if (existingData.leaders && Array.isArray(existingData.leaders) &&
              newData.leaders && Array.isArray(newData.leaders)) {

            console.log('Merging leadership data');

            // Create a map of existing leaders by name for quick lookup
            const existingLeadersMap = {};
            for (const leader of existingData.leaders) {
              if (leader.name) {
                existingLeadersMap[leader.name.toLowerCase()] = leader;
              }
            }

            // Process new leaders
            const mergedLeaders = [...existingData.leaders]; // Start with all existing leaders

            // For each new leader
            for (const newLeader of newData.leaders) {
              if (!newLeader.name) continue; // Skip leaders without names

              const lowerName = newLeader.name.toLowerCase();

              // Check if this leader already exists (by name)
              if (existingLeadersMap[lowerName]) {
                // Update existing leader
                const existingIndex = mergedLeaders.findIndex(
                  l => l.name && l.name.toLowerCase() === lowerName
                );

                if (existingIndex !== -1) {
                  // Replace the existing leader with the updated one
                  mergedLeaders[existingIndex] = newLeader;
                }
              } else {
                // This is a new leader, add to the array
                mergedLeaders.push(newLeader);
              }
            }

            // Create the merged content
            const mergedContent = {
              ...newData,
              leaders: mergedLeaders
            };

            // Update the content with the merged data
            contentExists.content = JSON.stringify(mergedContent);

            console.log(`Leadership data merged. Total leaders: ${mergedLeaders.length}`);
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
