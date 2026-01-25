const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendPasswordResetEmail } = require('../utils/emailService');

const authController = {
    register: async (req, res) => {
        try {
            const { name, company_name, email, password, user_type } = req.body;

            const userExists = await User.findOne({ email });
            if (userExists) return res.status(400).json({ message: "Email already registered." });

            const user = await User.create({ name, company_name, email, password, user_type });
            res.status(201).json({ message: "User registered successfully!", userId: user._id });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });

            if (user && (await user.matchPassword(password))) {
                const token = jwt.sign(
                    { id: user._id, email: user.email, user_type: user.user_type },
                    process.env.JWT_SECRET || 'supersecretjwtkey',
                    { expiresIn: '1h' }
                );
                res.status(200).json({
                    message: "Logged in successfully!",
                    token,
                    user: { id: user._id, name: user.name, email: user.email, user_type: user.user_type }
                });
            } else {
                res.status(401).json({ message: "Invalid credentials." });
            }
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    forgotPassword: async (req, res) => {
        try {
            const { email } = req.body;
            const user = await User.findOne({ email });

            if (!user) return res.status(200).json({ message: "If an account exists, a link has been sent." });

            const resetToken = crypto.randomBytes(32).toString('hex');
            user.resetPasswordToken = resetToken;
            user.resetPasswordExpire = Date.now() + 3600000; // 1 hour
            await user.save();

            const emailSent = await sendPasswordResetEmail(user.email, resetToken);
            if (emailSent) res.status(200).json({ message: "Password reset link sent!" });
            else res.status(500).json({ message: "Email could not be sent." });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    resetPassword: async (req, res) => {
        try {
            const { token } = req.params;
            const { newPassword } = req.body;

            const user = await User.findOne({
                resetPasswordToken: token,
                resetPasswordExpire: { $gt: Date.now() }
            });

            if (!user) return res.status(400).json({ message: "Token is invalid or expired." });

            user.password = newPassword;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();

            res.status(200).json({ message: "Password has been successfully reset!" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
};

module.exports = authController;