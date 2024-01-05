const UserModel = require("../models/User.model");

class UserRepository{
    async create(user){
        return await UserModel.create(user);
    }

    async findByEmail(email){
        return await UserModel.findOne({email});
    }

    async findByPhone(phone){
        return await UserModel.findOne({phone});
    }

    async findById(id){
        return await UserModel.findById(id);
    }
}

module.exports = new UserRepository();