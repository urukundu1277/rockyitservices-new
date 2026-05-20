const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

// Production CORS Configuration
app.use(cors({
  origin: [
    "https://rockyitservices.com",
    "https://www.rockyitservices.com"
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Middleware to parse JSON requests
app.use(express.json());

/* ROUTES */

const customerRoutes =
    require("./routes/customerRoutes");

app.use(
    "/api/customers",
    customerRoutes
);
app.use(
    "/api/auth",
    require("./routes/authRoutes")
);
// Contact form route (sends Telegram notifications)
app.use(
    "/api/contact",
    require("./routes/contactRoutes")
);

// Additional notification endpoints
app.use(
    "/api/register",
    require("./routes/registerRoutes")
);

app.use(
    "/api/booking",
    require("./routes/bookingRoutes")
);

app.use(
    "/api/lead",
    require("./routes/leadRoutes")
);

// Test endpoint for Telegram
app.get("/api/test-telegram", async (req, res) => {
    try {
        const { sendTelegramMessage } = require("./services/telegram");
        await sendTelegramMessage("✅ Telegram Bot Working Successfully");
        return res.json({ success: true, message: "Telegram test message sent" });
    } catch (error) {
        console.error("/api/test-telegram error:", error.message || error);
        return res.status(500).json({ success: false, message: error.message || String(error) });
    }
});

/* TEST */

app.get("/", (req, res) => {

    res.send("Backend Running");

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );
    // Log successful start. By default we DO NOT send a Telegram alert on startup.
    // To enable startup Telegram alerts set `SEND_TELEGRAM_STARTUP_ALERT=true` in your environment.
    if (process.env.SEND_TELEGRAM_STARTUP_ALERT === "true") {
        try {
            const { sendAdminAlert } = require("./services/telegram");
            sendAdminAlert("server_started", { port: PORT }).catch(err => console.error("Admin alert failed:", err.message || err));
        } catch (err) {
            console.error("Telegram service not configured:", err.message || err);
        }
    }

});