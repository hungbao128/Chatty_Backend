const conservationRepository = require("../repositories/Conservation.repository");
const userRepository = require("../repositories/User.repository");
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
        
        const existingUser = await userRepository.findUserById(userId);
        if(!existingUser) throw new BadRequest('User not found.');
        
        const conservation = await conservationRepository.create({creatorId, userId});

        if(!conservation) throw new ServerErrorRequest('Cannot create conservation.');

        return ConservationHelper.generateConservation((await this.conservationPopulate(conservation)), creatorId);
    }

    async getUserConservations(userId){
        const conservations = await conservationRepository.findConservationsByUserId(userId);
        const conservationsPopulate = await Promise.all(conservations.map(async conservation => await this.conservationPopulate(conservation)));
        const result = conservationsPopulate.map(el => ConservationHelper.generateConservation(el, userId));
        return result;
    }
}

module.exports = new ConservationService();