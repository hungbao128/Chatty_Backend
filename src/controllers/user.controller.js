const userService = require("../services/user.service");

class UserController{

    async update(req, res, next){
        const {name, dateOfBirth, gender} = req.body;
        const result = await userService.updateUser(req.user._id, {name, dateOfBirth, gender});

        return res.status(200).json({
            message: 'Update user successfully.',
            data: result
        });
    }

    async getMe(req, res, next){
        const {user} = req;

        return res.status(200).json({
            message: 'Get user successfully.',
            data: user
        });
    }

    async updateAvatar(req, res, next){
        const {user} = req;
        const {file} = req;

        const result = await userService.updateAvatar(user._id, file);
        return res.status(200).json({
            message: 'Update avatar successfully.',
            data: result
        })
    }

    async updateAvatarV2(req, res, next){
        const {user} = req;
        const {avatar} = req.body;
        const result = await userService.updateAvatarV2(user._id, avatar);
        return res.status(200).json({
            message: 'Update avatar successfully.',
            data: result
        })
    }

    async updateBackground(req, res, next){
        const {user} = req;
        const {file} = req;

        const result = await userService.updateBackground(user._id, file);
        return res.status(200).json({
            message: 'Update background successfully.',
            data: result
        })
    }

    async findByPhone(req, res, next){
        const {phone} = req.params;

        const result = await userService.findByPhone(phone, req.user._id);

        return res.status(200).json({
            message: 'Find user by phone successfully.',
            data: result
        });
    }

    async findUserById(req, res, next){
        return res.status(200).json({
            message: 'Find user successfully.',
            data: await userService.findUserById(req.user._id, req.params.id)
        });
    }

    async sendForgetPasswordOTP(req, res, next){
        const {email} = req.body;
        await userService.sendForgetPasswordOTP(email);

        return res.status(200).json({
            status: 'success',
            message: 'Please check your email to get OTP.',
        });
    }
}

module.exports = new UserController();