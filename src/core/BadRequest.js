const AppError = require("./AppError");

class BadRequest extends AppError{
    constructor(message){
        super(message, 400);
    }
}

module.exports = BadRequest;