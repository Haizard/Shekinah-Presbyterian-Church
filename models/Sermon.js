const mongoose = require('mongoose');

const sermonSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    speaker: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    scripture: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    audioUrl: {
      type: String,
      default: '',
    },
    videoUrl: {
      type: String,
      default: '',
    },
    notesUrl: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Sermon = mongoose.model('Sermon', sermonSchema);

module.exports = Sermon;
