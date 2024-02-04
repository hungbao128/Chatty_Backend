const express = require('express');
const catchAsync = require('../utils/catchAsync');
const authentication = require('../middlewares/authentication.middleware');
const userFriendController = require('../controllers/userFriend.controller');

const router = express.Router();


router.post('/request/:id', catchAsync(authentication), catchAsync(userFriendController.requestAddFriend));

module.exports = router;