const express = require('express');
const catchAsync = require('../utils/catchAsync');
const authentication = require('../middlewares/authentication.middleware');
const userFriendController = require('../controllers/userFriend.controller');

const router = express.Router();


router.post('/request/:id', catchAsync(authentication), catchAsync(userFriendController.requestAddFriend));
router.post('/accept/:id', catchAsync(authentication), catchAsync(userFriendController.acceptFriendRequest));
router.post('/reject/:id', catchAsync(authentication), catchAsync(userFriendController.rejectFriendRequest));
router.post('/cancel/:id', catchAsync(authentication), catchAsync(userFriendController.rejectFriendRequest));
router.post('/remove/:id', catchAsync(authentication), catchAsync(userFriendController.removeFriend));
router.get('/', catchAsync(authentication), catchAsync(userFriendController.getCurrentUserFriends));
router.get('/requests', catchAsync(authentication), catchAsync(userFriendController.getFriendRequests));

module.exports = router;