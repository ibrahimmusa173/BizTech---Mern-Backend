const express = require('express');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const cors = require('cors');

// Import Route Files
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// --- MIDDLEWARE ---
app.use(helmet());           
app.use(express.json());     
app.use(mongoSanitize());    
app.use(cors());             

// --- MOUNT ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Root route for testing
app.get('/', (req, res) => res.send('API is running...'));

// Export the app so server.js can use it
module.exports = app;