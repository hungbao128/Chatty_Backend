const mongoose = require('mongoose');

const resetPasswordTokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    otp: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300
    }
})

const resetPasswordTokenModel = mongoose.model('ResetPasswordToken', resetPasswordTokenSchema);

module.exports = resetPasswordTokenModel;
