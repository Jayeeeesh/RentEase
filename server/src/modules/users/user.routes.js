const express = require('express');
const router = express.Router();
const { authMiddleware, isAdmin } = require('../../middleware/auth.middleware');
const { getProfile, updateProfile, changePassword, getUserById, updateUser, deleteUser } = require('./user.controller');

// Current logged-in user
router.get('/me', authMiddleware, getProfile);
router.patch('/me', authMiddleware, updateProfile);
router.patch('/me/password', authMiddleware, changePassword);

// Admin routes
router.get('/:id', authMiddleware, isAdmin, getUserById);
router.patch('/:id', authMiddleware, isAdmin, updateUser);
router.delete('/:id', authMiddleware, isAdmin, deleteUser);

module.exports = router;