const express = require('express');
const router = express.Router();
const { createRental, getUserRentals, getRentalById, updateRentalStatus, cancelRental } = require('./rental.controller');
const authMiddleware = require('../../middleware/auth.middleware');

// All rental routes require authentication
router.get('/',               authMiddleware, getUserRentals);
router.post('/',              authMiddleware, createRental);
router.get('/:id',            authMiddleware, getRentalById);
router.patch('/:id/cancel',   authMiddleware, cancelRental);
router.patch('/:id/status',   authMiddleware, updateRentalStatus);

module.exports = router;