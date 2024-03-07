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

    gender: Joi.string().required().valid('male', 'female').messages({
        "any.required": "Please provide your gender",
        "any.only": "Please provide a valid gender"
    })
})

module.exports = {
    updateUserValidation
}