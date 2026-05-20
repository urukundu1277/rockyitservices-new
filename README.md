# Rocky IT Services - Full Stack Application

## 🚀 Production Deployment Status: ✅ COMPLETE

**Frontend**: https://rockyitservices.com (Cloudflare Pages)  
**Backend API**: https://rockyitservices-new.onrender.com (Render)  
**Database**: MongoDB Atlas

---

## 📋 Project Overview

Rocky IT Services is a comprehensive IT solutions platform with:
- **Frontend**: React + Vite (Cloudflare Pages deployment)
- **Backend**: Node.js + Express (Render deployment)
- **Database**: MongoDB Atlas
- **Notifications**: Telegram Bot Integration

---

## 🏗️ Project Structure

```
codeforme/
├── src/                          # React Frontend
│   ├── pages/
│   │   ├── Home.jsx             # Homepage with service booking
│   │   ├── Login.jsx            # User login
│   │   ├── Register.jsx         # User registration
│   │   ├── Contact.jsx          # Contact form
│   │   ├── Admin.jsx            # Admin dashboard
│   │   ├── AdminLogin.jsx       # Admin login
│   │   ├── Dashboard.jsx        # User dashboard
│   │   └── Services.jsx         # Services page
│   ├── components/
│   │   ├── Navbar.jsx           # Navigation bar
│   │   ├── Hero.jsx             # Hero section
│   │   ├── Footer.jsx           # Footer
│   │   ├── ServiceCard.jsx      # Service card component
│   │   └── WhatsAppButton.jsx   # WhatsApp button
│   ├── App.jsx                  # Main App component
│   └── main.jsx                 # Entry point
│
├── server/                       # Express Backend
│   ├── routes/
│   │   ├── authRoutes.js        # Authentication endpoints
│   │   ├── contactRoutes.js     # Contact form endpoint
│   │   ├── bookingRoutes.js     # Booking endpoint
│   │   ├── leadRoutes.js        # Lead generation endpoint
│   │   ├── registerRoutes.js    # Registration endpoint
│   │   └── customerRoutes.js    # Customer management endpoint
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Customer.js          # Customer schema
│   │   ├── Contact.js           # Contact schema
│   │   ├── Booking.js           # Booking schema
│   │   └── Lead.js              # Lead schema
│   ├── services/
│   │   └── telegram.js          # Telegram notification service
│   ├── config/
│   │   └── db.js                # MongoDB connection
│   ├── server.js                # Express server entry point
│   ├── .env                     # Environment variables (production)
│   └── .env.example             # Environment template
│
├── PRODUCTION_DEPLOYMENT.md     # Deployment guide
├── CODE_CHANGES.md              # Detailed code changes
├── QUICK_REFERENCE.md           # Quick reference card
├── package.json                 # Frontend dependencies
├── vite.config.js               # Vite configuration
├── index.html                   # Frontend entry HTML
└── README.md                    # This file
```

---

## 🔗 API Endpoints - Production

### Authentication (`/api/auth`)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/register` | User registration |

### Contact & Leads (`/api/contact`, `/api/booking`, `/api/register`, `/api/lead`)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/contact` | Submit contact form (Telegram notification) |
| POST | `/api/booking` | Submit service booking (Telegram notification) |
| POST | `/api/register` | Customer registration (Telegram notification) |
| POST | `/api/lead` | Lead generation (Telegram notification) |

### Admin Dashboard (`/api/customers`)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/customers` | Fetch all customers |
| POST | `/api/customers/register` | Register new customer |
| PATCH | `/api/customers/{id}/status` | Update customer status |

### Utilities
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/test-telegram` | Test Telegram connectivity |
| GET | `/` | Backend health check |

**Base URL**: `https://rockyitservices-new.onrender.com`

---

## 🔐 CORS Configuration

**Allowed Origins**:
- https://rockyitservices.com
- https://www.rockyitservices.com

**Allowed Methods**: GET, POST, PUT, DELETE  
**Credentials**: Enabled (for JWT token transmission)  
**Headers**: Content-Type, Authorization

---

## 📦 Installation & Setup

### Prerequisites
- Node.js v18+ and npm
- MongoDB Atlas account
- Telegram Bot Token

### Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Backend Setup

```bash
cd server

# Install dependencies
npm install

# Start development server
npm start

# For production (via Render)
# Set environment variables on Render dashboard
# Node will auto-start with: node server.js
```

---

## 🌍 Production Deployment

### Frontend (Cloudflare Pages)

1. **Configure on Cloudflare Pages**:
   - Build Command: `npm run build`
   - Build Output Directory: `dist`
   - Framework: Vite

2. **Deployed at**: https://rockyitservices.com

3. **Verify**:
   ```bash
   curl https://rockyitservices.com
   ```

### Backend (Render)

1. **Configure on Render**:
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Environment Variables:
     ```
     PORT=5000
     MONGO_URI=<your_connection_string>
     JWT_SECRET=<your_secret>
     TELEGRAM_BOT_TOKEN=<your_token>
     TELEGRAM_CHAT_ID=<your_chat_id>
     ```

2. **Deployed at**: https://rockyitservices-new.onrender.com

3. **Verify**:
   ```bash
   curl https://rockyitservices-new.onrender.com/
   ```

