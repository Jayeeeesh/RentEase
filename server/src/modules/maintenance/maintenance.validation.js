const Joi = require('joi');

const createRequestSchema = Joi.object({
    rentalId: Joi.string().required().messages({
        'string.empty': 'Rental ID is required',
        'any.required': 'Rental ID is required'
    }),
    description: Joi.string().trim().min(10).max(500).required().messages({
        'string.empty': 'Description is required',
        'string.min': 'Description must be at least 10 characters',
        'string.max': 'Description cannot exceed 500 characters',
        'any.required': 'Description is required'
    }),
    priority: Joi.string().valid('low', 'medium', 'high').default('medium')
});

const updateRequestSchema = Joi.object({
    status: Joi.string().valid('in-progress', 'resolved').required().messages({
        'any.only': 'Status must be in-progress or resolved',
        'any.required': 'Status is required'
    }),
    adminNote: Joi.string().trim().max(300).optional()
});

module.exports = { createRequestSchema, updateRequestSchema };