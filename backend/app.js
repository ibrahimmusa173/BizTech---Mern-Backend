const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const itemRoutes = require('./routes/itemRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes'); // Import User routes
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = 7000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// API Routes
app.use('/api', itemRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); // Link user routes to /api/users

// Root route
app.get('/', (req, res) => {
    res.send('Server is running and ready for API requests!');
});

// Start the server
app.listen(port, () => console.log(`Server is running on port ${port}`));

module.exports = app;