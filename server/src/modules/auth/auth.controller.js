const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/ApiError');
const ApiResponse = require('../../utils/ApiResponse');
const User = require('../../models/user');
const bcrypt = require('bcryptjs');


const register = asyncHandler(async (req, res) => {
    // Step 1 — Validate input
    const { name, email, password } = req.body;

    // Step 2 — Check required fields
    if (!name?.trim() || !email?.trim() || !password) {
        throw new ApiError(400, 'All fields are required');
    }
    // Step 3 — Validate password strength
    if (password.length < 8) {
        throw new ApiError(400, 'Password must be at least 8 characters');
    }
    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(password)) {
        throw new ApiError(
            400,
            'Password must contain uppercase, lowercase and a number'
        );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
        throw new ApiError(400, 'Please provide a valid email address');
    }

   
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedName = name.trim();

    
    const existingUser = await User.exists({ email: normalizedEmail });
    if (existingUser) {
        throw new ApiError(409, 'Email already in use');
    }

    // Step 5 — Hash password
    const hashedPassword = await bcrypt.hash(password, 12); // 12 rounds = more secure

    // Step 6 — Create user
    const user = await User.create({
        name: normalizedName,
        email: normalizedEmail,
        password: hashedPassword,
    });

    // Step 7 — Remove sensitive fields
    const { password: _, refreshToken: __, ...userData } = user.toObject();

    // Step 8 — Return response
    return res.status(201).json(
        new ApiResponse(201, userData, 'User registered successfully')
    );
});

module.exports = { register };