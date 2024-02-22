const AppError = require("./AppError");

class ServerErrorRequest extends AppError {
  constructor(message) {
    super(message, 500);
  }
}

module.exports = ServerErrorRequest;