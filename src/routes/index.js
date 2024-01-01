const express = require('express');
const User = require('../models/mysql/user.model');

const router = express.Router();


router.get('/', (req, res) => {
    res.status(202).json({
        'message': 'Hello world'
    });
})

module.exports = router;