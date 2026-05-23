const mongoose = require("mongoose");

const adminOTPSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  otp: {
    type: String,
    required: true,
    trim: true
  },
  used: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300 // Auto-delete after 5 minutes for cleanup
  }
});

// Index for efficient queries
adminOTPSchema.index({ username: 1, used: 1 }, { expireAfterSeconds: 300 });

module.exports = mongoose.model("AdminOTP", adminOTPSchema);