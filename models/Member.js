const mongoose = require('mongoose');

const memberSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      default: '',
    },
    dateOfBirth: {
      type: String,
      default: '',
    },
    joinDate: {
      type: String,
      required: true,
    },
    baptismDate: {
      type: String,
      default: '',
    },
    membershipStatus: {
      type: String,
      required: true,
      enum: ['active', 'inactive', 'visitor', 'transferred'],
    },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Branch',
      default: null,
    },
    image: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Member = mongoose.model('Member', memberSchema);

module.exports = Member;
