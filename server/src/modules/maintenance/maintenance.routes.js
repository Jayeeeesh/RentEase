const express = require('express');
const router = express.Router();
const { authMiddleware, isAdmin } = require('../../middleware/auth.middleware');
const { createRequest, getUserRequests, getRequestById, updateRequestStatus } = require('./maintenance.controller');

// User routes
router.post('/', authMiddleware, createRequest);
router.get('/', authMiddleware, getUserRequests);
router.get('/:id', authMiddleware, getRequestById);

// Admin routes
router.patch('/:id', authMiddleware, isAdmin, updateRequestStatus);

module.exports = router;