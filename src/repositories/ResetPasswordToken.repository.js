const resetPasswordTokenModel = require("../models/ResetPasswordToken");

class ForgetPasswordTokenRepository{
    async create({userId, otp}){
        return await resetPasswordTokenModel.create({userId, otp});
    }

    async deleteMany({userId}){
        return await resetPasswordTokenModel.deleteMany({userId});
    }

    async findOne({userId, otp}){
        return await resetPasswordTokenModel.findOne({userId, otp});
    }
}

module.exports = new ForgetPasswordTokenRepository();