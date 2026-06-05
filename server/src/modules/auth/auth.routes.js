const express = require('express');
const router = express.Router();
const { register, login, logout, refreshAccessToken } = require('./auth.controller');
const authMiddleware = require('../../middleware/auth.middleware'); // Middleware to protect routes and extract user info from JWT

router.post('/register', register);

router.post('/login',login);

router.post('/refresh-token', refreshAccessToken);

router.post('/logout', authMiddleware, logout);

module.exports = router;