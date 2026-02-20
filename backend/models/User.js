const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true
    },

    company_name: { 
        type: String,
        required: function () { 
            return this.user_type !== 'admin'; 
        }
    },

    email: { 
        type: String, 
        required: true, 
        unique: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },

    password: { 
        type: String, 
        required: true, 
        minlength: 6,
        select: false
    },

    user_type: { 
        type: String, 
        enum: ['admin', 'client', 'vendor'],
        required: true
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date

}, { timestamps: true });


// Encrypt password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});


// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};


// Generate reset token
userSchema.methods.getResetPasswordToken = function () {

    const resetToken = crypto.randomBytes(20).toString('hex');

    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

module.exports = mongoose.model('User', userSchema);