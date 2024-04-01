const messageService = require("../services/message.service");

class MessageController {
    async getMessages(req, res, next){
        const {id} = req.params;
        const {_id: userId} = req.user;
        const {page, limit} = req.query;

        const messages = await messageService.getMessages({userId, conservationId: id, page, limit});

        return res.status(200).json({
            message: "Messages fetched successfully",
            data: messages
        });
    }

    async sendMessage(req, res, next){
        const {id} = req.params;
        const {_id: userId} = req.user;
        const {content} = req.body;

        const message = await messageService.sendMessage({userId, conservationId: id, content});

        return res.status(201).json({
            message: "Message sent successfully",
            data: message
        });
    }
}

module.exports = new MessageController();