const ConservationModel = require("../models/Conservation.model");
const { ObjectId } = require("mongoose").Types;
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

    async findConservationsByUserId(userId){
        return await ConservationModel.find({members: {$in: [userId]}}).sort({updatedAt: -1});
    }

    async isUserInConservation(conservationId, userId){
        console.log(conservationId, userId);
        return await ConservationModel.findOne({_id: new ObjectId(conservationId), members: {$in: [userId]}});
    }
}

module.exports = new ConservationRepository();