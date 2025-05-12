const mongoose = require('mongoose');

const groupMemberSchema = mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      required: true,
    },
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['leader', 'assistant', 'member'],
      default: 'member',
    },
    joinDate: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create a compound index to ensure a member can only be added to a group once
groupMemberSchema.index({ groupId: 1, memberId: 1 }, { unique: true });

const GroupMember = mongoose.model('GroupMember', groupMemberSchema);

module.exports = GroupMember;
