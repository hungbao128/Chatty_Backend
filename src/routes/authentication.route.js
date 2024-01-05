const express = require('express');
const validate = require('../middlewares/validation.middleware');
const catchAsync = require('./../utils/catchAsync');
const { registerValidation, loginValidation } = require('../validations/authentication.validate');
const authenticationController = require('../controllers/authentication.controller');

const router = express.Router();

router.post('/register', catchAsync(validate(registerValidation)), catchAsync(authenticationController.register));
router.post('/login', catchAsync(validate(loginValidation)), catchAsync(authenticationController.login));

module.exports = router;