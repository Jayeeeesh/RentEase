const express = require('express');
const router = express.Router();
const { authMiddleware, isAdmin } = require('../../middleware/auth.middleware');
const { createRequest, getUserRequests, getRequestById, updateRequestStatus } = require('./maintenance.controller');
const validate = require('../../middleware/validate.middleware');
const { createRequestSchema, updateRequestSchema } = require('./maintenance.validation');

// User routes
router.post('/', authMiddleware, validate(createRequestSchema), createRequest);
router.get('/', authMiddleware, getUserRequests);
router.get('/:id', authMiddleware, getRequestById);

// Admin routes
router.patch('/:id', authMiddleware, isAdmin, validate(updateRequestSchema), updateRequestStatus);

module.exports = router;