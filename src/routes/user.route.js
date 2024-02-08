const express = require('express'); 
const catchAsync = require('../utils/catchAsync');
const authentication = require('../middlewares/authentication.middleware');
const validate = require('../middlewares/validation.middleware');
const userController = require('./../controllers/user.controller');
const { updateUserValidation } = require('../validations/user.validation');
const { uploadDisk } = require('../configs/multer');

const router = express.Router();

router.put('/updateMe', catchAsync(validate(updateUserValidation)), catchAsync(authentication), catchAsync(userController.update));
router.get('/getMe', catchAsync(authentication), catchAsync(userController.getMe));
router.get('/findByPhone/:phone', catchAsync(authentication), catchAsync(userController.findByPhone));
router.put('/updateAvatar', catchAsync(authentication), uploadDisk.single('avatar'), catchAsync(userController.updateAvatar));
router.put('/updateBackground', catchAsync(authentication), uploadDisk.single('background'), catchAsync(userController.updateBackground));

module.exports = router;