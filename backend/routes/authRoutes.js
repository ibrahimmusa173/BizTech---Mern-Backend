const express = require('express');
const { 
    register, 
    login, 
    getProfile,
    updateProfile, 
    forgotPassword, 
    resetPassword,
    getDashboard
} = require('../controllers/authController');

const { protect, authorize } = require('../middleware/authMiddleware');
const User = require('../models/User');

const router = express.Router();

// Public Routes (No token needed)
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

// Protected Routes (Token required)
router.get('/dashboard', protect, getDashboard);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

// Google OAuth — set role after first login
router.post('/set-role', protect, async (req, res) => {
    try {
        const { user_type } = req.body;
        if (!['client', 'vendor', 'admin'].includes(user_type)) {
            return res.status(400).json({ success: false, message: 'Invalid role' });
        }
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { user_type },
            { new: true }
        );
        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;