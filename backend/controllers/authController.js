const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
const crypto = require('crypto');     
const { sendPasswordResetEmail } = require('../utils/emailService'); 

const authController = {
    register: (req, res) => {
        const { name, companyName, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).send({ message: "Required fields missing." });
        }

        User.findByEmail(email, (err, users) => {
            if (err) return res.status(500).send({ message: "Server error." });
            if (users && users.length > 0) return res.status(409).send({ message: "Email already exists." });

            User.create({ name, companyName, email, password, role }, (err, result) => {
                if (err) return res.status(500).send({ message: "Error registering user." });
                res.status(201).send({ message: "User registered successfully!", userId: result.insertId });
            });
        });
    },

    login: (req, res) => {
        const { email, password } = req.body;
        User.findByEmail(email, (err, users) => {
            if (err || !users || users.length === 0) return res.status(401).send({ message: "Invalid credentials." });
            const user = users[0];
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (!isMatch) return res.status(401).send({ message: "Invalid credentials." });
                const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
                res.status(200).send({ message: "Logged in!", token, user: { id: user.id, name: user.name } });
            });
        });
    },

    updateProfile: (req, res) => {
        const { id } = req.params;
        const { name, companyName } = req.body;
        if (!name || !companyName) return res.status(400).send({ message: "Name and Company Name required." });

        User.updateProfile(id, name, companyName, (err, result) => {
            if (err) return res.status(500).send({ message: "Update failed." });
            res.status(200).send({ message: "Profile updated successfully!" });
        });
    }
};

module.exports = authController;