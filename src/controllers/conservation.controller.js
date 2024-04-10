const conservationService = require("./../services/conservation.service");

class ConservationController {
  async openConservation(req, res, next) {
    const { _id } = req.user;
    const { id } = req.params;
    const result = await conservationService.openConservation(_id, id);

    return res.status(200).json({
      status: "success",
      message: "Open conservation successfully.",
      data: result,
    });
  }

  async getUserConservations(req, res, next) {
    const { _id } = req.user;
    const result = await conservationService.getUserConservations(_id);

    return res.status(200).json({
      status: "success",
      message: "Get user conservations successfully.",
      data: result,
    });
  }

  async findConservationById(req, res, next) {
    const { _id } = req.user;
    const { id } = req.params;
    const result = await conservationService.findConservationById({
      conservationId: id,
      userId: _id,
    });

    return res.status(200).json({
      status: "success",
      message: "Get conservation successfully.",
      data: result,
    });
  }

  async createGroupConversation(req, res, next) {
    const { _id } = req.user;
    const { name, members, image } = req.body;
    const result = await conservationService.createGroupConservation({
      creatorId: _id,
      members,
      name,
      image,
    });

    return res.status(201).json({
      status: "success",
      message: "Create group conversation successfully.",
      data: result,
    });
  }

  async addMembersToGroupConversation(req, res, next) {
    const { _id } = req.user;
    const { id } = req.params;
    const { members } = req.body;
    const result = await conservationService.addMembersToGroupConversation({
      conservationId: id,
      members,
      userId: _id,
    });

    return res.status(200).json({
      status: "success",
      message: "Add members to group conversation successfully.",
      data: result,
    });
  }

  async removeMembersFromGroupConversation(req, res, next) {
    const { _id } = req.user;
    const { id } = req.params;
    const { members } = req.body;
    const result = await conservationService.removeMembersFromGroupConversation(
      { conservationId: id, members, userId: _id }
    );

    return res.status(200).json({
      status: "success",
      message: "Remove members from group conversation successfully.",
      data: result,
    });
  }
}

module.exports = new ConservationController();
