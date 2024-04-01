const Joi = require("joi");

const sendTextMessageValidation  = Joi.object({
    content: Joi.string().required().messages({
        "string.empty": "Please provide your message.",
        "any.required": "Please provide your message."
    })
})

module.exports = {
    sendTextMessageValidation
}