const UserModel = require("../models/User.model");

class UserRepository{
    async create(user){
        return await UserModel.create(user);
    }
}

module.exports = new UserRepository();