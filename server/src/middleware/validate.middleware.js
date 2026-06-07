const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

const validate = (schema) => {
    return asyncHandler(async (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: true,
            stripUnknown: true,
        });

        if (error) {
            throw new ApiError(
                400,
                error.details[0].message.replace(/"/g, '')
            );
        }

        req.body = value;

        next();
    });
};

module.exports = validate;