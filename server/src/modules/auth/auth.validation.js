const Joi = require('joi');

const registerSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .required(),

    email: Joi.string()
        .trim()
        .lowercase()
        .email()
        .required(),

    password: Joi.string()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
        .required()
        .messages({
            'string.pattern.base':
                'Password must contain uppercase, lowercase and a number',
        }),
});

const loginSchema = Joi.object({
    email: Joi.string()
        .trim()
        .lowercase()
        .email()
        .required(),

    password: Joi.string()
        .required(),
});

module.exports = {
    registerSchema,
    loginSchema,
};