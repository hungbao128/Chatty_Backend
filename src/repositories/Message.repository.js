const MessageModel = require("../models/Message.model");

class MessageRepository {
    async getMessages({conservationId, page = 1, limit = 50}) {
        return MessageModel.find({conservation: conservationId})
                .populate("sender", "-password -createdAt -updatedAt -email -bio -dateOfBirth -gender -phone -__v")
                .populate({
                    path: "parent", 
                    select: "-conservation -__v",
                    populate: {
                        path: 'sender',
                        select: '-password -createdAt -updatedAt -email -bio -dateOfBirth -gender -phone -__v'
                    }
                })
                .sort({createdAt: -1})
                // .skip((page - 1) * limit)
                // .limit(limit);
    }

    async createMessage({userId, conservationId, content, parentId = null, type = "text"}) {
        return MessageModel.create({sender: userId, conservation: conservationId, content, type, parent: parentId});
    }

    async getMessageById(messageId){
        return await MessageModel.findById(messageId);
    }

    async deleteMessage(messageId){
        return await MessageModel.findByIdAndUpdate(messageId, {isDelete: true}, {new: true});
    }

    async createFileMessage({userId, conservationId, files, content, parentId = null, type = "file"}){
        return MessageModel.create({sender: userId, conservation: conservationId, content, attachments: files, type, parent: parentId});
    }
}

module.exports = new MessageRepository();