const Joi = require('joi');

const createOrderSchema = Joi.object({
    products: Joi.array().items(
        Joi.object({
            productId: Joi.string().required(),
            name: Joi.string().required(),
            price: Joi.number().min(0).required(),
            quantity: Joi.number().integer().min(1).required()
        })
    ).min(1).required().messages({
        'array.min': 'At least one product is required',
        'any.required': 'Products are required'
    })
});

const updateOrderStatusSchema = Joi.object({
    status: Joi.string()
        .valid('processing', 'shipped', 'delivered', 'cancelled')
        .required()
        .messages({
            'any.only': 'Invalid status value',
            'any.required': 'Status is required'
        })
});

module.exports = { createOrderSchema, updateOrderStatusSchema };