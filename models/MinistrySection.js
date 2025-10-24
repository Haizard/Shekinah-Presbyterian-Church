const mongoose = require('mongoose');

const ministrySectionSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: '',
    },
    focusAreas: [
      {
        icon: {
          type: String,
          default: 'star',
        },
        text: {
          type: String,
          required: true,
        },
      },
    ],
    order: {
      type: Number,
      default: 0,
    },
    sectionId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const MinistrySection = mongoose.model('MinistrySection', ministrySectionSchema);

module.exports = MinistrySection;

