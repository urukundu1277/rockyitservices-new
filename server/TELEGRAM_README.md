Telegram Notification Integration
===============================

Drop-in telegram notification system for Node.js + Express backends.

Files added (paste into your project under `server/`):
- `services/telegram.js` - reusable service with `sendTelegramMessage()`, `formatTelegramMessage()`, `getServiceEmoji()`, `sendAdminAlert()`
- `routes/contactRoutes.js` - POST `/api/contact`
- `routes/registerRoutes.js` - POST `/api/register`
- `routes/bookingRoutes.js` - POST `/api/booking`
- `routes/leadRoutes.js` - POST `/api/lead`
- `routes/test` - test endpoint is available at GET `/api/test-telegram`

Environment variables (add to `server/.env`):

```
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
PORT=5000
```

Install dependencies and run:

```bash
cd server
npm install
npm run dev
```

How it works
- All notification helpers are in `services/telegram.js`. Messages use MarkdownV2 formatting and include emojis and timestamps.
- Each route sends a Telegram message after successfully saving to the DB (if the model exists). If Telegram fails, the API still returns success — the error is logged.
- `sendAdminAlert()` supports `server_started`, `new_booking`, and `admin_login` alerts.

Endpoints
- POST `/api/contact` - body: `{ name, email, phone, service, message, source }`
- POST `/api/register` - body: customer object
- POST `/api/booking` - body: booking object
- POST `/api/lead` - body: lead object
- GET `/api/test-telegram` - sends a test message

Deployment
- Works on EC2, VPS, Render, Railway. Ensure `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` are set in environment variables in your host provider.

Notes & debugging
- Telegram responses and errors are logged to the server console (info/debug/error). Check logs if messages are not received.
- Ensure the bot is started and the `TELEGRAM_CHAT_ID` is correct (for private chats, use your user ID; for groups use group chat id).

Where to paste the code
- Place `services/telegram.js` in your server services folder (e.g., `server/services/telegram.js`).
- Place route files in `server/routes/` and mount them in `server/server.js` as shown in the project.
