const express = require("express");
const router = express.Router();

// Telegram notification helpers
const {
  sendTelegramMessage,
  formatTelegramMessage,
} = require("../services/telegram");

// Optional Contact model: if present, persist contact submissions
const Contact = (() => {
  try {
    return require("../models/Contact");
  } catch (err) {
    console.debug("[contactRoutes] Contact model not found; will not persist to DB");
    return null;
  }
})();

// POST /api/contact
// Expects { name, email, phone, service, message, source }
router.post("/", async (req, res) => {
  try {
    console.debug("[contact] Incoming body:", req.body);
    const { name, email, phone, service, message, source } = req.body;

    // Basic validation
    if (!name || !email) {
      return res.status(400).json({ success: false, message: "Name and email are required" });
    }

    // Persist if model exists, then notify (notification sent AFTER successful save)
    let saved = null;
    if (Contact) {
      try {
        saved = await Contact.create(req.body);
      } catch (dbErr) {
        console.error("[contact] Failed to save contact to DB:", dbErr.message || dbErr);
        // proceed to notify using request body, but log the DB failure
      }
    }

    const payload = saved || req.body;

    // Format message for Telegram using all available fields
    const text = formatTelegramMessage(payload);

    // Send to Telegram (async) - do not block if Telegram fails
    try {
      await sendTelegramMessage(text);
    } catch (tgErr) {
      console.error("[contact] Telegram notification failed:", tgErr.message || tgErr);
    }

    return res.status(200).json({ success: true, message: "Notification processed", data: saved || null });
  } catch (error) {
    console.error("Contact route error:", error.message || error);
    return res.status(500).json({
      success: false,
      message: "Failed to send notification",
      error: error.message || String(error),
    });
  }
});

module.exports = router;
