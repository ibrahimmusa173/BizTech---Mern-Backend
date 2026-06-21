const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session'); // ADD THIS
const passport = require('passport');       // ADD THIS

// Import passport config (You must create this file - see Phase 2 Step 3 in previous message)
require('./config/passport'); 

// Import routes
const authRoutes = require('./routes/authRoutes');
const tenderRoutes = require('./routes/tenderRoutes');
const proposalRoutes = require('./routes/proposalRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const oauthRoutes = require('./routes/oauthRoutes'); // ADD THIS (for Google Login)

dotenv.config();

const app = express();

// 1. CORS Configuration (Keep your existing one, ensure credentials is true)
app.use(cors({
  origin: [
    'https://biz-tech-mern-frontend.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173',
  ],
  credentials: true, // Crucial for cookies/sessions
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// 2. Session Middleware (ADD THIS BEFORE ROUTES)
app.use(session({
  secret: process.env.SESSION_SECRET || 'anything_random_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // true if using https
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// 3. Initialize Passport (ADD THIS AFTER SESSION)
app.use(passport.initialize());
app.use(passport.session());

// Handle preflight requests
app.options('*', cors());

// 4. Mount routers
app.use('/auth', oauthRoutes); // New route for Google OAuth
app.use('/api/auth', authRoutes); // Your existing email/pass login
app.use('/api', tenderRoutes);
app.use('/api', proposalRoutes);
app.use('/api', notificationRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

module.exports = app;