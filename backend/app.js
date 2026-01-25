const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const itemRoutes = require('./routes/itemRoutes');
const authRoutes = require('./routes/authRoutes');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// API Routes
app.use('/api', itemRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

// We EXPORT the app so server.js can use it. 
// DO NOT add app.listen here.
module.exports = app;