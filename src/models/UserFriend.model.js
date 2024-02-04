const mongoose = require("mongoose");

const UserFriendSchema = new mongoose.Schema({
    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    status: {
        type: String,
        enums: [
            'pending',
            'accepted',
        ]
    }
}, {timestamps: true})

const UserFriendModel = mongoose.model("UserFriend", UserFriendSchema);

module.exports = UserFriendModel;