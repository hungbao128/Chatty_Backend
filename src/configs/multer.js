const multer = require("multer");

const uploadDisk = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}- ${file.originalname}`);
    },
  }),

  limits: {
    fileSize: 1024 * 1024 * 10,
  },
});

module.exports = { uploadDisk };
