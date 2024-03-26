const resetPasswordTokenModel = require("../models/ResetPasswordToken");

class ForgetPasswordTokenRepository{
    async create({userId, otp}){
        return await resetPasswordTokenModel.create({userId, otp});
    }

    async deleteMany({userId}){
        return await resetPasswordTokenModel.deleteMany({userId});
    }
}

module.exports = new ForgetPasswordTokenRepository();