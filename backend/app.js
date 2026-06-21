const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const { MongoStore } = require('connect-mongo');

require('./config/passport');

const authRoutes = require('./routes/authRoutes');
const tenderRoutes = require('./routes/tenderRoutes');
const proposalRoutes = require('./routes/proposalRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const oauthRoutes = require('./routes/oauthRoutes');

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

// 2. Session — uses MongoDB store in production, memory in development
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback_secret',
  resave: false,
  saveUninitialized: false,
  store: process.env.NODE_ENV === 'production'
    ? MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        ttl: 60 * 10 // 10 minutes — enough for OAuth handshake
      })
    : undefined, // default MemoryStore for local dev
  cookie: {
    secure: process.env.NODE_ENV === 'production',   // HTTPS only in production
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// 3. Passport
app.use(passport.initialize());
app.use(passport.session());

// 4. Routes
app.use('/auth', oauthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', tenderRoutes);
app.use('/api', proposalRoutes);
app.use('/api', notificationRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => res.send('API is running...'));

module.exports = app;