const UserRepository = require("../repositories/User.repository");
const UserHelper= require('./../helpers/UserHelper');

class UserService {
    async findById(id){
        return await UserRepository.findById(id);
    }

    async updateUser(id, {name, dateOfBirth}){
        const result = await UserRepository.update(id, {name, dateOfBirth});
        return UserHelper.generateUserResponse(result);
    }
}

module.exports = new UserService();