const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true },
  phone: { type: String, trim: true },
  service: { type: String, trim: true },
  selectedService: { type: String, trim: true },
  category: { type: String, trim: true },
  message: { type: String },
  issue: { type: String },
  requirement: { type: String },
  description: { type: String },
  notes: { type: String },
  address: { type: String },
  city: { type: String },
  area: { type: String },
  device: { type: String },
  deviceType: { type: String },
  device_model: { type: String },
  source: { type: String },
  sourcePage: { type: String },
  referrer: { type: String },
  page: { type: String },
  metadata: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

module.exports = mongoose.models.Contact || mongoose.model('Contact', ContactSchema);
