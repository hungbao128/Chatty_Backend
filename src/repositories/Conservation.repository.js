const ConservationModel = require("../models/Conservation.model");
require("../models/Message.model");

class ConservationRepository {
    async create({creatorId, userId, name = '', type = 'private'}){
        return await ConservationModel.create({
            name,
            type,
            creator: creatorId,
            members: [creatorId, userId]
        });
    }

    async findPrivateConservationByMembers(creatorId, userId){
        return await ConservationModel.findOne({
            type: 'private',
            $and: [
                {members: {$elemMatch: {$eq: userId}}},
                {members: {$elemMatch: {$eq: creatorId}}}
            ]
        });
    }
}

module.exports = new ConservationRepository();