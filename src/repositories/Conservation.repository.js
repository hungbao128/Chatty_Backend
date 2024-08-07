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

  async createGroupConservation({ creatorId, members, type = "group", name, image }) {
    return await ConservationModel.create({
      name,
      image,
      type,
      creator: creatorId,
      members,
      readStatus: members.reduce((acc, cur) => {
        acc[cur] = true;
        return acc;
      }, {}),
      leaders: [creatorId],
    });
  }

  async findConservationById(conservationId) {
    return await ConservationModel.findById(conservationId)
    .populate(
      "members",
      "-password -createdAt -updatedAt -email -bio -dateOfBirth -gender -phone -__v"
    )
    .populate(
      "creator",
      "-password -createdAt -updatedAt -bio -dateOfBirth -gender -phone -email -__v"
    )
    .populate(
      "leaders",
      "-password -createdAt -updatedAt -bio -dateOfBirth -gender -phone -email -__v"
    )
    .populate("lastMessage", "-seenBy -createdAt -conservation -__v");
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
      .populate(
        "leaders",
        "-password -createdAt -updatedAt -bio -dateOfBirth -gender -phone -email -__v"
      )
      .populate("lastMessage", "-seenBy -createdAt -conservation -__v");
  }

  async findConservationsByUserId(userId, type) {
    let filter = { members: { $in: [userId] } };

    if (type) filter.type = type;

    return await ConservationModel.find(filter)
      .populate(
        "members",
        "-password -createdAt -updatedAt -email -bio -dateOfBirth -gender -phone -__v"
      )
      .populate(
        "creator",
        "-password -createdAt -updatedAt -bio -dateOfBirth -gender -phone -email -__v"
      )
      .populate(
        "leaders",
        "-password -createdAt -updatedAt -bio -dateOfBirth -gender -phone -email -__v"
      )
      .populate("lastMessage", "-seenBy -createdAt -conservation -__v")
      .sort({ updatedAt: -1 });
  }

  async updateConservation(conservationId, data) {
    return await ConservationModel.findOneAndUpdate(
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

  async deleteConservationById(conservationId) {
    return await ConservationModel.deleteOne({ _id: new ObjectId(conservationId) });
  }
}

module.exports = new ConservationRepository();
