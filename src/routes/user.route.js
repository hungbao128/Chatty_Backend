const express = require('express'); 
const catchAsync = require('../utils/catchAsync');
const authentication = require('../middlewares/authentication.middleware');
const validate = require('../middlewares/validation.middleware');
const userController = require('./../controllers/user.controller');
const { updateUserValidation } = require('../validations/user.validation');

const router = express.Router();

router.put('/updateMe', catchAsync(validate(updateUserValidation)), catchAsync(authentication), catchAsync(userController.update));

module.exports = router;