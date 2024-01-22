const Joi = require("joi");

const updateUserValidation = Joi.object({
    name: Joi.string().required().messages({
        "string.empty": "Please provide your name.",
        "any.required": "Please provide your name."
    }),

    dateOfBirth: Joi.date().required().messages({
        "any.required": "Please provide your date of birth.",
        "date.base": "Please provide a valid date of birth."
    }),

    // gender: Joi.enum
})

module.exports = {
    updateUserValidation
}