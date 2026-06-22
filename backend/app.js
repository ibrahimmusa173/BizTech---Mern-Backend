const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');

// Import Controllers & Routes
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

// 1. STRIPE WEBHOOK (CRITICAL: Must be BEFORE express.json())
// This route needs the RAW body to verify the Stripe signature
app.post(
  '/api/payments/webhook', 
  express.raw({ type: 'application/json' }), 
  paymentController.stripeWebhook
);

// 2. Standard Middleware
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

app.use(express.json()); // Parses JSON for all routes EXCEPT the webhook above
app.options('*', cors());

// 3. Session Management
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback_secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    ttl: 60 * 10 
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production', 
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// 4. Passport Auth
app.use(passport.initialize());
app.use(passport.session());

// 5. API Routes
app.use('/auth', oauthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', tenderRoutes);
app.use('/api', proposalRoutes);
app.use('/api', notificationRoutes);
app.use('/api/admin', adminRoutes);

// Payment Route
app.post('/api/payments/create-checkout-session', protect, paymentController.createCheckoutSession);

app.get('/', (req, res) => res.send('API is running...'));

module.exports = app;