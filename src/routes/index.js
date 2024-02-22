const express = require('express');
const authenticationRouter = require('./authentication.route');
const userRouter = require('./user.route');
const userFriendRouter = require('./userFriend.route');
const conservationRouter = require('./conservation.route');

const router = express.Router();

router.use('/auth', authenticationRouter);
router.use('/users', userRouter);
router.use('/friends', userFriendRouter);
router.use('/conservations', conservationRouter);

module.exports = router;