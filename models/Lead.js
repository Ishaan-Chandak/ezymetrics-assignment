const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  leadId: {
    type: String,
    required: true,
    unique: true,
  },
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
    required: true,
    match: /.+\@.+\..+/ 
  },
  phone: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Interested', 'Contacted', 'Qualified', 'Closed', 'Lost'], 
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now, 
  },
  source: {
    type: String,
    required: true,
  },
  assignedTo: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  leadScore: {
    type: Number,
    required: true,
  },
  salesRep: {
    type: String,
    required: true,
  },
  closedAt: {
    type: Date, 
  }
});

const Lead = mongoose.model('Lead', leadSchema);

module.exports = Lead;
