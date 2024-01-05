const BadRequest = require('../core/BadRequest');
const envConfig = require('../envConfig');
const UserHelper = require('../helpers/UserHelper');
const { generateToken } = require('../utils/jwt');
const userRepository = require('./../repositories/User.repository');

class AuthenticationService{
    async generateAccessToken(userId){
        return await generateToken({
            payload: {id: userId},
            secretKey: envConfig.ACCESS_TOKEN_SECRET,
            options: {
                expiresIn: envConfig.ACCESS_TOKEN_EXPIRES_IN
            }
        })
    }

    async generateRefreshToken(userId){
        return await generateToken({
            payload: {id: userId},
            secretKey: envConfig.REFRESH_TOKEN_SECRET,
            options: {
                expiresIn: envConfig.REFRESH_TOKEN_EXPIRES_IN
            }
        })
    }

    async register({email, password, phone, name, dateOfBirth}){

        // 1. Check if email already exists
        const existingEmail = await userRepository.findByEmail(email);
        if(existingEmail){
            throw new BadRequest('This email is already in use.');
        }

        // 2. Check if phone already exists
        const existingPhone = await userRepository.findByPhone(phone);
        if(existingPhone){
            throw new BadRequest('This phone is already in use.');
        }

        // 3. Create user
        const userObj = UserHelper.createUserObject({name, email, password, phone, dateOfBirth});
        const user = await userRepository.create(userObj);
        // 4. Generate token
        const [access_token, refresh_token] = await Promise.all([
            this.generateAccessToken(user._id),
            this.generateRefreshToken(user._id)
        ]);
        // 5. Return token
        return {
            token: {
                access_token,
                refresh_token
            },
            user: UserHelper.generateUserResponse(user)
        }
    }
}

module.exports = new AuthenticationService();