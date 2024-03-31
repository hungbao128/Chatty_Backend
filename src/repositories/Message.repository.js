const MessageModel = require("../models/Message.model");

class MessageRepository {
    async getMessages({conservationId, page = 1, limit = 50}) {
        return MessageModel.find({conservation: conservationId})
                .sort({createdAt: -1})
                .skip((page - 1) * limit)
                .limit(limit);
    }
}

module.exports = new MessageRepository();