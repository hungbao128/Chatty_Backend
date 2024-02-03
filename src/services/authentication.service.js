const BadRequest = require('../core/BadRequest');
const envConfig = require('../envConfig');
const UserHelper = require('../helpers/UserHelper');
const { hashPassword } = require('../utils/bcrypt');
const { generateToken, verifyToken } = require('../utils/jwt');
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

    async verifyRefreshToken(token){
        return await verifyToken({
            token,
            secretKey: envConfig.REFRESH_TOKEN_SECRET
        });
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
            user: UserHelper.generateUserResponse(user.toObject())
        }
    }

    async login({phone, password}){
        // 1. Check if user exists
        const user = await userRepository.findByPhone(phone);
        if(!user){
            throw new BadRequest('Bad credentials.');
        }

        // 2. Compare password
        const isPasswordValid = await user.comparePassword(password);
        if(!isPasswordValid){
            throw new BadRequest('Bad credentials.');
        }

        // 3. Generate token
        const [access_token, refresh_token] = await Promise.all([
            this.generateAccessToken(user._id),
            this.generateRefreshToken(user._id)
        ]);
        // 4. Return token
        return {
            token: {
                access_token,
                refresh_token
            },
            user: UserHelper.generateUserResponse(user.toObject())
        }
    }

    async refreshToken({token}){
        // 1. Verify refresh token
        const decoded = await this.verifyRefreshToken(token);
        // 2. Generate access token, refresh token
        const [access_token, refresh_token] = await Promise.all([
            this.generateAccessToken(decoded.id),
            this.generateRefreshToken(decoded.id)
        ]); 
        // 3. Return token
        return {
            token: {
                access_token,
                refresh_token
            }
        }
    }

    async changePassword({userId, oldPassword, newPassword}){
        const user = await userRepository.findById(userId);
        if(!user){
            throw new BadRequest('User not found.');
        }

        const isPasswordValid = await user.comparePassword(oldPassword);

        if(!isPasswordValid){
            throw new BadRequest('Old password is incorrect.');
        }

        user.password = hashPassword(newPassword);
        await user.save();
    }
}

module.exports = new AuthenticationService();