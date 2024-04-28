const mongoose = require('mongoose');

const verifyEmailToken = new mongoose.Schema({
    email: {
        type: String,
        required: true
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

const VerifyEmailTokenModel = mongoose.model('VerifyEmailToken', verifyEmailToken);

module.exports = VerifyEmailTokenModel;
