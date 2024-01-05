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
}

module.exports = new AuthenticationController();