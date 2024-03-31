const BadRequest = require("../core/BadRequest");
const ConservationRepository = require("../repositories/Conservation.repository");
const MessageRepository = require("../repositories/Message.repository");

class MessageService {
    async getMessages({userId, conservationId, page = 1, limit = 50}) {
        if(await ConservationRepository.isUserInConservation(conservationId, userId) === null){
            throw new BadRequest("You are not in this conservation");
        }

        const messages = await MessageRepository.getMessages({conservationId, page, limit});

        return messages;
    }
}

module.exports = new MessageService();