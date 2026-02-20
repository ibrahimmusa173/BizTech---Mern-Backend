const mongoose = require('mongoose');

const tenderSchema = new mongoose.Schema(
  {
    client_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
    category: String,
    budget_range: String,
    deadline: Date,
    location: String,
    contact_info: String,
    attachments: [String],
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Tender', tenderSchema);