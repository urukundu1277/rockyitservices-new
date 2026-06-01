const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  service: { type: String, required: true, trim: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  message: { type: String, required: true },
  approved: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.models.Review || mongoose.model('Review', ReviewSchema);
