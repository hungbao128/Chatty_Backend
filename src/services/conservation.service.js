const conservationRepository = require("../repositories/Conservation.repository");
const ServerErrorRequest = require("../core/ServerErrorRequest");
const BadRequest = require("../core/BadRequest");
const ConservationHelper = require("../helpers/ConservationHelper");

class ConservationService {
    async conservationPopulate(conservation){
        return conservation.populate('members', "-password -createdAt -updatedAt -email -bio -dateOfBirth -gender -phone -__v")
            .then(result => result.populate('creator', "-password -createdAt -updatedAt -bio -dateOfBirth -gender -phone -email -__v"))
            .then(result => result.populate('lastMessage', "-seenBy -createdAt -updatedAt -conservation -__v"))
    }

    async openConservation(creatorId, userId) {
        if(creatorId == userId) throw new BadRequest('Cannot open conservation with yourself.');

        const existingConservation = await conservationRepository.findPrivateConservationByMembers(creatorId, userId);

        if(existingConservation) return ConservationHelper.generateConservation((await this.conservationPopulate(existingConservation)), creatorId);
        
        const conservation = await conservationRepository.create({creatorId, userId});

        if(!conservation) throw new ServerErrorRequest('Cannot create conservation.');

        return ConservationHelper.generateConservation((await this.conservationPopulate(conservation)), creatorId);
    }

    async getUserConservations(userId){
        const conservations = await conservationRepository.findConservationsByUserId(userId);
        
        if(!conservations) throw new ServerErrorRequest('Cannot get user conservations.');

        const result = await Promise.all(conservations.map(async conservation => {
            return ConservationHelper.generateConservation((await this.conservationPopulate(conservation)), userId);
        }));

        return result;
    }
}

module.exports = new ConservationService();