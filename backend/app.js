const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const { MongoStore } = require('connect-mongo');

const paymentController = require('./controllers/paymentController');
const { protect } = require('./middleware/authMiddleware');

require('./config/passport');

const authRoutes = require('./routes/authRoutes');
const tenderRoutes = require('./routes/tenderRoutes');
const proposalRoutes = require('./routes/proposalRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const oauthRoutes = require('./routes/oauthRoutes');

const app = express();

// Stripe Webhook (Keep this before express.json)
app.post(
  '/api/payments/webhook', 
  express.raw({ type: 'application/json' }), 
  paymentController.stripeWebhook
);

app.use(cors({
  origin: [
    'https://biz-tech-mern-frontend.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'stripe-signature'],
}));

app.use(express.json());
app.options('*', cors());

// 2. UPDATED SESSION CONFIGURATION
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback_secret',
  resave: false,
  saveUninitialized: false,
  // Use 'new MongoStore' instead of 'MongoStore.create'
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions',
    ttl: 14 * 24 * 60 * 60, // 14 days
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production', 
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', oauthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', tenderRoutes);
app.use('/api', proposalRoutes);
app.use('/api', notificationRoutes);
app.use('/api/admin', adminRoutes);

app.post('/api/payments/create-checkout-session', protect, paymentController.createCheckoutSession);

app.get('/', (req, res) => res.send('API is running...'));

module.exports = app;