const express = require('express'); 
const catchAsync = require('../utils/catchAsync');
const authentication = require('../middlewares/authentication.middleware');
const validate = require('../middlewares/validation.middleware');
const userController = require('./../controllers/user.controller');
const { updateUserValidation, resetPasswordValidation } = require('../validations/user.validation');
const { uploadDisk } = require('../configs/multer');

const router = express.Router();

router.put('/updateMe', catchAsync(validate(updateUserValidation)), catchAsync(authentication), catchAsync(userController.update));
router.get('/getMe', catchAsync(authentication), catchAsync(userController.getMe));
router.get('/findByPhone/:phone', catchAsync(authentication), catchAsync(userController.findByPhone));
router.put('/updateAvatar', catchAsync(authentication), uploadDisk.single('avatar'), catchAsync(userController.updateAvatar));
router.put('/updateAvatarV2', catchAsync(authentication), catchAsync(userController.updateAvatarV2));
router.put('/updateBackground', catchAsync(authentication), uploadDisk.single('background'), catchAsync(userController.updateBackground));
router.get('/:id', catchAsync(authentication), catchAsync(userController.findUserById));
router.post('/forgetPassword', catchAsync(userController.sendForgetPasswordOTP));
router.post('/verifyForgetPasswordOTP', catchAsync(userController.verifyForgetPasswordOTP));
router.post('/resetPassword', catchAsync(validate(resetPasswordValidation)), catchAsync(userController.resetPassword));

module.exports = router;