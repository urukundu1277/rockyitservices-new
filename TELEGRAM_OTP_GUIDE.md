# Telegram OTP Admin Authentication System

## Overview

This document describes the secure Telegram-based OTP (One-Time Password) authentication system for admin access to Rocky IT Services.

## Features

- **Two-Factor Authentication**: Username/password + Telegram OTP
- **Secure OTP Generation**: Random 6-digit codes
- **Time-Limited OTPs**: 5-minute expiration
- **Single-Use OTPs**: Each OTP can only be used once
- **Rate Limiting**: 60-second cooldown between resend requests
- **Automatic Cleanup**: Expired OTPs are automatically deleted
- **Session Management**: JWT-based authentication after successful OTP verification
- **Login Notifications**: Telegram alerts for successful admin logins

## Architecture

### Backend Components

1. **AdminOTP Model** (`server/models/AdminOTP.js`)
   - Stores OTP records with expiration and usage tracking
   - Auto-deletes after 5 minutes

2. **Admin Auth Routes** (`server/routes/adminAuthRoutes.js`)
   - `POST /api/admin/request-otp` - Validate credentials and send OTP
   - `POST /api/admin/verify-otp` - Verify OTP and return JWT token
   - `POST /api/admin/resend-otp` - Resend OTP with rate limiting
   - `GET /api/admin/verify-token` - Verify JWT token validity

3. **Telegram Service** (`server/services/telegram.js`)
   - Sends OTP messages via Telegram Bot API
   - Sends login notifications

### Frontend Components

1. **AdminLoginModal** (`src/components/AdminLoginModal.jsx`)
   - Two-step authentication UI
   - Step 1: Username and password entry
   - Step 2: 6-digit OTP input with auto-focus
   - Toast notifications for success/error
   - Resend OTP with countdown timer
   - Loading animations

2. **Admin Dashboard** (`src/pages/Admin.jsx`)
   - Token-based authentication check
   - Automatic redirect to login if not authenticated
   - Logout functionality

3. **Footer** (`src/components/Footer.jsx`)
   - Discreet gear icon for admin access

## Setup Instructions

### Prerequisites

