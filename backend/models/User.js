// backend/models/User.js
const db = require('../config/db'); // Import the database connection
const bcrypt = require('bcryptjs'); // For password hashing

const User = {
    // Finds a user by email
    findByEmail: (email, callback) => {
        db.query("SELECT * FROM users WHERE email = ?", [email], callback);
    },

    // Creates a new user with hashed password
    create: (userData, callback) => {
        const { name, company_name, email, password, user_type } = userData;
        // Hash password before storing
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) return callback(err);

            const sql = "INSERT INTO users (name, company_name, email, password, user_type) VALUES (?, ?, ?, ?, ?)";
            db.query(sql, [name, company_name, email, hashedPassword, user_type], callback);
        });
    },

    // New method to update Name and Company Name
    updateProfile: (id, name, company_name, callback) => {
        const sql = "UPDATE users SET name = ?, company_name = ? WHERE id = ?";
        db.query(sql, [name, company_name, id], callback);
    },

    getAll: (callback) => {
        db.query("SELECT id, name, company_name, email, user_type FROM users", callback);
    },

    saveResetToken: (email, token, expire, callback) => {
        db.query(
            "UPDATE users SET resetPasswordToken = ?, resetPasswordExpire = ? WHERE email = ?",
            [token, expire, email],
            (err, result) => {
                if (err) { callback(err); return; }
                if (result.affectedRows === 0) { callback({ kind: "not_found" }); return; }
                callback(null, result);
            }
        );
    },

    findByResetToken: (token, callback) => {
        db.query(
            "SELECT * FROM users WHERE resetPasswordToken = ? AND resetPasswordExpire > NOW()",
            [token],
            (err, rows) => {
                if (err) { callback(err); return; }
                if (rows.length) { callback(null, rows[0]); return; }
                callback({ kind: "not_found" });
            }
        );
    },

    updatePassword: (userId, newPassword, callback) => {
        bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
            if (err) return callback(err);

            db.query(
                "UPDATE users SET password = ?, resetPasswordToken = NULL, resetPasswordExpire = NULL WHERE id = ?",
                [hashedPassword, userId],
                (err, result) => {
                    if (err) { callback(err); return; }
                    if (result.affectedRows === 0) { callback({ kind: "not_found" }); return; }
                    callback(null, result);
                }
            );
        });
    },
};

module.exports = User;