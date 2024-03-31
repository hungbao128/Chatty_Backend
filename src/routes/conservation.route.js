const {Router} = require('express');
const catchAsync = require('../utils/catchAsync');
const authentication = require('../middlewares/authentication.middleware');
const conservationController = require('../controllers/conservation.controller');
const messageController = require('./../controllers/message.controller');

const router = Router();

router.post('/open/:id', catchAsync(authentication), catchAsync(conservationController.openConservation));
router.get('/', catchAsync(authentication), catchAsync(conservationController.getUserConservations));
router.get('/:id/messages', catchAsync(authentication), catchAsync(messageController.getMessages));
router.post('/:id/messages', catchAsync(authentication), catchAsync(messageController.sendMessage));

module.exports = router;