const asyncHandler = require('../utils/asyncHandler');
const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const User = require('../models/user');

const authMiddleware = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new ApiError(401, 'Authorization header missing or malformed');
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await User.findById(decoded._id).select('-password -refreshToken');

    if (!user) {
        throw new ApiError(401, 'User not found');
    }
    if (!user.isActive) {
        throw new ApiError(403, 'Account has been deactivated');
    }

    req.user = user; 
    next();
});

module.exports = authMiddleware;    