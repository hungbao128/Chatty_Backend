const BadRequest = require("../core/BadRequest");
const cloudinary = require("./../configs/cloudinary");
const MessageHelper = require("../helpers/MessageHelper");
const ConservationRepository = require("../repositories/Conservation.repository");
const MessageRepository = require("../repositories/Message.repository");

class MessageService {
  async populateMessage(message) {
    return await message
      .populate(
        "sender",
        "-password -createdAt -updatedAt -email -bio -dateOfBirth -gender -phone -__v"
      )
      .then((result) =>
        result.populate({
          path: "parent",
          select: "-conservation -__v",
          populate: {
            path: "sender",
            select:
              "-password -createdAt -updatedAt -email -bio -dateOfBirth -gender -phone -__v",
          },
        })
      );
  }

  async getMessages({ userId, conservationId, page = 1, limit = 50 }) {
    if (
      (await ConservationRepository.isUserInConservation(
        conservationId,
        userId
      )) === null
    ) {
      throw new BadRequest("You are not in this conservation");
    }

    const messages = await MessageRepository.getMessages({
      conservationId,
      page,
      limit,
    });

    const result = messages.map((message) =>
      MessageHelper.generateMessage(message, userId)
    );

    return result;
  }

  async sendMessage({ userId, conservationId, content }) {
    const conversation = await ConservationRepository.isUserInConservation(
      conservationId,
      userId
    );
    if (conversation === null) {
      throw new BadRequest("You are not in this conservation");
    }

    const message = await MessageRepository.createMessage({
      userId,
      conservationId,
      content,
    });

    const members = conversation.members;

    const updatePromises = members.map(async (memberId) => {
      return await ConservationRepository.updateConservation(conservationId, {
        lastMessage: message._id,
        [`readStatus.${memberId}`]:
          userId.toString() === memberId.toString() ? true : false,
      });
    });

    await Promise.all(updatePromises);

    return MessageHelper.generateMessage(
      await this.populateMessage(message),
      userId
    );
  }

  async replyMessage({ userId, conservationId, content, parentId }) {
    const conversation = await ConservationRepository.isUserInConservation(
      conservationId,
      userId
    );
    if (conversation === null) {
      throw new BadRequest("You are not in this conservation");
    }

    const parentMessage = await MessageRepository.getMessageById(parentId);
    if (parentMessage === null) {
      throw new BadRequest("Parent message not found");
    }

    const message = await MessageRepository.createMessage({
      userId,
      conservationId,
      content,
      parentId,
    });

    const members = conversation.members;

    const updatePromises = members.map(async (memberId) => {
      return await ConservationRepository.updateConservation(conservationId, {
        lastMessage: message._id,
        [`readStatus.${memberId}`]:
          userId.toString() === memberId.toString() ? true : false,
      });
    });

    await Promise.all(updatePromises);

    return MessageHelper.generateMessage(
      await this.populateMessage(message),
      userId
    );
  }

  async deleteMessage({ userId, messageId }) {
    const message = await MessageRepository.getMessageById(messageId);

    if (message === null) {
      throw new BadRequest("Message not found");
    }

    if (message.sender.toString() !== userId.toString()) {
      throw new BadRequest("You can only delete your message");
    }

    await MessageRepository.deleteMessage(messageId);

    return true;
  }

  async setReadMessage({ userId, conservationId }) {
    const conversation = await ConservationRepository.isUserInConservation(
      conservationId,
      userId
    );
    if (conversation === null) {
      throw new BadRequest("You are not in this conservation");
    }

    await ConservationRepository.updateConservation(conservationId, {
      [`readStatus.${userId.toString()}`]: true,
    });

    return true;
  };

  async sendFileMessage({ userId, conservationId, files, content = "" }) {
    const conversation = await ConservationRepository.isUserInConservation(
      conservationId,
      userId
    );
    if (conversation === null) {
      throw new BadRequest("You are not in this conservation");
    }

    console.log(files);
    const fileTypes = files.map((file) => file.mimetype.split("/")[0]);

    const filePromises = files.map(async (file) => {
      return await cloudinary.uploader.upload(file.path, {
        folder: "chat-app",
        resource_type: "auto",
      });
    });

    const results = await Promise.all(filePromises);

    const filesResult = results.map((result, index) => {
      return {
        url: result.secure_url,
        type: fileTypes[index],
      };
    });

    const message = await MessageRepository.createFileMessage({
      userId,
      conservationId,
      files: filesResult,
      content,
    });

    const members = conversation.members;

    const updatePromises = members.map(async (memberId) => {
      return await ConservationRepository.updateConservation(conservationId, {
        lastMessage: message._id,
        [`readStatus.${memberId}`]:
          userId.toString() === memberId.toString() ? true : false,
      });
    });

    await Promise.all(updatePromises);

    return MessageHelper.generateMessage(
      await this.populateMessage(message),
      userId
    );
  }

  async sendFileMessageV2({ userId, conservationId, files, content = "" }) {
    const conversation = await ConservationRepository.isUserInConservation(
      conservationId,
      userId
    );
    if (conversation === null) {
      throw new BadRequest("You are not in this conservation");
    }

    console.log(files);
    // const fileTypes = files.map((file) => file.mimetype.split("/")[0]);

    const filePromises = files.map(async (file) => {
      return await cloudinary.uploader.upload(file.path, {
        folder: "chat-app",
        resource_type: "auto",
      });
    });

    const results = await Promise.all(filePromises);

    const filesResult = results.map((result, index) => {
      return {
        url: result.secure_url,
      };
    });

    const message = await MessageRepository.createFileMessage({
      userId,
      conservationId,
      files: filesResult,
      content,
    });

    const members = conversation.members;

    const updatePromises = members.map(async (memberId) => {
      return await ConservationRepository.updateConservation(conservationId, {
        lastMessage: message._id,
        [`readStatus.${memberId}`]:
          userId.toString() === memberId.toString() ? true : false,
      });
    });

    await Promise.all(updatePromises);

    return MessageHelper.generateMessage(
      await this.populateMessage(message),
      userId
    );
  }
}

module.exports = new MessageService();
