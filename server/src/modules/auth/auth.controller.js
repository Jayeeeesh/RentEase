// Import utilities and dependencies
const asyncHandler = require('../../utils/asyncHandler'); // Wraps async functions to handle errors
const ApiError = require('../../utils/ApiError'); // Custom error class for consistent error responses
const ApiResponse = require('../../utils/ApiResponse'); // Standardized API response format
const User = require('../../models/user'); // User database model
const bcrypt = require('bcryptjs'); // Password hashing library
const jwt = require('jsonwebtoken'); // JSON Web Token library for authentication


/**
 * @desc Register a new user account
 * @param {Object} req - Express request object with name, email, password in body
 * @param {Object} res - Express response object
 * @return {Object} User data with success message (status 201)
 * @throw {ApiError} 400 - Validation errors, 409 - Email already exists
 */

const register = asyncHandler(async (req, res) => {
    // Extract user credentials from request body
    const { name, email, password } = req.body;

    // Validate required fields (trim() removes whitespace, check if empty)
    if (!name?.trim() || !email?.trim() || !password) {
        throw new ApiError(400, 'All fields are required');
    }

    // Enforce minimum password length for security
    if (password.length < 8) {
        throw new ApiError(400, 'Password must be at least 8 characters');
    }

    // Validate password strength: must contain uppercase, lowercase, and number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(password)) {
        throw new ApiError(
            400,
            'Password must contain uppercase, lowercase and a number'
        );
    }

    // Validate email format using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
        throw new ApiError(400, 'Please provide a valid email address');
    }

    // Normalize inputs: convert email to lowercase and trim whitespace to ensure consistency
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedName = name.trim();


    // Check if email already exists in database to prevent duplicate accounts
    const existingUser = await User.exists({ email: normalizedEmail });
    if (existingUser) {
        throw new ApiError(409, 'Email already in use');
    }

    // Hash password using bcrypt with 12 salt rounds for enhanced security
    // Higher rounds = slower but more secure against brute force attacks
    const hashedPassword = await bcrypt.hash(password, 12);


    // Create new user in database with normalized, validated data
    const user = await User.create({
        name: normalizedName,
        email: normalizedEmail,
        password: hashedPassword,
    });

    // Remove sensitive fields (password, refreshToken) from response using destructuring
    // IMPORTANT: Never return passwords or tokens in API responses
    const { password: _, refreshToken: __, ...userData } = user.toObject();

    // Return 201 Created with user data (excluding sensitive info)
    return res.status(201).json(
        new ApiResponse(201, userData, 'User registered successfully')
    );
});

/**
 * @desc Authenticate user and generate tokens
 * @param {Object} req - Express request object with email, password in body
 * @param {Object} res - Express response object
 * @return {Object} User data with tokens and success message (status 200)
 * @throw {ApiError} 400 - Missing fields, 401 - Invalid credentials
 */
const login = asyncHandler(async (req, res) => {
    // Extract credentials from request body
    const { email, password } = req.body;

    // Validate required login fields
    if (!email?.trim() || !password) {
        throw new ApiError(400, 'Email and password are required');
    }

    // Normalize email before database lookup
    const normalizedEmail = email.toLowerCase().trim();
    // Fetch user and explicitly include password field (may be excluded by default)
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    // Generic error message prevents email enumeration attacks
    if (!user) {
        throw new ApiError(401, 'Invalid email or password');
    }

    // Compare provided password with stored hash using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        // Use same generic error message as invalid email for security
        throw new ApiError(401, 'Invalid email or password');
    }

    // Generate short-lived JWT access token with user ID and role for authorization
    // Payload includes minimal data needed to identify and authorize the user
    const accessToken = jwt.sign(
        { _id: user._id, role: user.role },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.JWT_ACCESS_EXPIRES }
    );

    // Generate long-lived refresh token to create new access tokens when expired
    // Refresh token contains only user ID for security (no sensitive data)
    const refreshToken = jwt.sign(
        { _id: user._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES }
    );

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Remove sensitive fields before sending response
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password: _, refreshToken: __, ...userData } = user.toObject();
    return res.status(200).json(
        new ApiResponse(200, { user: userData, accessToken }, 'Login successful')
    );

});

module.exports = { register, login };