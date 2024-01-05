const AppError = require("./AppError");

class ValidationError extends AppError{
    constructor(message){
        super(message, 422);
    }
}

module.exports = ValidationError;