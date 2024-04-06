const { Router } = require("express");
const catchAsync = require("../utils/catchAsync");
const authentication = require("../middlewares/authentication.middleware");
const conservationController = require("../controllers/conservation.controller");
const messageController = require("./../controllers/message.controller");
const validate = require("../middlewares/validation.middleware");
const {
  sendTextMessageValidation,
} = require("../validations/message.validation");
const { uploadDisk } = require("../configs/multer");

const router = Router();

router.post(
  "/open/:id",
  catchAsync(authentication),
  catchAsync(conservationController.openConservation)
);
router.get(
  "/",
  catchAsync(authentication),
  catchAsync(conservationController.getUserConservations)
);
router.get(
  "/:id",
  catchAsync(authentication),
  catchAsync(conservationController.findConservationById)
);
router.get(
  "/:id/messages",
  catchAsync(authentication),
  catchAsync(messageController.getMessages)
);
router.post(
  "/:id/messages/sendText",
  catchAsync(validate(sendTextMessageValidation)),
  catchAsync(authentication),
  catchAsync(messageController.sendMessage)
);
router.post(
  "/:id/messages/sendFiles",
  catchAsync(authentication),
  uploadDisk.array("files"),
  catchAsync(messageController.sendFileMessage)
);
router.post(
  "/:id/messages/sendFilesV2",
  catchAsync(authentication),
  catchAsync(messageController.sendFileMessageV2)
);
router.post(
  "/:id/messages/replyText/:messageId",
  catchAsync(authentication),
  catchAsync(messageController.replyMessage)
);
router.post(
  "/:id/readMessages",
  catchAsync(authentication),
  catchAsync(messageController.setReadMessage)
);

module.exports = router;
