const ApiError = require('../utils/ApiError');


const errorHandler = (err, req, res, next) => {
const statusCode = err instanceof ApiError ? err.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message:
      process.env.NODE_ENV === 'production'
        ? 'Internal Server Error'
        : err.message,
  });
};

module.exports = errorHandler;