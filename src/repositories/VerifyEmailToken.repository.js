const VerifyEmailTokenModel = require('./../models/VerifyEmailToken.model');

class VerifyEmailTokenRepository{
    async create({email, otp}){
        return await VerifyEmailTokenModel.create({email, otp});
    }

    async deleteMany({email}){
        return await VerifyEmailTokenModel.deleteMany({email});
    }

    async findOne({email, otp}){
        return await VerifyEmailTokenModel.findOne({email, otp});
    }
}

module.exports = new VerifyEmailTokenRepository();