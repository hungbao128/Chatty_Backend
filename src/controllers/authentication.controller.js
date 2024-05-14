const AuthenticationService = require('./../services/authentication.service');

class AuthenticationController {
    async register(req, res, next){
        const result = await AuthenticationService.register({...req.body});

        res.status(201).json({
            status: 'success',
            message: 'Register successfully',
            data: result
        });
    }

    async login(req, res, next){
        const result = await AuthenticationService.login({...req.body});

        res.status(200).json({
            status: 'success',
            message: 'Login successfully',
            data: result
        });
    }

    async refreshToken(req, res, next){
        const result = await AuthenticationService.refreshToken({...req.body});

        res.status(200).json({
            status: 'success',
            message: 'Generate token successfully',
            data: result
        });
    }

    async changePassword(req, res, next){
        const {user} = req;
        const {oldPassword, newPassword} = req.body;
        const result = await AuthenticationService.changePassword({userId: user._id, oldPassword, newPassword});

        return res.status(200).json({
            status: "success",
            message: 'Change password successfully.',
            data: result
        });
    }

    async sendVerifyEmailOtp(req, res, next){
        const {email} = req.body;
        const result = await AuthenticationService.sendVerifyEmailToken(email);

        res.status(200).json({
            status: 'success',
            message: 'Send otp successfully. Please check your email to verify.',
            data: result
        });
    }

    async verifyEmailOtp(req, res, next){
        const {email, otp} = req.body;
        const result = await AuthenticationService.verifyEmailToken(email, otp);

        res.status(200).json({
            status: 'success',
            message: 'Verify otp successfully.',
            data: result
        });
    }
}

module.exports = new AuthenticationController();