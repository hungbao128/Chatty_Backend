const BadRequest = require("../core/BadRequest");
const envConfig = require("../envConfig");
const UserHelper = require("../helpers/UserHelper");
const userService = require("../services/user.service");
const { verifyToken } = require("../utils/jwt");

const authentication = async(req, res, next) => {
    try {
        if(!req.headers.authorization){
            throw new BadRequest('Invalid token.');
        }

        const token = req.headers.authorization.split(' ')[1];

        const decoded = await verifyToken({token, secretKey: envConfig.ACCESS_TOKEN_SECRET});

        const user = await userService.findById(decoded.id);
        if(!user){
            throw new BadRequest('Invalid token.');
        }
        req.user = UserHelper.generateUserResponse(user.toObject());
        next();
    } catch (error) {
        if(error.name === 'TokenExpiredError'){
            return next(new BadRequest('Token expired.'));
        }

        next(error);
    }
}

module.exports = authentication;