const UserRepository = require("../repositories/User.repository");

class UserService {
    async findById(id){
        return await UserRepository.findById(id);
    }
}

module.exports = new UserService();