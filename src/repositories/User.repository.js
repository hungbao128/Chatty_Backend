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

    async update(id, data){
        return await UserModel.findOneAndUpdate({_id: id}, data, {new: true});
    }

    async findUserByPhone(phone, currentId){
        return await UserModel.findOne({phone, _id: {$ne: currentId}})
    }
}

module.exports = new UserRepository();