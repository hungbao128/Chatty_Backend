const {Router} = require('express');
const catchAsync = require('../utils/catchAsync');
const authentication = require('../middlewares/authentication.middleware');
const conservationController = require('../controllers/conservation.controller');

const router = Router();

router.post('/open/:id', catchAsync(authentication), catchAsync(conservationController.openConservation))
module.exports = router;