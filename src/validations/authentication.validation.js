const Joi = require('joi');

const registerValidation = Joi.object({
    name: Joi.string().required().messages({
        "string.empty": "Please provide your name.",
        "any.required": "Please provide your name."
    }),

    email: Joi.string().email().required().messages({
        "string.empty": "Please provide your email address.",
        "string.email": "Please provide a valid email address.",
        "any.required": "Please provide your email address."
    }),

    password: Joi.string().min(6).required().messages({
        "string.empty": "Please provide your password.",
        "string.min": "Password should have a minimum length of 6",
        "any.required": "Please provide your password."
    }),

    phone: Joi.string().length(10).regex(/^[0-9]+$/).required().messages({
        "string.empty": "Please provide your phone number.",
        "any.required": "Please provide your phone number.",
        "string.length": "Phone number should have 10 digits.",
        "string.pattern.base": "Phone number should contain only number."
    }),

    dateOfBirth: Joi.date().required().messages({
        "any.required": "Please provide your date of birth.",
        "date.base": "Please provide a valid date of birth."
    }),

    gender: Joi.string().required().valid('male', 'female').messages({
        "any.valid": "Please provide a valid gender.",
        "any.required": "Please provide your gender"
    })
})

const loginValidation = Joi.object({
    phone: Joi.string().length(10).regex(/^[0-9]+$/).required().messages({
        "string.empty": "Please provide your phone number.",
        "any.required": "Please provide your phone number.",
        "string.length": "Phone number should have 10 digits.",
        "string.pattern.base": "Phone number should contain only number."
    }),

    password: Joi.string().min(6).required().messages({
        "string.empty": "Please provide your password.",
        "string.min": "Password should have a minimum length of 6",
        "any.required": "Please provide your password."
    }),
})

module.exports = {
    registerValidation,
    loginValidation
}