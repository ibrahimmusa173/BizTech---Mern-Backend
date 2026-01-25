const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    company_name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    user_type: { type: String, enum: ['client', 'bidder', 'admin'], required: true },
    resetPasswordToken: String,
    resetPasswordExpire: Date
}, { timestamps: true });

// Hash password before saving to DB
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);