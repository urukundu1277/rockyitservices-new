const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true },
  phone: { type: String, trim: true },
  service: { type: String, trim: true },
  message: { type: String },
  requirement: { type: String },
  description: { type: String },
  address: { type: String },
  device: { type: String },
  source: { type: String },
  metadata: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

module.exports = mongoose.models.Lead || mongoose.model('Lead', LeadSchema);
