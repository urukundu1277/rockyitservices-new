const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AdminOTP = require("../models/AdminOTP");
const { sendTelegramMessage } = require("../services/telegram");

const router = express.Router();

// Admin credentials configuration
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "#Uv@143@";


// Generate a random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * POST /api/admin/request-otp
 * Step 1: Validate credentials and send OTP via Telegram
 */
router.post("/request-otp", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required"
      });
    }

    // Validate credentials
    const isValidCredentials = username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
    
    if (!isValidCredentials) {
      // Use same error message to prevent username enumeration
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

    // Store OTP in database
    const otpRecord = new AdminOTP({
      username,
      otp,
      expiresAt
    });
    await otpRecord.save();

    // Send OTP via Telegram
    const message = `Your Rocky IT Admin OTP is: ${otp}`;
    
    try {
      await sendTelegramMessage(message);
    } catch (telegramError) {
      console.error("Failed to send Telegram message:", telegramError.message);
      // Delete the OTP record since we couldn't send it
      await AdminOTP.deleteOne({ _id: otpRecord._id });
      
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP via Telegram. Please try again."
      });
    }

    // Return success (don't expose OTP in response)
    res.json({
      success: true,
      message: "OTP sent successfully to admin Telegram",
      expiresInSeconds: 300
    });

  } catch (error) {
    console.error("Request OTP error:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

/**
 * POST /api/admin/login
 * Direct username/password login for trusted devices
 */
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;


    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required"
      });
    }

    const isValidCredentials = username === ADMIN_USERNAME && password === ADMIN_PASSWORD;


    if (!isValidCredentials) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      {
        id: username,
        role: "admin",
        type: "admin_login"
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      success: true,
      message: "Authentication successful",
      token,
      admin: {
        username,
        role: "admin"
      }
    });
  } catch (error) {
    console.error("Direct login error:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

/**
 * POST /api/admin/verify-otp
 * Step 2: Verify OTP and return authentication token
 */
router.post("/verify-otp", async (req, res) => {
  try {
    const { username, otp } = req.body;

    // Validate input
    if (!username || !otp) {
      return res.status(400).json({
        success: false,
        message: "Username and OTP are required"
      });
    }

    // Find valid OTP record
    const otpRecord = await AdminOTP.findOne({
      username,
      otp,
      used: false,
      expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
      // Check if OTP was expired or already used
      const existingRecord = await AdminOTP.findOne({ username, otp });
      
      if (existingRecord) {
        if (existingRecord.used) {
          return res.status(400).json({
            success: false,
            message: "This OTP has already been used"
          });
        }
        if (existingRecord.expiresAt <= new Date()) {
          return res.status(400).json({
            success: false,
            message: "OTP has expired. Please request a new one."
          });
        }
      }

      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    // Mark OTP as used
    otpRecord.used = true;
    await otpRecord.save();

    // Generate JWT token for admin session
    const token = jwt.sign(
      { 
        id: username, 
        role: "admin",
        type: "admin_otp"
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Send login notification via Telegram
    try {
      const loginNotification = `🔒 *Admin Login Successful*\n\nUser: ${username}\nIP: ${req.ip || "unknown"}\n🕒 ${new Date().toLocaleString()}`;
      // Send without parse_mode to avoid MarkdownV2 escaping issues
      const { sendTelegramMessage } = require("../services/telegram");
      sendTelegramMessage(loginNotification, { parse_mode: "Markdown" }).catch(err => console.error("Login notification failed:", err.message));
    } catch (err) {
      console.error("Failed to send login notification:", err.message);
    }

    res.json({
      success: true,
      message: "Authentication successful",
      token,
      admin: {
        username,
        role: "admin"
      }
    });

  } catch (error) {
    console.error("Verify OTP error:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

/**
 * POST /api/admin/resend-otp
 * Resend OTP (with rate limiting - can only resend after 60 seconds)
 */
router.post("/resend-otp", async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: "Username is required"
      });
    }

    // Check if there's a recent OTP that hasn't expired yet
    const recentOTP = await AdminOTP.findOne({
      username,
      used: false,
      expiresAt: { $gt: new Date() }
    }).sort({ createdAt: -1 });

    if (recentOTP) {
      const timeSinceCreation = Date.now() - new Date(recentOTP.createdAt).getTime();
      const cooldownPeriod = 60 * 1000; // 60 seconds cooldown

      if (timeSinceCreation < cooldownPeriod) {
        const remainingSeconds = Math.ceil((cooldownPeriod - timeSinceCreation) / 1000);
        return res.status(429).json({
          success: false,
          message: `Please wait ${remainingSeconds} seconds before requesting a new OTP`,
          retryAfter: remainingSeconds
        });
      }

      // Invalidate the old OTP
      recentOTP.used = true;
      await recentOTP.save();
    }

    // Generate new OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

    const otpRecord = new AdminOTP({
      username,
      otp,
      expiresAt
    });
    await otpRecord.save();

    // Send OTP via Telegram
    const message = `Your Rocky IT Admin OTP is: ${otp}`;
    
    try {
      await sendTelegramMessage(message);
    } catch (telegramError) {
      console.error("Failed to send Telegram message:", telegramError.message);
      await AdminOTP.deleteOne({ _id: otpRecord._id });
      
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP via Telegram. Please try again."
      });
    }

    res.json({
      success: true,
      message: "New OTP sent successfully",
      expiresInSeconds: 300
    });

  } catch (error) {
    console.error("Resend OTP error:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

/**
 * GET /api/admin/verify-token
 * Middleware-like endpoint to verify admin token validity
 */
router.get("/verify-token", (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided"
      });
    }

    const token = authHeader.split(" ")[1];
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized"
      });
    }

    res.json({
      success: true,
      admin: {
        username: decoded.id,
        role: decoded.role
      }
    });

  } catch (error) {
    console.error("Verify token error:", error.message);
    res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
});

// Admin authentication middleware
const requireAdminAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required"
      });
    }

    req.admin = decoded;
    next();

  } catch (error) {
    console.error("Admin auth middleware error:", error.message);
    res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

module.exports = router;
module.exports.requireAdminAuth = requireAdminAuth;