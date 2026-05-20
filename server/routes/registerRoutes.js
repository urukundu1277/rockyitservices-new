const express = require("express");
const router = express.Router();

const Customer = (() => {
  try {
    return require("../models/Customer");
  } catch (err) {
    console.warn("Customer model not found, /api/register will not persist to DB");
    return null;
  }
})();

const { sendTelegramMessage, formatTelegramMessage } = require("../services/telegram");

// POST /api/register - create a customer record and notify admin
router.post("/", async (req, res) => {
  try {
    console.debug("[register] Incoming body:", req.body);
    let saved = null;

    if (Customer) {
      saved = await Customer.create(req.body);
    }

    // Build message from saved record or incoming body
    const source = "Website Registration";
    const savedObj = saved ? (typeof saved.toObject === 'function' ? saved.toObject() : saved) : {};
    const payload = { ...savedObj, ...req.body };

    const text = formatTelegramMessage({ ...payload, source });

    try {
      await sendTelegramMessage(text);
    } catch (tgErr) {
      console.error("Telegram notification failed for /api/register:", tgErr.message || tgErr);
    }

    return res.status(201).json({ success: true, data: saved || req.body });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