1. **Telegram Bot**
   - Create a bot via [@BotFather](https://t.me/botfather)
   - Get your bot token

2. **Telegram Chat ID**
   - Get your chat ID from [@userinfobot](https://t.me/userinfobot)
   - Or use a group chat ID for team access

### Configuration

1. **Server Environment** (`server/.env`)

```env
# Telegram Configuration
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here

# Admin Configuration
ADMIN_USERNAME=admin

# JWT Secret (for session tokens)
JWT_SECRET=your_secure_secret_key

# MongoDB Connection
MONGO_URI=your_mongodb_connection_string
```

2. **Frontend Environment** (`.env` or `.env.local`)

```env
# API Base URL
VITE_API_URL=http://localhost:5000/api
# For production:
# VITE_API_URL=https://api.rockyitservices.com/api
```

### Installation

```bash
# Install server dependencies
cd server
npm install

# Install frontend dependencies
cd ..
npm install

# Start the server
cd server
npm start

# Start the frontend (in another terminal)
cd ..
npm run dev
```

## Usage

### Admin Login Flow

1. **Access Admin Login**
   - Click the gear icon (⚙️) in the footer
   - Admin login modal opens

2. **Enter Credentials**
   - Username: `admin` (or configured username)
   - Password: (configured password)
   - Click "Send OTP"

3. **Receive OTP**
   - Check your Telegram for the OTP message
   - Message format: "Your Rocky IT Admin OTP is: 123456"

4. **Enter OTP**
   - Type the 6-digit code
   - Auto-advances between fields
   - Supports paste functionality
   - Click "Verify & Login"

5. **Access Granted**
   - JWT token stored in localStorage
   - Redirected to admin dashboard
   - Login notification sent to Telegram

### Resend OTP

- Wait for 60-second cooldown
- Click "Resend OTP" button
- New OTP sent via Telegram
- Previous OTP is invalidated

### Logout

- Click "Logout" button in admin dashboard
- Clears authentication tokens
- Redirects to login

## Security Features

### OTP Security

- **Random Generation**: Cryptographically secure random 6-digit codes
- **Time Limit**: 5-minute expiration window
- **Single Use**: OTP marked as used after verification
- **No Reuse**: Attempting to reuse an OTP returns an error
- **Automatic Cleanup**: Expired records deleted from database

### Session Security

- **JWT Tokens**: Signed with secret key
- **Token Expiration**: 24-hour session duration
- **Server-Side Verification**: Token validated on protected routes
- **Secure Storage**: Token stored in localStorage (consider httpOnly cookies for production)

### API Security

- **Credential Validation**: Username/password checked before OTP generation
- **Rate Limiting**: 60-second cooldown between resend requests
- **Error Messages**: Generic messages to prevent enumeration
- **No OTP Exposure**: OTP never returned in API responses

### Telegram Security

- **Bot Token Protection**: Token stored in environment variables only
- **No Frontend Exposure**: Bot token never sent to client
- **Secure API Calls**: HTTPS connections to Telegram API

## API Reference

### Request OTP

```http
POST /api/admin/request-otp
Content-Type: application/json

{
  "username": "admin",
  "password": "your_password"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully to admin Telegram",
  "expiresInSeconds": 300
}
```

### Verify OTP

```http
POST /api/admin/verify-otp
Content-Type: application/json

{
  "username": "admin",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Authentication successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "username": "admin",
    "role": "admin"
  }
}
```

### Resend OTP

```http
POST /api/admin/resend-otp
Content-Type: application/json

{
  "username": "admin"
}
```

**Response:**
```json
{
  "success": true,
  "message": "New OTP sent successfully",
  "expiresInSeconds": 300
}
```

### Verify Token

```http
GET /api/admin/verify-token
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "admin": {
    "username": "admin",
    "role": "admin"
  }
}
```

## Error Handling

### Common Error Responses

| Status Code | Error Message | Description |
|-------------|---------------|-------------|
| 400 | "Username and password are required" | Missing credentials |
| 401 | "Invalid credentials" | Wrong username or password |
| 400 | "Invalid OTP" | Wrong OTP entered |
| 400 | "OTP has expired" | OTP older than 5 minutes |
| 400 | "This OTP has already been used" | OTP reuse attempt |
| 429 | "Please wait X seconds before requesting a new OTP" | Rate limit exceeded |
| 500 | "Failed to send OTP via Telegram" | Telegram API error |

## Troubleshooting

### OTP Not Received

1. Verify Telegram bot token is correct
2. Check chat ID is valid
3. Ensure bot is not blocked
4. Check server logs for Telegram API errors

### "Invalid Credentials" Error

1. Verify username matches `ADMIN_USERNAME` in .env
2. Check password configuration
3. Ensure no extra whitespace in credentials

### Token Verification Fails

1. Check `JWT_SECRET` is consistent
2. Verify token hasn't expired (24 hours)
3. Ensure Authorization header format is correct

## Production Considerations

### Security Enhancements

1. **Password Hashing**: Implement bcrypt for password storage
2. **HTTPS**: Always use HTTPS in production
3. **CORS**: Configure strict CORS policies
4. **Rate Limiting**: Add IP-based rate limiting
5. **Audit Logging**: Log all authentication attempts
6. **Session Management**: Consider httpOnly cookies instead of localStorage

### Environment Variables

Never commit `.env` files to version control. Use secure environment variable management in production (e.g., AWS Secrets Manager, Azure Key Vault).

### Database

Ensure MongoDB connection uses SSL/TLS in production.

## Files Modified/Created

### Backend
- `server/models/AdminOTP.js` - New
- `server/routes/adminAuthRoutes.js` - New
- `server/server.js` - Modified (added routes)
- `server/.env` - Modified (added admin config)
- `server/.env.example` - Modified (added admin config)

### Frontend
- `src/components/AdminLoginModal.jsx` - Modified (full OTP integration)
- `src/pages/Admin.jsx` - Modified (token-based auth)
- `.env` - New (frontend config)

## Support

For issues or questions:
- Check server logs: `server/logs/`
- Enable debug mode in Telegram service
- Test endpoints with curl/Postman
- Verify Telegram bot with [@BotFather](https://t.me/botfather)