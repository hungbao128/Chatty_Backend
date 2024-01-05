const express = require('express');
const router = express.Router();
const authenticationRouter = require('./authentication.route');


router.use('/auth', authenticationRouter);

module.exports = router;