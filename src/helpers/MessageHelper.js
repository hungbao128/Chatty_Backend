class MessageHelper {
  static generateMessage(message, userId) {
    const sender = message.sender;
    // console.log(message?.constructor?.name === 'model');
    message = (message?.constructor?.name === 'model') ? message.toObject() : message;
    // message = message.toObject();
    message.avatar = sender.avatar;
    message.name = sender.name;
    message.isMine = message.sender._id.toString() === userId.toString();

    if(message.isDelete){
      message.content = "This message has been deleted";
    }

    if(message.parent){
      message.parent = MessageHelper.generateMessage(message.parent, userId);
    }

    delete message.isDelete;
    delete message.sender;
    delete message.conservation;
    delete message.__v;

    return message;
  }
}

module.exports = MessageHelper;
