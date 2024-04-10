const conservationRepository = require("../repositories/Conservation.repository");
const userRepository = require("../repositories/User.repository");
const ServerErrorRequest = require("../core/ServerErrorRequest");
const BadRequest = require("../core/BadRequest");
const ConservationHelper = require("../helpers/ConservationHelper");
const cloudinary = require("../configs/cloudinary");
const MessageModel = require("../models/Message.model");
const { socketIOObject } = require("./../sockets/conversation.socket");
const UserRepository = require("../repositories/User.repository");
const MessageHelper = require("../helpers/MessageHelper");
const messageService = require("./message.service");

class ConservationService {
  async conservationPopulate(conservation) {
    return conservation
      .populate(
        "members",
        "-password -createdAt -updatedAt -email -bio -dateOfBirth -gender -phone -__v"
      )
      .then((result) =>
        result.populate(
          "creator",
          "-password -createdAt -updatedAt -bio -dateOfBirth -gender -phone -email -__v"
        )
      )
      .then((result) =>
        result.populate(
          "leaders",
          "-password -createdAt -updatedAt -bio -dateOfBirth -gender -phone -email -__v"
        )
      )
      .then((result) =>
        result.populate("lastMessage", "-seenBy -createdAt -conservation -__v")
      );
  }

  async openConservation(creatorId, userId) {
    if (creatorId == userId)
      throw new BadRequest("Cannot open conservation with yourself.");

    const existingConservation =
      await conservationRepository.findPrivateConservationByMembers(
        creatorId,
        userId
      );

    if (existingConservation) {
      existingConservation.readStatus.set(creatorId, true);
      await existingConservation.save();

      return ConservationHelper.generateConservation(
        existingConservation,
        creatorId
      );
    }
    const existingUser = await userRepository.findUserById(userId);
    if (!existingUser) throw new BadRequest("User not found.");

    const conservation = await conservationRepository.create({
      creatorId,
      userId,
    });

    if (!conservation)
      throw new ServerErrorRequest("Cannot create conservation.");

    return ConservationHelper.generateConservation(
      await this.conservationPopulate(conservation),
      creatorId
    );
  }

  async getUserConservations(userId, type = '') {
    console.log(`type:: ${type}`);
    const conservations =
      await conservationRepository.findConservationsByUserId(userId, type);
      
    const result = conservations.map((el) =>
      ConservationHelper.generateConservation(el, userId)
    );
    return result;
  }

  async findConservationById({ conservationId, userId }) {
    const conservation = await conservationRepository.findConservationById(
      conservationId
    );
    if (!conservation) throw new BadRequest("Conservation not found.");

    let isUserInConservation = false;
    conservation.members.forEach((member) => {
      // console.log(member._id.toString(), userId.toString());
      if (member._id.toString() === userId.toString())
        isUserInConservation = true;
    });

    if (!isUserInConservation)
      throw new BadRequest("You are not in this conservation.");

    return ConservationHelper.generateConservation(conservation, userId);
  }

  async createGroupConservation({ creatorId, members, name, image }) {
    if (!members.length) throw new BadRequest("Members must not be empty.");

    members.push(creatorId);
    let imageUrl = "";
    if (image) {
      imageUrl = await cloudinary.uploader.upload(image, {
        folder: "chat-app",
      });
    }

    const conservation = await conservationRepository.createGroupConservation({
      creatorId,
      members,
      name,
      image: imageUrl.secure_url,
    });

    if (!conservation)
      throw new ServerErrorRequest("Cannot create conservation.");

    return ConservationHelper.generateConservation(
      await this.conservationPopulate(conservation),
      creatorId
    );
  }

  async addMembersToGroupConversation({ conservationId, userId, members }) {
    const conservation = await conservationRepository.findConservationById(
      conservationId
    );
    if (!conservation) throw new BadRequest("Conservation not found.");

    let isInConservation = false;
    conservation.members.forEach((member) => {
      if (member._id.toString() === userId.toString()) isInConservation = true;
    });

    if (!isInConservation)
      throw new BadRequest("You are not in this conservation.");

    members.forEach((member) => {
      let isMemberInConservation = false;

      conservation.members.forEach((m) => {
        if (m._id.toString() === member.toString()) {
          isMemberInConservation = true;
        }
      });

      if (isMemberInConservation)
        throw new BadRequest("Member is already in this conservation.");

      conservation.members.push(member);
      conservation.readStatus.set(member, true);
    });

    const memberNames = await UserRepository.findUserByIds(members);

    const notificationMessages = members.map(async (member, idx) => {
      const message = new MessageModel({
        conservation: conservationId,
        sender: member,
        content: `${memberNames[idx].name} was added to this conversation.`,
        type: "notification",
      });

      return await message.save();
    });

    const messages = await Promise.all(notificationMessages);
    const messagePromises = messages.map(async (message) => {
      return await messageService.populateMessage(message);
    });

    const messes = await Promise.all(messagePromises);
    const messagesResult = messes.map((message) =>
      MessageHelper.generateMessage(message, userId)
    );

    await conservation.save();

    socketIOObject.value.emit("message:notification", {
      conservationId,
      messages: messagesResult,
    });

    return ConservationHelper.generateConservation(
      await this.conservationPopulate(conservation),
      userId
    );
  }

  async removeMembersFromGroupConversation({
    conservationId,
    userId,
    members,
  }) {
    const conservation = await conservationRepository.findConservationById(
      conservationId
    );

    if (!conservation) throw new BadRequest("Conservation not found.");

    let isLeader = false;
    conservation.leaders.forEach((leader) => {
      if (leader._id.toString() === userId.toString()) isLeader = true;
    });

    if (!isLeader)
      throw new BadRequest("You cannot remove members from this group.");

    let isInConservation = false;
    conservation.members.forEach((member) => {
      if (member._id.toString() === userId.toString()) isInConservation = true;
    });

    if (!isInConservation)
      throw new BadRequest("You are not in this conservation.");

    members.forEach((member) => {
      if (member.toString() === userId.toString())
        throw new BadRequest("Cannot remove yourself from this conversation.");

      let isMemberInConservation = false;

      conservation.members.forEach((m) => {
        if (m._id.toString() === member.toString()) {
          isMemberInConservation = true;
        }
      });

      if (!isMemberInConservation)
        throw new BadRequest("Member is not in this conservation.");

      conservation.members = conservation.members.filter(
        (m) => m._id.toString() !== member.toString()
      );
      conservation.readStatus.delete(member);
    });

    const memberNames = await UserRepository.findUserByIds(members);

    const notificationMessages = members.map(async (member, idx) => {
      const message = new MessageModel({
        conservation: conservationId,
        sender: member,
        content: `${memberNames[idx].name} was removed to this conversation.`,
        type: "notification",
      });

      return await message.save();
    });

    const messages = await Promise.all(notificationMessages);
    const messagePromises = messages.map(async (message) => {
      return await messageService.populateMessage(message);
    });

    const messes = await Promise.all(messagePromises);
    const messagesResult = messes.map((message) =>
      MessageHelper.generateMessage(message, userId)
    );
    await conservation.save();

    socketIOObject.value.emit("message:notification", {
      conservationId,
      messages: messagesResult,
    });
    return ConservationHelper.generateConservation(
      await this.conservationPopulate(conservation),
      userId
    );
  }
}

module.exports = new ConservationService();
