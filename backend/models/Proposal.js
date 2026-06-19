const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema(
  {
    tender_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tender',
      required: true,
    },
    vendor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    cover_letter: String,
    proposed_solution: String,
    amount: Number,
    attachments: [String],
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Proposal', proposalSchema);