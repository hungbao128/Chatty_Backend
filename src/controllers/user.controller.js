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
}

module.exports = new UserController();