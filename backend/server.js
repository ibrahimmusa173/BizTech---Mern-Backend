const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const app = require('./app'); // Import the app setup

// 1. Load Env Vars
dotenv.config({ path: path.join(__dirname, '.env') });

// 2. Connect to Database
connectDB();

// 3. Start Server
const PORT = process.env.PORT || 7000;

const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections (Optional but recommended)
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});