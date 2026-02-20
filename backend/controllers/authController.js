const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/emailService');

// Helper to generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register user (Client, Vendor, Admin)
exports.register = async (req, res) => {
    try {
        const { name, company_name, email, password, user_type } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ success: false, message: 'User already exists' });

        const user = await User.create({ name, company_name, email, password, user_type });
        const token = generateToken(user._id);

        res.status(201).json({ success: true, token, user: { id: user._id, name: user.name, user_type: user.user_type } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) return res.status(400).json({ success: false, message: 'Please provide email and password' });

        const user = await User.findOne({ email }).select('+password');
        if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

        const token = generateToken(user._id);
        res.status(200).json({ success: true, token, user: { id: user._id, name: user.name, user_type: user.user_type } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getDashboard = async (req, res) => {
    try {
        const userRole = req.user.user_type; // 'admin', 'client', or 'vendor'
        
        if (userRole === 'admin') {
            return res.status(200).json({ success: true, message: "Welcome to Admin Dashboard", stats: { users: 10, revenue: 5000 } });
        } else if (userRole === 'vendor') {
            return res.status(200).json({ success: true, message: "Welcome to Vendor Dashboard", stats: { active_bids: 5 } });
        } else if (userRole === 'client') {
            return res.status(200).json({ success: true, message: "Welcome to Client Dashboard", stats: { active_projects: 2 } });
        }

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        // req.user.id comes from the authMiddleware
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update user profile
exports.updateProfile = async (req, res) => {
    try {
        const { name, company_name } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name, company_name },
            { new: true, runValidators: true }
        );

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'There is no user with that email' });
        }

        // Generate token and save it to the user document
        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false });

        // Create reset URL (Make sure this matches your frontend route)
        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
        const message = `You are receiving this email because you (or someone else) has requested the reset of a password.\n\nPlease make a PUT request to: \n\n ${resetUrl}`;

        try {
            // Attempt to send the email
            await sendEmail({ 
                email: user.email, 
                subject: 'Password reset token', 
                message 
            });
            
            res.status(200).json({ success: true, message: 'Email sent successfully' });

        } catch (err) {
            // 🚨 LOG THE ERROR: This will print the exact Nodemailer error in your terminal
            console.error("EMAIL SENDING FAILED:", err); 

            // Rollback: remove the tokens if email fails
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });
            
            return res.status(500).json({ success: false, message: 'Email could not be sent. Check terminal logs.' });
        }

    } catch (error) {
        console.error("SERVER ERROR:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Reset Password
exports.resetPassword = async (req, res) => {
    try {
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired token' });

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};