### Database (MongoDB Atlas)

- **Connection String**: `mongodb+srv://rocky:rockyitservices123@cluster0.vgapbjw.mongodb.net/?appName=Cluster0`
- **Collections**: Users, Customers, Contacts, Bookings, Leads

---

## 📝 Recent Production Updates (May 20, 2026)

✅ **CORS Configuration Updated**
- Replaced `app.use(cors())` with production-specific configuration
- Added whitelisted domains: rockyitservices.com, www.rockyitservices.com
- Enabled credentials for JWT token transmission

✅ **All API URLs Updated**
- 7 frontend components updated to use production API
- All `http://localhost:5000` replaced with `https://rockyitservices-new.onrender.com`
- HTTPS enforced everywhere

✅ **Middleware Order Verified**
- CORS → JSON Parser → Routes (correct production order)
- express.json() middleware enabled
- Authorization header support added

✅ **Documentation Created**
- PRODUCTION_DEPLOYMENT.md - Comprehensive deployment guide
- CODE_CHANGES.md - Detailed change documentation
- QUICK_REFERENCE.md - Quick reference card

---

## 🔑 Environment Variables

### Backend (.env)

```env
# Server Configuration
PORT=5000

# Database
MONGO_URI=mongodb+srv://rocky:rockyitservices123@cluster0.vgapbjw.mongodb.net/?appName=Cluster0

# Authentication
JWT_SECRET=rockyitsecret

# Telegram Notifications
TELEGRAM_BOT_TOKEN=8722014931:AAH7uAEroyhymqxrv7U2Yqli7ZdOFLYsGgk
TELEGRAM_CHAT_ID=8854400383

# Optional
SEND_TELEGRAM_STARTUP_ALERT=false
```

### Frontend

- No .env file needed
- All API URLs are hardcoded to production values
- Uses Axios for HTTP requests

---

## 🧪 Testing

### Backend API Testing

```bash
# Test backend health
curl https://rockyitservices-new.onrender.com/

# Test CORS headers
curl -H "Origin: https://rockyitservices.com" \
  -H "Access-Control-Request-Method: POST" \
  -X OPTIONS https://rockyitservices-new.onrender.com/api/contact

# Test Telegram notification
curl https://rockyitservices-new.onrender.com/api/test-telegram
```

### Frontend Testing

```bash
# Start frontend dev server
npm run dev

# Open browser to http://localhost:5173
# Test contact form, booking, login, register
```

---

## 🛠️ Technologies Used

### Frontend
- **React** 18+ - UI Framework
- **Vite** - Build tool (lightning-fast)
- **Tailwind CSS** - Utility-first CSS
- **Axios** - HTTP client
- **React Router** - Client-side routing

### Backend
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **bcryptjs** - Password hashing
- **JWT** - JSON Web Tokens for authentication
- **CORS** - Cross-Origin Resource Sharing
- **Telegram Bot API** - Notifications

---

## 📚 Files Documentation

### Production Deployment Files
1. **PRODUCTION_DEPLOYMENT.md** - Step-by-step deployment guide
2. **CODE_CHANGES.md** - Exact code changes with diff
3. **QUICK_REFERENCE.md** - Quick lookup for endpoints and config

### Key Configuration Files
- `/server/server.js` - Express server with CORS
- `vite.config.js` - Frontend build configuration
- `package.json` - Dependencies and scripts
- `/server/.env` - Production environment variables

---

## 🐛 Troubleshooting

### CORS Errors
- Verify Render backend is running
- Check origin URLs match Cloudflare domain
- Ensure credentials: true in CORS config

### API 404 Errors
- Check API endpoints include `/api/` prefix
- Verify Render backend routes are loaded
- Test with: `https://rockyitservices-new.onrender.com/`

### Telegram Notifications Not Working
- Test endpoint: `https://rockyitservices-new.onrender.com/api/test-telegram`
- Verify TELEGRAM_BOT_TOKEN in Render .env
- Verify TELEGRAM_CHAT_ID in Render .env
- Check Render logs for errors

### Frontend Build Issues
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf dist`
- Rebuild: `npm run build`

---

## 📊 Deployment Checklist

- ✅ All localhost URLs replaced with production API
- ✅ CORS configured for production domains
- ✅ Middleware order correct
- ✅ express.json() enabled
- ✅ All routes verified
- ✅ HTTPS enforced
- ✅ Environment variables set
- ✅ Database connected
- ✅ Telegram notifications configured
- ✅ Frontend deployed to Cloudflare Pages
- ✅ Backend deployed to Render

---

## 🎉 Status: PRODUCTION LIVE

✅ **Frontend**: https://rockyitservices.com  
✅ **Backend**: https://rockyitservices-new.onrender.com  
✅ **Database**: MongoDB Atlas Connected  
✅ **Notifications**: Telegram Bot Active

---

## 📞 Support

For deployment issues:
1. Check Render backend logs
2. Verify Cloudflare Pages build status
3. Test API endpoints with curl
4. Check browser console for errors
5. Review environment variables on Render

---

## 📄 License

MIT License - Feel free to use this project for commercial or personal purposes.

---

**Last Updated**: May 20, 2026  
**Deployment Status**: ✅ Production Ready
