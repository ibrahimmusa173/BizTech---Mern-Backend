const db = require('../config/db'); // This imports sqlconnect
const bcrypt = require('bcryptjs'); 

const User = {
    findByEmail: (email, callback) => {
        db.query("SELECT * FROM users WHERE email = ?", [email], callback);
    },

    create: (userData, callback) => {
        const { name, companyName, email, password, role } = userData;
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) return callback(err);
            const sql = "INSERT INTO users (name, company_name, email, password, user_type) VALUES (?, ?, ?, ?, ?)";
            db.query(sql, [name, companyName, email, hashedPassword, role], callback);
        });
    },

    updateProfile: (id, name, companyName, callback) => {
        const sql = "UPDATE users SET name = ?, company_name = ? WHERE id = ?";
        db.query(sql, [name, companyName, id], callback);
    },

    saveResetToken: (email, token, expire, callback) => {
        db.query(
            "UPDATE users SET resetPasswordToken = ?, resetPasswordExpire = ? WHERE email = ?",
            [token, expire, email],
            callback
        );
    },

    findByResetToken: (token, callback) => {
        db.query(
            "SELECT * FROM users WHERE resetPasswordToken = ? AND resetPasswordExpire > NOW()",
            [token],
            (err, rows) => {
                if (err) return callback(err);
                if (rows.length) return callback(null, rows[0]);
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
                callback
            );
        });
    }
};

module.exports = User;