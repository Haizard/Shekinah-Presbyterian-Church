const mongoose = require('mongoose');

const ministrySchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    leader: {
      type: String,
      required: true,
    },
    meetingTime: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Ministry = mongoose.model('Ministry', ministrySchema);

module.exports = Ministry;
