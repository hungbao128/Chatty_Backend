const { Schema, model } = require("mongoose");

const ConservationSchema = new Schema({
    name: {
        type: String,
        default: ''
    },

    type: {
        type: String,
        enum: ['private', 'group']
    },

    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    members: [Schema.Types.ObjectId],

    lastMessage: {
        type: Schema.Types.ObjectId,
        ref: 'Message'
    },
});


const ConservationModel = model("Conservation", ConservationSchema);

module.exports = ConservationModel;