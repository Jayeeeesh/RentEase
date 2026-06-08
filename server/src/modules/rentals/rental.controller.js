const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/ApiError');
const ApiResponse = require('../../utils/ApiResponse');
const Rental = require('../../models/rental')
const Product = require('../../models/product')
const mongoose = require('mongoose');

const createRental = asyncHandler(async (req, res) => {
    const { productId, tenureMonths, startDate, deliveryAddress } = req.body;

    if (!productId || !tenureMonths || !startDate || !deliveryAddress) {
        throw new ApiError(400, 'All fields are required');
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new ApiError(400, 'Invalid product ID');
    }

    if (!Number.isInteger(Number(tenureMonths)) || tenureMonths < 1) {
        throw new ApiError(400, 'Tenure must be at least 1 month');
    }

    if (new Date(startDate) < new Date()) {
        throw new ApiError(400, 'Start date cannot be in the past');
    }

    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, 'Product not found');
    }
    if (!product.isAvailableForRent) {
        throw new ApiError(400, 'Product is not available for rent');
    }

    if (tenureMonths < product.minTenureMonths || tenureMonths > product.maxTenureMonths) {
        throw new ApiError(400, `Tenure must be between ${product.minTenureMonths} and ${product.maxTenureMonths} months`);
    }
    const totalAmount = product.monthlyRentalPrice * tenureMonths

    const end = new Date(startDate);
    end.setMonth(end.getMonth() + Number(tenureMonths));

    const rental = await Rental.create({
        user: req.user._id,
        product: productId,
        tenureMonths,
        startDate,
        endDate: end,
        deliveryAddress,
        totalAmount,
        securityDeposit: product.securityDeposit,
        status: 'pending'
    });


    product.isAvailableForRent = false;
    await product.save({ validateBeforeSave: false });

    return res.status(201).json(
        new ApiResponse(201, rental, 'rental created successfully')
    );

});

const getUserRentals = asyncHandler(async (req, res) => {

    const { status, page = 1, limit = 10 } = req.query;

    const filter = { user: req.user._id };
    if (status) filter.status = status;

    const total = await Rental.countDocuments(filter);

    if (!total) {
        return res.status(200).json(
            new ApiResponse(200, { rentals: [], pagination: { total: 0, page: 1, limit: parseInt(limit), totalPages: 0 } }, 'No rentals found')
        );
    }

    const rentals = await Rental.find(filter)
        .populate('product', 'name monthlyRentalPrice images city')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    return res.status(200).json(
        new ApiResponse(200, {
            rentals,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        }, 'Rentals retrieved successfully')
    );
});

const getRentalById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, 'Invalid rental ID');
    }

    const rental = await Rental.findById(id)
        .populate('product', 'name monthlyRentalPrice images city')
        .populate('user', 'name email phone');

    if (!rental) throw new ApiError(404, 'Rental not found');

    if (rental.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        throw new ApiError(403, 'Access denied');
    }

    return res.status(200).json(
        new ApiResponse(200, rental, 'Rental retrieved successfully')
    );
});

const updateRentalStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid rental ID');
  }
  if (req.user.role !== 'admin') {
    throw new ApiError(403, 'Access denied');
  }

  const { status } = req.body;

  const rental = await Rental.findById(id);
  if (!rental) throw new ApiError(404, 'Rental not found');

  
  const validTransitions = {
    pending: ['active', 'cancelled'],
    active: ['completed', 'cancelled'],
    completed: [],
    cancelled: []
  };
  if (!validTransitions[rental.status]?.includes(status)) {
    throw new ApiError(400, `Cannot change status from ${rental.status} to ${status}`);
  }

  rental.status = status;
  await rental.save({ validateBeforeSave: false });

  if (['completed', 'cancelled'].includes(status)) {
    await Product.findByIdAndUpdate(
      rental.product,
      { isAvailableForRent: true }
    );
  }

  return res.status(200).json(
    new ApiResponse(200, rental, 'Rental status updated successfully')
  );
});


const cancelRental = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid rental ID');
  }

  const rental = await Rental.findById(id);
  if (!rental) throw new ApiError(404, 'Rental not found');

  if (rental.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Access denied');
  }

  if (rental.status !== 'pending') {
    throw new ApiError(400, `Cannot cancel a ${rental.status} rental`);
  }

  rental.status = 'cancelled';
  await rental.save({ validateBeforeSave: false });

  await Product.findByIdAndUpdate(
    rental.product,
    { isAvailableForRent: true }
  );

  return res.status(200).json(
    new ApiResponse(200, rental, 'Rental cancelled successfully')
  );
});

module.exports = {
    createRental,
    getUserRentals,
    getRentalById,
    updateRentalStatus,
    cancelRental

};
