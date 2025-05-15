const Sermon = require('../models/Sermon');

// @desc    Get all sermons
// @route   GET /api/sermons
// @access  Public
const getSermons = async (req, res) => {
  try {
    const sermons = await Sermon.find({}).sort({ createdAt: -1 });
    res.json(sermons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get sermon by ID
// @route   GET /api/sermons/:id
// @access  Public
const getSermonById = async (req, res) => {
  try {
    const sermon = await Sermon.findById(req.params.id);

    if (sermon) {
      res.json(sermon);
    } else {
      res.status(404).json({ message: 'Sermon not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a sermon
// @route   POST /api/sermons
// @access  Private/Admin
const createSermon = async (req, res) => {
  try {
    const { title, speaker, date, scripture, category, image, audioUrl, videoUrl, notesUrl, description } = req.body;

    const sermon = new Sermon({
      title,
      speaker,
      date,
      scripture,
      category,
      image,
      audioUrl: audioUrl || '',
      videoUrl: videoUrl || '',
      notesUrl: notesUrl || '',
      description,
    });

    const createdSermon = await sermon.save();
    res.status(201).json(createdSermon);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a sermon
// @route   PUT /api/sermons/:id
// @access  Private/Admin
const updateSermon = async (req, res) => {
  try {
    const { title, speaker, date, scripture, category, image, audioUrl, videoUrl, notesUrl, description } = req.body;

    const sermon = await Sermon.findById(req.params.id);

    if (sermon) {
      sermon.title = title || sermon.title;
      sermon.speaker = speaker || sermon.speaker;
      sermon.date = date || sermon.date;
      sermon.scripture = scripture || sermon.scripture;
      sermon.category = category || sermon.category;
      sermon.image = image || sermon.image;
      sermon.audioUrl = audioUrl || sermon.audioUrl;
      sermon.videoUrl = videoUrl || sermon.videoUrl;
      sermon.notesUrl = notesUrl || sermon.notesUrl;
      sermon.description = description || sermon.description;

      const updatedSermon = await sermon.save();
      res.json(updatedSermon);
    } else {
      res.status(404).json({ message: 'Sermon not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a sermon
// @route   DELETE /api/sermons/:id
// @access  Private/Admin
const deleteSermon = async (req, res) => {
  try {
    const sermon = await Sermon.findById(req.params.id);

    if (sermon) {
      await sermon.deleteOne();
      res.json({ message: 'Sermon removed' });
    } else {
      res.status(404).json({ message: 'Sermon not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getSermons,
  getSermonById,
  createSermon,
  updateSermon,
  deleteSermon,
};
