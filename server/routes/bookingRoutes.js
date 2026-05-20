const express = require("express");
const router = express.Router();

const Booking = (() => {
  try {
    return require("../models/Booking");
  } catch (err) {
    console.warn("Booking model not found, /api/booking will not persist to DB");
    return null;
  }
})();

const { sendTelegramMessage, formatTelegramMessage } = require("../services/telegram");

// POST /api/booking - save booking (if model exists) and notify admin
router.post("/", async (req, res) => {
  try {
    console.debug("[booking] Incoming body:", req.body);
    let saved = null;
    if (Booking) saved = await Booking.create(req.body);

    const savedObj = saved ? (typeof saved.toObject === 'function' ? saved.toObject() : saved) : {};
    const payload = { ...savedObj, ...req.body };

    const text = formatTelegramMessage({ ...payload, source: "Service Booking" });

    try {
      await sendTelegramMessage(text);
    } catch (tgErr) {
      console.error("Telegram notification failed for /api/booking:", tgErr.message || tgErr);
    }

    return res.status(201).json({ success: true, data: saved || req.body });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
