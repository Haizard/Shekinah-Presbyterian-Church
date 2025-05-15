const mongoose = require('mongoose');

const branchSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    pastor: {
      type: String,
      required: true,
    },
    contactInfo: {
      type: String,
      required: true,
    },
    establishedDate: {
      type: String,
      default: '',
    },
    memberCount: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Branch = mongoose.model('Branch', branchSchema);

module.exports = Branch;
