const Joi = require('joi');

const updateProfileSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(50),

    phone: Joi.string()
        .trim()
        .pattern(/^[6-9]\d{9}$/)
        .messages({
            'string.pattern.base': 'Invalid phone number',
        }),

    avatar: Joi.string()
        .uri()
        .messages({
            'string.uri': 'Avatar must be a valid URL',
        }),

    address: Joi.object({
        street: Joi.string().trim().min(3).max(100),
        city: Joi.string().trim().min(2).max(50),
        state: Joi.string().trim().min(2).max(50),
        pincode: Joi.string().pattern(/^[1-9][0-9]{5}$/).messages({
            'string.pattern.base': 'Invalid pincode',
        }),
    }),
})
.min(1)
.messages({
    'object.min': 'At least one field must be provided for update',
});

const changePasswordSchema = Joi.object({
    oldPassword: Joi.string()
        .required()
        .messages({
            'string.empty': 'Old password is required',
            'any.required': 'Old password is required',
        }),

    newPassword: Joi.string()
        .min(8)
        .max(128)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
        .invalid(Joi.ref('oldPassword'))
        .required()
        .messages({
            'string.empty': 'New password is required',
            'string.min': 'Password must be at least 8 characters',
            'string.max': 'Password cannot exceed 128 characters',
            'string.pattern.base':
                'Password must contain uppercase, lowercase and a number',
            'any.invalid':
                'New password must be different from old password',
            'any.required': 'New password is required',
        }),
});

module.exports = {
    updateProfileSchema,
    changePasswordSchema,
};