const Joi = require('joi');

const productFields = {
    name: Joi.string()
        .trim()
        .min(2)
        .max(100),

    description: Joi.string()
        .trim()
        .min(10)
        .max(2000),

    category: Joi.string()
        .valid('furniture', 'appliance'),

    subcategory: Joi.string()
        .valid(
            'bed',
            'sofa',
            'table',
            'fridge',
            'washing_machine',
            'tv'
        ),

    monthlyRentalPrice: Joi.number()
        .positive()
        .precision(2),

    securityDeposit: Joi.number()
        .min(0)
        .precision(2),

    minTenureMonths: Joi.number()
        .integer()
        .min(1),

    city: Joi.string()
        .trim()
        .min(2)
        .max(100),

    quantity: Joi.number()
        .integer()
        .min(0),
};

// Create Product
const createProductSchema = Joi.object({
    ...productFields,

    name: productFields.name.required(),
    description: productFields.description.required(),
    category: productFields.category.required(),
    monthlyRentalPrice: productFields.monthlyRentalPrice.required(),
    securityDeposit: productFields.securityDeposit.required(),
    minTenureMonths: productFields.minTenureMonths.required(),
    city: productFields.city.required(),
    quantity: productFields.quantity.required(),

    maxTenureMonths: Joi.number()
        .integer()
        .min(Joi.ref('minTenureMonths'))
        .required()
        .messages({
            'number.min':
                'maxTenureMonths must be greater than or equal to minTenureMonths',
        }),
});

// Update Product
const updateProductSchema = Joi.object({
    ...productFields,

    maxTenureMonths: Joi.number()
        .integer()
        .when('minTenureMonths', {
            is: Joi.exist(),
            then: Joi.number().min(Joi.ref('minTenureMonths')),
        })
        .messages({
            'number.min':
                'maxTenureMonths must be greater than or equal to minTenureMonths',
        }),
        
        isAvailableForRent: Joi.boolean()
}).min(1);

module.exports = {
    createProductSchema,
    updateProductSchema,
};