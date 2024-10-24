const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  campaignId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Email', 'Social Media', 'Event', 'PPC'],
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  budget: {
    type: Number,
    required: true,
  },
  leadsGenerated: {
    type: Number,
    required: true,
    default: 0, 
  },
  status: {
    type: String,
    enum: ['Ongoing', 'Completed', 'Planned'],
    required: true,
  },
  createdBy: {
    type: String,
    required: true,
  },
  channel: {
    type: String,
    required: true,
  },
  performance: {
    type: String,
    enum: ['Excellent', 'High', 'Moderate', 'N/A'],
    required: true,
  },
  conversionRate: {
    type: Number,
    required: true,
    default: 0.0,
  }
});

const Campaign = mongoose.model('Campaign', campaignSchema);

module.exports = Campaign;
