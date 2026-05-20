const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  customerName: { type: String, trim: true },
  name: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true },
  phone: { type: String, trim: true },
  service: { type: String, trim: true },
  bookingType: { type: String, trim: true },
  notes: { type: String },
  date: { type: Date },
  time: { type: String },
  address: { type: String },
  city: { type: String },
  status: { type: String, default: 'pending' },
  device: { type: String },
  metadata: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

module.exports = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
