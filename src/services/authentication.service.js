const { sendEmail } = require('../configs/ses');
const BadRequest = require('../core/BadRequest');
const envConfig = require('../envConfig');
const UserHelper = require('../helpers/UserHelper');
const VerifyEmailTokenRepository = require('../repositories/VerifyEmailToken.repository');
const { generateRandomNumber } = require('../utils');
const { generateToken, verifyToken } = require('../utils/jwt');
const userRepository = require('./../repositories/User.repository');
const verifyEmailOtp = require('./../templates/verifyEmailOtp');

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

    async register({email, password, name, dateOfBirth, gender}){

        // 1. Check if email already exists
        const existingEmail = await userRepository.findByEmail(email);
        if(existingEmail){
            throw new BadRequest('This email is already in use.');
        }
        // 2. Create user
        const userObj = UserHelper.createUserObject({name, email, password, dateOfBirth, gender});
        const user = await userRepository.create(userObj);
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

    async login({email, password}){
        // 1. Check if user exists
        const user = await userRepository.findByEmail(email);
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

        user.password = newPassword;
        await user.save();
    }

    async sendVerifyEmailToken(email){
        if(!email){
            throw new BadRequest('Email is required.');
        }
        
        const existingEmail = await userRepository.findByEmail(email);

        if(existingEmail){
            throw new BadRequest('Email is already in used. Please choose another email.');
        }

        const otp = generateRandomNumber();
        await VerifyEmailTokenRepository.deleteMany({email});
        await VerifyEmailTokenRepository.create({email, otp});

        const html = verifyEmailOtp(otp);
        await sendEmail(email, 'Verify Email OTP', html);
    }

    async verifyEmailToken(email, otp){
        const result = await VerifyEmailTokenRepository.findOne({email, otp});
        if(!result){
            throw new BadRequest('OTP is invalid.');
        }
        
        await VerifyEmailTokenRepository.deleteMany({email}); 
    }
}

module.exports = new AuthenticationService();