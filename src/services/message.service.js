const BadRequest = require("../core/BadRequest");
const MessageHelper = require("../helpers/MessageHelper");
const ConservationRepository = require("../repositories/Conservation.repository");
const MessageRepository = require("../repositories/Message.repository");

class MessageService {
  async populateMessage(message) {
    return await message.populate(
      "sender",
      "-password -createdAt -updatedAt -email -bio -dateOfBirth -gender -phone -__v"
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
    const conversation = await ConservationRepository.isUserInConservation(conservationId, userId);
    if (conversation === null) {
      throw new BadRequest("You are not in this conservation");
    }

    const message = await MessageRepository.createMessage({
      userId,
      conservationId,
      content,
    });

    conversation.lastMessage = message._id;
    const members = conversation.members;

    const updatePromises = members.map(async (memberId) => {
      return await ConservationRepository.updateConservation(conservationId, {
        [`readStatus.${memberId}`]: (userId.toString() === memberId.toString() ? true : false),
      });
    })

    await Promise.all(updatePromises);
    
    return MessageHelper.generateMessage(
      await this.populateMessage(message),
      userId
    );
  }

  async sendFileMessage({ userId, conservationId, files, content }) {
    if (
      (await ConservationRepository.isUserInConservation(
        conservationId,
        userId
      )) === null
    ) {
      throw new BadRequest("You are not in this conservation");
    }

    // const message = await MessageRepository.createFileMessage({
    //   userId,
    //   conservationId,
    //   files,
    //   content,
    // });

    // await ConservationRepository.updateConservation(conservationId, {
    //   lastMessage: message._id,
    // });

    // return MessageHelper.generateMessage(
    //   await this.populateMessage(message),
    //   userId
    // );
  }
}

module.exports = new MessageService();
