const userService = require("../services/user.service");

class UserController{

    async update(req, res, next){
        const {name, dateOfBirth} = req.body;
        const result = await userService.updateUser(req.user.id, {name, dateOfBirth});

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
}

module.exports = new UserController();