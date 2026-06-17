const app = require('./app');
const connectDB = require('./config/db');
const dotenv = require('dotenv');

dotenv.config();

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 7000;

// Only start server if not running on Vercel
if (process.env.NODE_ENV !== 'development') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export app for Vercel serverless
module.exports = app;