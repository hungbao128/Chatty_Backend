const express = require('express');
const authenticationRouter = require('./authentication.route');
const userRouter = require('./user.route');

const router = express.Router();

router.use('/auth', authenticationRouter);
router.use('/users', userRouter);

module.exports = router;