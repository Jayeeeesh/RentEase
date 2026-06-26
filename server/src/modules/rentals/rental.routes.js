const express = require('express');
const router = express.Router();
const { createRental, getUserRentals, getRentalById, updateRentalStatus, cancelRental } = require('./rental.controller');
const { authMiddleware } = require('../../middleware/auth.middleware');
const validate = require('../../middleware/validate.middleware');
const { rentalSchema } = require('./rental.validation');

router.get('/',               authMiddleware, getUserRentals);
router.post('/',              authMiddleware, validate(rentalSchema), createRental);
router.get('/:id',            authMiddleware, getRentalById);
router.patch('/:id/cancel',   authMiddleware, cancelRental);
router.patch('/:id/status',   authMiddleware, updateRentalStatus);

module.exports = router;