const {Router} = require('express');
const catchAsync = require('../utils/catchAsync');
const authentication = require('../middlewares/authentication.middleware');
const conservationController = require('../controllers/conservation.controller');
const messageController = require('./../controllers/message.controller');
const validate = require('../middlewares/validation.middleware');
const { sendTextMessageValidation } = require('../validations/message.validation');

const router = Router();

router.post('/open/:id', catchAsync(authentication), catchAsync(conservationController.openConservation));
router.get('/', catchAsync(authentication), catchAsync(conservationController.getUserConservations));
router.get('/:id/messages', catchAsync(authentication), catchAsync(messageController.getMessages));
router.post('/:id/messages/sendText', catchAsync(validate(sendTextMessageValidation)), catchAsync(authentication), catchAsync(messageController.sendMessage));

module.exports = router;