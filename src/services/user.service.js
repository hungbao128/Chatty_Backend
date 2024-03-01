const UserRepository = require("../repositories/User.repository");
const UserHelper= require('./../helpers/UserHelper');
const cloudinary = require('./../configs/cloudinary');
const BadRequest = require("../core/BadRequest");
const UserFriendRepository = require("../repositories/UserFriend.repository");

class UserService {
    async findById(id){
        return await UserRepository.findById(id);
    }

    async updateUser(id, {name, dateOfBirth}){
        const result = await UserRepository.update(id, {name, dateOfBirth});
        return UserHelper.generateUserResponse(result);
    }

    async updateAvatar(id, file){    
        const result = await cloudinary.uploader.upload(file.path, {
            folder: 'chatty-app',
        });

        const data = await UserRepository.update(id, {avatar: result.url});
        return UserHelper.generateUserResponse(data.toObject());
    }

    async updateBackground(id, file){
        const result = await cloudinary.uploader.upload(file.path, {
            folder: 'chatty-app',
        });

        const data = await UserRepository.update(id, {background: result.url});
        return UserHelper.generateUserResponse(data.toObject());
    }

    async findByPhone(phone, currentId){
        const user = await UserRepository.findUserByPhone(phone, currentId);

        if(!user) throw new BadRequest('User not found');

        return UserHelper.generateUserResponse(user.toObject());
    }

    async findUserById(currentUserId, id){
        const [user, userFriend] = await Promise.all([UserRepository.findUserById(id), UserFriendRepository.findUserRelationship(currentUserId, id)]); ;

        if(!user) throw new BadRequest('User not found');

        const result = UserHelper.generateUserResponse(user.toObject());
        result.friend = userFriend;

        return result;
    }
}

module.exports = new UserService();