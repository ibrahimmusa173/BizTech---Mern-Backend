const dotenv = require('dotenv');
dotenv.config(); // ✅ Must be FIRST before anything reads process.env

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');

require('./config/passport'); // Run passport Google strategy setup

const authRoutes = require('./routes/authRoutes');
const tenderRoutes = require('./routes/tenderRoutes');
const proposalRoutes = require('./routes/proposalRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const oauthRoutes = require('./routes/oauthRoutes'); // Google OAuth routes

const app = express();

// 1. CORS
app.use(cors({
  origin: [
    'https://biz-tech-mern-frontend.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.options('*', cors());

// 2. Session (needed for passport internally, even though we use JWT)
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// 3. Passport
app.use(passport.initialize());
app.use(passport.session());

// 4. Routes
app.use('/auth', oauthRoutes);         // Google OAuth: /auth/google, /auth/google/callback
app.use('/api/auth', authRoutes);      // Email/pass: /api/auth/login, /api/auth/register
app.use('/api', tenderRoutes);
app.use('/api', proposalRoutes);
app.use('/api', notificationRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => res.send('API is running...'));

module.exports = app;