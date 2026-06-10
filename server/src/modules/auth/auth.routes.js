const express = require('express');
const router = express.Router();
const { register, login, logout, refreshAccessToken } = require('./auth.controller');
const { authMiddleware } = require('../../middleware/auth.middleware'); // Middleware to protect routes and extract user info from JWT
const validate = require('../../middleware/validate.middleware')
const { registerSchema, loginSchema } = require('../auth/auth.validation')

router.post('/register', validate(registerSchema),  register);

router.post('/login',    validate(loginSchema),  login);

router.post('/refresh-token', refreshAccessToken);

router.post('/logout', authMiddleware, logout);

module.exports = router;