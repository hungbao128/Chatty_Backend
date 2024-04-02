class MessageHelper {
  static generateMessage(message, userId) {
    const sender = message.sender;

    message = message.toObject();
    message.avatar = sender.avatar;
    message.name = sender.name;
    message.isMine = message.sender._id.toString() === userId.toString();

    delete message.sender;
    delete message.conservation;
    delete message.__v;

    return message;
  }
}

module.exports = MessageHelper;
