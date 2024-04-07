const messageService = require("../services/message.service");

class MessageController {
  async getMessages(req, res, next) {
    const { id } = req.params;
    const { _id: userId } = req.user;
    const { page, limit } = req.query;

    const messages = await messageService.getMessages({
      userId,
      conservationId: id,
      page,
      limit,
    });

    return res.status(200).json({
      status: "success",
      message: "Messages fetched successfully",
      data: messages,
    });
  }

  async sendMessage(req, res, next) {
    const { id } = req.params;
    const { _id: userId } = req.user;
    const { content } = req.body;

    const message = await messageService.sendMessage({
      userId,
      conservationId: id,
      content,
    });

    return res.status(201).json({
      status: "success",
      message: "Message sent successfully",
      data: message,
    });
  }

  async sendFileMessage(req, res, next) {
    const { id } = req.params;
    const { _id: userId } = req.user;
    const files = req.files;
    const { content } = req.body;

    const messsage = await messageService.sendFileMessage({
      userId,
      conservationId: id,
      files,
      content,
    });
    return res.status(201).json({
      status: "success",
      message: "Message sent successfully",
      data: messsage,
    });
  }

  async sendFileMessageV2(req, res, next) {
    const { id } = req.params;
    const { _id: userId } = req.user;
    const { content, files } = req.body;

    const messsage = await messageService.sendFileMessageV2({
      userId,
      conservationId: id,
      files,
      content,
    });
    return res.status(201).json({
      status: "success",
      message: "Message sent successfully",
      data: messsage,
    });
  }

  async deleteMessage(req, res, next) {
    const { id } = req.params;
    const { _id: userId } = req.user;

    await messageService.deleteMessage({ userId, messageId: id });

    return res.status(200).json({
      status: "success",
      message: "Message deleted successfully",
    });
  }

  async replyMessage(req, res, next) {
    const { id } = req.params;
    const { _id: userId } = req.user;
    const { messageId: parentId } = req.params;
    const { content } = req.body;

    const message = await messageService.replyMessage({
      userId,
      conservationId: id,
      content,
      parentId,
    });

    return res.status(201).json({
      status: "success",
      message: "Message replied successfully",
      data: message,
    });
  }

  async setReadMessage(req, res, next) {
    const { id } = req.params;
    const { _id: userId } = req.user;

    await messageService.setReadMessage({ userId, conservationId: id });

    return res.status(200).json({
      status: "success",
      message: "Message read successfully",
    });
  }

  async forwardFileMessage(req, res, next) {
    const { id } = req.params;
    const { _id: userId } = req.user;
    const { files, content } = req.body;

    const message = await messageService.forwardFileMessage({
      userId,
      conservationId: id,
      files,
      content
    });

    return res.status(201).json({
      status: "success",
      message: "Message forwarded successfully",
      data: message,
    });
  }
}

module.exports = new MessageController();
