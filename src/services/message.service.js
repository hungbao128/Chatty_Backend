const BadRequest = require("../core/BadRequest");
const MessageHelper = require("../helpers/MessageHelper");
const ConservationRepository = require("../repositories/Conservation.repository");
const MessageRepository = require("../repositories/Message.repository");

class MessageService {
    async populateMessage(message) {
        return await message.populate("sender", "-password -createdAt -updatedAt -email -bio -dateOfBirth -gender -phone -__v");
        
    }

    async getMessages({userId, conservationId, page = 1, limit = 50}) {
        if(await ConservationRepository.isUserInConservation(conservationId, userId) === null){
            throw new BadRequest("You are not in this conservation");
        }

        const messages = await MessageRepository.getMessages({conservationId, page, limit});

        return messages;
    }

    async sendMessage({userId, conservationId, content}) {
        if(await ConservationRepository.isUserInConservation(conservationId, userId) === null){
            throw new BadRequest("You are not in this conservation");
        }

        const message = await MessageRepository.createMessage({userId, conservationId, content});
        await ConservationRepository.updateConservation(conservationId, {lastMessage: message._id});
        return MessageHelper.generateMessage((await this.populateMessage(message)), userId);
    }
}

module.exports = new MessageService();