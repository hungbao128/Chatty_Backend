const express = require('express');
const catchAsync = require('../utils/catchAsync');
const authentication = require("../middlewares/authentication.middleware");
const messageController = require('./../controllers/message.controller');

const router = express.Router();

router.delete('/:id', catchAsync(authentication), catchAsync(messageController.deleteMessage));

module.exports = router;