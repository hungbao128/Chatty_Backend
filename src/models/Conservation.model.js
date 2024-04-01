const { Schema, model } = require("mongoose");

const ConservationSchema = new Schema({
    name: {
        type: String,
        default: ''
    },

    image: {
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

    members: {
        type: [Schema.Types.ObjectId],
        ref: 'User',
        default: []
    },

    lastMessage: {
        type: Schema.Types.ObjectId,
        ref: 'Message',
        default: null
    },

    readStatus: {
        type: Map,
        of: Boolean,
        default: {}
    }
    
}, {timestamps: true});


const ConservationModel = model("Conservation", ConservationSchema);

module.exports = ConservationModel;