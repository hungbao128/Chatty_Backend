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

const resetPasswordValidation = Joi.object({
    password: Joi.string().min(6).required().messages({
        "string.empty": "Please provide your password.",
        "string.min": "Password should have a minimum length of 6",
        "any.required": "Please provide your password."
    }),
})

module.exports = {
    updateUserValidation,
    resetPasswordValidation
}