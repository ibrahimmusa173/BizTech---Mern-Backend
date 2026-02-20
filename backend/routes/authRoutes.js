const express = require('express');
const { 
    register, 
    login, 
    getProfile,      // NEW: View profile
    updateProfile, 
    forgotPassword, 
    resetPassword,
    getDashboard     // NEW: View dashboard
} = require('../controllers/authController');

const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Public Routes (No token needed)
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

// Protected Routes (Token required)
router.get('/dashboard', protect, getDashboard); // View dashboard after login
router.get('/profile', protect, getProfile);     // View profile
router.put('/profile', protect, updateProfile);  // Update profile

module.exports = router;