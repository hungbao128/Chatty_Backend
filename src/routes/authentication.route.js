const express = require('express');
const validate = require('../middlewares/validation.middleware');
const catchAsync = require('./../utils/catchAsync');
const { registerValidation } = require('../validations/authentication.validate');
const authenticationController = require('../controllers/authentication.controller');

const router = express.Router();

router.post('/register', catchAsync(validate(registerValidation)), catchAsync(authenticationController.register));

module.exports = router;