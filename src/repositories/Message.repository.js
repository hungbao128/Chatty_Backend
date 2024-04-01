const MessageModel = require("../models/Message.model");

class MessageRepository {
    async getMessages({conservationId, page = 1, limit = 50}) {
        return MessageModel.find({conservation: conservationId})
                .populate("sender", "-password -createdAt -updatedAt -email -bio -dateOfBirth -gender -phone -__v")
                .sort({createdAt: -1})
                .skip((page - 1) * limit)
                .limit(limit);
    }

    async createMessage({userId, conservationId, content}) {
        return MessageModel.create({sender: userId, conservation: conservationId, content, type: "text"});
    }
}

module.exports = new MessageRepository();