const app = require('./app'); // This imports the app from app.js
const connectDB = require('./config/db');
const dotenv = require('dotenv');

dotenv.config();

// 1. Connect to MongoDB
connectDB();

// 2. Choose a port (Try 5000 if 7000 continues to give trouble)
const PORT = process.env.PORT || 7000;

// 3. Start the server once
app.listen(PORT, () => {
    console.log(`Server is finally running on port ${PORT}`);
});