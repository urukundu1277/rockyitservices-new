const express = require("express");
const router = express.Router();
require("dotenv").config();

// Telegram notification helpers
const {
  sendTelegramMessage,
  formatTelegramMessage,
} = require("../services/telegram");

// Review model
const Review = require("../models/Review");

// Environment variables for review configuration
const REVIEW_REQUIRE_APPROVAL = process.env.REVIEW_REQUIRE_APPROVAL !== "false";
const REVIEW_MAX_LIMIT = parseInt(process.env.REVIEW_MAX_LIMIT || "50", 10);

// Log review configuration at startup
console.log("[reviewRoutes] Configuration loaded:");
console.log(`  - REVIEW_REQUIRE_APPROVAL: ${REVIEW_REQUIRE_APPROVAL}`);
console.log(`  - REVIEW_MAX_LIMIT: ${REVIEW_MAX_LIMIT}`);

// POST /api/reviews
// Submit a new review
router.post("/", async (req, res) => {
  try {
    console.debug("[reviews] Incoming body:", req.body);
    const { name, email, service, rating, message } = req.body;

    // Basic validation
    if (!name || !email || !service || !rating || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required (name, email, service, rating, message)",
      });
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    // Save review to database - REQUIRED
    let savedReview = null;
    try {
      savedReview = await Review.create({
        name,
        email,
        service,
        rating,
        message,
        approved: !REVIEW_REQUIRE_APPROVAL, // Auto-approve if REVIEW_REQUIRE_APPROVAL is false
        featured: false,
      });
      console.log("[reviews] Review saved to DB with ID:", savedReview._id);
    } catch (dbErr) {
      console.error("[reviews] CRITICAL - Failed to save review to DB:", dbErr.message || dbErr);
      return res.status(500).json({
        success: false,
        message: "Failed to save review to database",
        error: dbErr.message || String(dbErr),
      });
    }

    // Prepare notification message
    const notificationText = `
📝 *New Review Received*

👤 *Name:* ${name}
📧 *Email:* ${email}
🔧 *Service:* ${service}
⭐ *Rating:* ${rating}/5
💬 *Message:* ${message}
    `;

    // Send to Telegram (async) - do not block if Telegram fails
    try {
      await sendTelegramMessage(notificationText.trim());
      console.debug("[reviews] Telegram notification sent");
    } catch (tgErr) {
      console.error("[reviews] Telegram notification failed:", tgErr.message || tgErr);
    }

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: savedReview || { name, email, service, rating, message },
    });
  } catch (error) {
    console.error("[reviews] Route error:", error.message || error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit review",
      error: error.message || String(error),
    });
  }
});

// GET /api/reviews
// Get all approved reviews
router.get("/", async (req, res) => {
  try {
    if (!Review) {
      return res.status(200).json({
        success: true,
        message: "No reviews available",
        data: [],
      });
    }

    const reviews = await Review.find({ approved: true })
      .sort({ createdAt: -1 })
      .limit(REVIEW_MAX_LIMIT);

    return res.status(200).json({
      success: true,
      message: "Reviews retrieved successfully",
      data: reviews,
    });
  } catch (error) {
    console.error("[reviews] GET error:", error.message || error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve reviews",
      error: error.message || String(error),
    });
  }
});

module.exports = router;
