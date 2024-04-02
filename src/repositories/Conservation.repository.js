const ConservationModel = require("../models/Conservation.model");
const { ObjectId } = require("mongoose").Types;
require("../models/Message.model");

class ConservationRepository {
  async create({ creatorId, userId, type = "private" }) {
    return await ConservationModel.create({
      type,
      creator: creatorId,
      members: [creatorId, userId],
      readStatus: {
        [creatorId]: true,
        [userId]: true,
      },
    });
  }

  async findPrivateConservationByMembers(creatorId, userId) {
    return await ConservationModel.findOne({
      type: "private",
      $and: [
        { members: { $elemMatch: { $eq: userId } } },
        { members: { $elemMatch: { $eq: creatorId } } },
      ],
    })
      .populate(
        "members",
        "-password -createdAt -updatedAt -email -bio -dateOfBirth -gender -phone -__v"
      )
      .populate(
        "creator",
        "-password -createdAt -updatedAt -bio -dateOfBirth -gender -phone -email -__v"
      )
      .populate("lastMessage", "-seenBy -createdAt -conservation -__v");
  }

  async findConservationsByUserId(userId) {
    return await ConservationModel.find({ members: { $in: [userId] } })
      .populate(
        "members",
        "-password -createdAt -updatedAt -email -bio -dateOfBirth -gender -phone -__v"
      )
      .populate(
        "creator",
        "-password -createdAt -updatedAt -bio -dateOfBirth -gender -phone -email -__v"
      )
      .populate("lastMessage", "-seenBy -createdAt -conservation -__v")
      .sort({ updatedAt: -1 });
  }

  async updateConservation(conservationId, data) {
    return await ConservationModel.updateOne(
      { _id: new ObjectId(conservationId) },
      data
    );
  }

  async isUserInConservation(conservationId, userId) {
    return await ConservationModel.findOne({
      _id: new ObjectId(conservationId),
      members: { $in: [userId] },
    });
  }
}

module.exports = new ConservationRepository();
