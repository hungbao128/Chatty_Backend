const conservationRepository = require("../repositories/Conservation.repository");
const ServerErrorRequest = require("../core/ServerErrorRequest");
const BadRequest = require("../core/BadRequest");

class ConservationService {
    async conservationPopulate(conservation){
        return conservation.populate('members', "-password -createdAt -updatedAt -email -__v")
            .then(result => result.populate('creator', "-password -createdAt -updatedAt -email -__v"))
            .then(result => result.populate('lastMessage', "-seenBy -createdAt -updatedAt -conservation __v"))
    }

    async openConservation(creatorId, userId) {
        // if(creatorId == userId) throw new BadRequest('Cannot open conservation with yourself.');

        const existingConservation = await conservationRepository.findPrivateConservationByMembers(creatorId, userId);

        if(existingConservation) return await this.conservationPopulate(existingConservation);
        
        const conservation = await conservationRepository.create({creatorId, userId});

        if(!conservation) throw new ServerErrorRequest('Cannot create conservation.');

        return await this.conservationPopulate(conservation);
    }
}

module.exports = new ConservationService();