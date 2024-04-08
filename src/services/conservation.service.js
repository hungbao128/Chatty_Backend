const conservationRepository = require("../repositories/Conservation.repository");
const userRepository = require("../repositories/User.repository");
const ServerErrorRequest = require("../core/ServerErrorRequest");
const BadRequest = require("../core/BadRequest");
const ConservationHelper = require("../helpers/ConservationHelper");
const cloudinary = require("../configs/cloudinary");

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

  async getUserConservations(userId) {
    const conservations =
      await conservationRepository.findConservationsByUserId(userId);
    const result = conservations.map((el) =>
      ConservationHelper.generateConservation(el, userId)
    );
    return result;
  }

  async findConservationById({conservationId, userId}) {
    const conservation = await conservationRepository.findConservationById(conservationId);
    if (!conservation) throw new BadRequest("Conservation not found.");

    let isUserInConservation = false;
    conservation.members.forEach(member => {
      // console.log(member._id.toString(), userId.toString());
      if (member._id.toString() === userId.toString()) isUserInConservation = true;
    })

    if(!isUserInConservation) throw new BadRequest("You are not in this conservation.");
    
    return ConservationHelper.generateConservation(conservation, userId);
  }

  async createGroupConservation({creatorId, members, name, image}){
    if(!members.length) throw new BadRequest("Members must not be empty.");

    members.push(creatorId);
    let imageUrl = '';
    if(image){
      imageUrl = await cloudinary.uploader.upload(image, {
        folder: 'chat-app',
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
}

module.exports = new ConservationService();
