const UserRepository = require("../repositories/User.repository");
const UserHelper= require('./../helpers/UserHelper');
const cloudinary = require('./../configs/cloudinary');
const BadRequest = require("../core/BadRequest");
const { generateRandomNumber } = require('./../utils');
const UserFriendRepository = require("../repositories/UserFriend.repository");
const ResetPasswordTokenRepository = require("../repositories/ResetPasswordToken.repository");
const { sendEmail } = require("../configs/ses");
const forgetPasswordOTPTemplate = require("../templates/forgetPasswordOtp");

class UserService {
    async findById(id){
        return await UserRepository.findById(id);
    }

    async updateUser(id, {name, dateOfBirth, gender}){
        const result = await UserRepository.update(id, {name, dateOfBirth, gender});
        return UserHelper.generateUserResponse(result.toObject());
    }

    async updateAvatar(id, file){    
        const result = await cloudinary.uploader.upload(file.path, {
            folder: 'chatty-app',
        });

        const data = await UserRepository.update(id, {avatar: result.url});
        return UserHelper.generateUserResponse(data.toObject());
    }

    async updateAvatarV2(id, fileData){    
        const result = await cloudinary.uploader.upload(fileData, {
            folder: 'chatty-app',
        });

        const data = await UserRepository.update(id, {avatar: result.url});
        return UserHelper.generateUserResponse(data.toObject());
    }

    async updateBackground(id, file){
        const result = await cloudinary.uploader.upload(file.path, {
            folder: 'chatty-app',
        });

        const data = await UserRepository.update(id, {background: result.url});
        return UserHelper.generateUserResponse(data.toObject());
    }

    async findByEmail(email, currentId){
        const user = await UserRepository.findUserByEmail(email, currentId);

        if(!user) throw new BadRequest('User not found');

        return UserHelper.generateUserResponse(user.toObject());
    }

    async findUserById(currentUserId, id){
        const [user, userFriend] = await Promise.all([UserRepository.findUserById(id), UserFriendRepository.findUserRelationship(currentUserId, id)]); ;

        if(!user) throw new BadRequest('User not found');

        const result = UserHelper.generateUserResponse(user.toObject());
        result.friend = userFriend;

        return result;
    }

    async sendForgetPasswordOTP(email){
        const user = await UserRepository.findByEmail(email);

        if(!user) throw new BadRequest('User not found');

        const otp = generateRandomNumber();

        await ResetPasswordTokenRepository.deleteMany({userId: user._id});
        await ResetPasswordTokenRepository.create({userId: user._id, otp});

        // send mail
        const html = forgetPasswordOTPTemplate(otp);
        await sendEmail(user.email, 'Forget password OTP', html);
    }

    async verifyForgetPasswordOTP(email, otp){
        const user = await UserRepository.findByEmail(email);

        if(!user) throw new BadRequest('User not found');

        const token = await ResetPasswordTokenRepository.findOne({userId: user._id, otp});

        if(!token) throw new BadRequest('Invalid OTP');

        await ResetPasswordTokenRepository.deleteMany({userId: user._id});
        return true;
    }

    async resetPassword(email, password){
        const user = await UserRepository.findByEmail(email);

        if(!user) throw new BadRequest('User not found');

        user.password = password;
        await user.save();

        return true;
    }
}

module.exports = new UserService();