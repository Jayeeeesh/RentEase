const Joi = require("joi");

const rentalSchema = Joi.object({
  productId: Joi.string()
    .hex()
    .length(24)
    .required()
    .messages({
      "string.empty": "Product ID is required",
      "string.hex": "Invalid Product ID",
      "string.length": "Invalid Product ID",
      "any.required": "Product ID is required",
    }),

  tenureMonths: Joi.number()
    .integer()
    .min(1)
    .max(60)
    .required()
    .messages({
      "number.base": "Tenure must be a number",
      "number.integer": "Tenure must be an integer",
      "number.min": "Tenure must be at least 1 month",
      "number.max": "Tenure cannot exceed 60 months",
      "any.required": "Tenure is required",
    }),

  startDate: Joi.date()
    .iso()
    .min("now")
    .required()
    .messages({
      "date.base": "Invalid start date",
      "date.format": "Start date must be in ISO format",
      "date.min": "Start date cannot be in the past",
      "any.required": "Start date is required",
    }),

  deliveryAddress: Joi.object({
    street: Joi.string()
      .trim()
      .min(3)
      .max(100)
      .required()
      .messages({
        "string.empty": "Street is required",
        "string.min": "Street must be at least 3 characters",
        "string.max": "Street cannot exceed 100 characters",
      }),

    city: Joi.string()
      .trim()
      .min(2)
      .max(50)
      .required()
      .messages({
        "string.empty": "City is required",
      }),

    state: Joi.string()
      .trim()
      .min(2)
      .max(50)
      .required()
      .messages({
        "string.empty": "State is required",
      }),

    zipCode: Joi.string()
      .pattern(/^[1-9][0-9]{5}$/)
      .required()
      .messages({
        "string.empty": "ZIP code is required",
        "string.pattern.base": "Invalid ZIP code",
      }),
  })
    .required()
    .messages({
      "any.required": "Delivery address is required",
    }),
})
  .options({
    abortEarly: false,
    stripUnknown: true,
  });

module.exports = {
  rentalSchema,
};