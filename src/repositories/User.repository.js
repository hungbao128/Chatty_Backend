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

    async findUserByEmail(email, currentId){
        return await UserModel.findOne({email, _id: {$ne: currentId}})
    }
    
    async findUserById(id){
        return await UserModel.findById(id);
    }

    async findUserByIds(ids){
        return await UserModel.find({_id: {$in: ids}});
    }
}

module.exports = new UserRepository();