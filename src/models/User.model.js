const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
    },

    phone: {
        type: String,
        required: true
    },

    dateOfBirth: {
        type: Date,
        required: true
    },


}, {
    timestamps: true
})

const UserModel = model("User", UserSchema);

module.exports = UserModel;