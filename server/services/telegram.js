const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Base Telegram API URL
const TELEGRAM_API = (token) => `https://api.telegram.org/bot${token}`;

// Escape text for MarkdownV2 according to Telegram rules
function escapeMarkdownV2(text = "") {
  return String(text)
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\*/g, "\\*")
    .replace(/_/g, "\\_")
    .replace(/\{/g, "\\{")
    .replace(/\}/g, "\\}")
    .replace(/\[/g, "\\[")
    .replace(/\]/g, "\\]")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/#/g, "\\#")
    .replace(/\+/g, "\\+")
    .replace(/-/g, "\\-")
    .replace(/\./g, "\\.")
    .replace(/!/g, "\\!")
    .replace(/>/g, "\\>");
}

// Map service names to emojis
function getServiceEmoji(service = "") {
  const map = {
    "website development": "🌐",
    "aws services": "☁️",
    "computer repair": "💻",
    "printer repair": "🖨",
    "cctv installation": "📹",
    "networking": "🛜",
    "mobile repair": "📱",
    "security services": "🔒",
    "technical support": "🛠",
  };

  if (!service) return "🛠";

  const key = service.toString().trim().toLowerCase();
  return map[key] || "🛠";
}

// Build a MarkdownV2-formatted message for leads
function formatTelegramMessage({
  name,
  phone,
  email,
  service,
  message,
  source = "Website Contact Form",
  time = new Date(),
  // accept any additional fields
  ...rest
}) {
  // Helper: detect empty values
  const isEmpty = (v) => v === undefined || v === null || (typeof v === "string" && v.trim() === "");

  // Helper: pick first non-empty from candidates
  const pickFirst = (obj, keys) => {
    for (const k of keys) {
      if (!isEmpty(obj?.[k])) return obj[k];
    }
    return undefined;
  };

  // Normalize input: allow passing an object with many fields
  const data = { name, phone, email, service, message, source, time, ...rest };

  // Fallback lookups for service and message/requirement
  const svc = pickFirst(data, [
    "service",
    "selectedService",
    "category",
    "serviceType",
    "service_name",
  ]);

  // Requirement (short) and description/problem (long)
  const requirementVal = pickFirst(data, ["requirement", "issue", "need", "shortRequirement"]);
  const descriptionVal = pickFirst(data, ["description", "problem", "notes", "message", "details"]);

  const addr = pickFirst(data, ["address", "location", "city", "area"]);
  const device = pickFirst(data, ["device", "deviceType", "device_model", "deviceModel"]);
  const sourcePage = pickFirst(data, ["source", "sourcePage", "referrer", "page"]);
  const customerName = pickFirst(data, ["name", "fullName", "customerName", "username"]);
  const phoneVal = pickFirst(data, ["phone", "phoneNumber", "mobile", "contact"]);
  const emailVal = pickFirst(data, ["email", "userEmail", "contactEmail"]);

  const emoji = getServiceEmoji(svc);
  const ts = new Date(data.time || Date.now()).toLocaleString();

  // Start building message lines
  const lines = [];

  lines.push(`*🔥 NEW CUSTOMER REQUEST*`);
  lines.push("");

  // Customer identity block
  if (!isEmpty(customerName)) lines.push(`👤 *Name:* ${escapeMarkdownV2(String(customerName))}`);
  if (!isEmpty(phoneVal)) lines.push(`📞 *Phone:* ${escapeMarkdownV2(String(phoneVal))}`);
  if (!isEmpty(emailVal)) {
    const safeEmail = escapeMarkdownV2(String(emailVal));
    // Use plain email (avoid MarkdownV2 link complexity)
    lines.push(`📧 *Email:* ${safeEmail}`);
  }

  // Service / Requirement block
  if (!isEmpty(svc)) lines.push(`${emoji} *Service:* ${escapeMarkdownV2(String(svc))}`);
  if (!isEmpty(requirementVal)) lines.push(`📋 *Requirement:* ${escapeMarkdownV2(String(requirementVal))}`);

  if (!isEmpty(descriptionVal)) {
    lines.push(`💬 *Problem Description:*`);
    lines.push(`${escapeMarkdownV2(String(descriptionVal))}`);
  }

  if (!isEmpty(device)) lines.push(`💻 *Device:* ${escapeMarkdownV2(String(device))}`);
  if (!isEmpty(addr)) lines.push(`📍 *Address:* ${escapeMarkdownV2(String(addr))}`);

  // Additional dynamic fields (source, time)
  if (!isEmpty(sourcePage)) lines.push(`\n🌐 *Source:* ${escapeMarkdownV2(String(sourcePage))}`);
  lines.push(`🕒 *Time:* ${escapeMarkdownV2(String(ts))}`);

  lines.push("");
  lines.push(`━━━━━━━━━━━━━━`);
  lines.push(`🚀 *Rocky IT Services Admin Alert*`);

  // Join with newlines
  return lines.filter(Boolean).join("\n");
}

// Generic function to send a message to Telegram using axios (MarkdownV2)
async function sendTelegramMessage(text, opts = {}) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    const errMsg = "TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not configured in .env";
    console.error(errMsg);
    throw new Error(errMsg);
  }

  const url = `${TELEGRAM_API(TELEGRAM_BOT_TOKEN)}/sendMessage`;

  const payload = {
    chat_id: TELEGRAM_CHAT_ID,
    text,
    parse_mode: "MarkdownV2",
    disable_web_page_preview: true,
    ...opts,
  };

  // Debug: log outgoing payload (redact token)
  console.debug("[telegram] Sending payload to Telegram", { chat_id: payload.chat_id, parse_mode: payload.parse_mode });

  try {
    const res = await axios.post(url, payload, { timeout: 7000 });

    // Log success and response data for debugging
    console.info("[telegram] Message sent successfully", { ok: res.data?.ok, result: res.data?.result?.message_id });
    console.debug("[telegram] API response", res.data);

    return res.data;
  } catch (error) {
    // Log detailed failure info but don't crash the app
    const apiData = error.response?.data;
    console.error("[telegram] Failed to send message", { message: error.message, apiData });
    throw new Error(`Failed to send Telegram message: ${apiData ? JSON.stringify(apiData) : error.message}`);
  }
}

// Convenience admin alerts (server started, new booking, admin login)
async function sendAdminAlert(type = "info", details = {}) {
  let text = "";

  if (type === "server_started") {
    const host = escapeMarkdownV2(details.host || "localhost");
    const port = escapeMarkdownV2(String(details.port || "—"));
    const ts = escapeMarkdownV2(new Date().toLocaleString());
    text = `✅ *Server Started*\n\n🌐 Host: ${host}\n🔌 Port: ${port}\n🕒 Time: ${ts}\n\n━━━━━━━━━━━━━━\n🚀 *Rocky IT Services Admin Alert*`;
  } else if (type === "new_booking") {
    text = `📅 *New Booking*\n\n${escapeMarkdownV2(details.summary || "New booking received")}\n\n🕒 ${escapeMarkdownV2(new Date().toLocaleString())}`;
  } else if (type === "admin_login") {
    text = `🔒 *Admin Login*\n\nUser: ${escapeMarkdownV2(details.user || "—")}\nIP: ${escapeMarkdownV2(details.ip || "—")}\n🕒 ${escapeMarkdownV2(new Date().toLocaleString())}`;
  } else {
    text = `ℹ️ *Alert*\n\n${escapeMarkdownV2(details.message || "No details provided")}`;
  }

  return sendTelegramMessage(text);
}

module.exports = {
  sendTelegramMessage,
  formatTelegramMessage,
  getServiceEmoji,
  sendAdminAlert,
};
