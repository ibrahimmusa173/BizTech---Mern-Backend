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

// CORRECTED: Removed 'next' because we are using an async function
userSchema.pre('save', async function () {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return;

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        throw new Error(error);
    }
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);