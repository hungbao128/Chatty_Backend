const UserRepository = require("../repositories/User.repository");
const UserHelper= require('./../helpers/UserHelper');
const cloudinary = require('./../configs/cloudinary');

class UserService {
    async findById(id){
        return await UserRepository.findById(id);
    }

    async updateUser(id, {name, dateOfBirth}){
        const result = await UserRepository.update(id, {name, dateOfBirth});
        return UserHelper.generateUserResponse(result);
    }

    async updateAvatar(id, file){    
        const result = await cloudinary.uploader.upload(file.path);
        
        const data = await UserRepository.update(id, {avatar: result.url});
        return UserHelper.generateUserResponse(data.toObject());
    }
}

module.exports = new UserService();