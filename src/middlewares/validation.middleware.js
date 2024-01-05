const ValidationError  = require("../core/ValidationError");


const validate = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.validateAsync(req.body);
            return next();
        } catch (error) {
            throw new ValidationError(error.message);
        }
    }
}

module.exports = validate;