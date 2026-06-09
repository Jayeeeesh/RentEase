const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/ApiError');
const ApiResponse = require('../../utils/ApiResponse');
const Maintenance = require('../../models/maintenance');
const Rental = require('../../models/rental');
const mongoose = require('mongoose');

const createRequest = asyncHandler(async (req, res) => {
    const { description, rentalId, priority } = req.body;

    if (!mongoose.Types.ObjectId.isValid(rentalId)) {
        throw new ApiError(400, 'Invalid rental ID');
    }

    const rental = await Rental.findById(rentalId);
    if (!rental) throw new ApiError(404, 'Rental not found');

    if (rental.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, 'Access denied');
    }

    const request = await Maintenance.create({
        userId: req.user._id,
        rentalId,
        description,
        priority
    });

    return res.status(201).json(
        new ApiResponse(201, request, 'Maintenance request created successfully')
    );
});

const getUserRequests = asyncHandler(async (req, res) => {
    const { status, page = 1, limit = 10 } = req.query;

    const filter = { userId: req.user._id };
    if (status) filter.status = status;

    const total = await Maintenance.countDocuments(filter);

    if (!total) {
        return res.status(200).json(
            new ApiResponse(200, {
                maintenance: [],
                pagination: { total: 0, page: 1, limit: parseInt(limit), totalPages: 0 }
            }, 'No maintenance requests found')
        );
    }

    const maintenance = await Maintenance.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    return res.status(200).json(
        new ApiResponse(200, {
            maintenance,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        }, 'Maintenance requests retrieved successfully')
    );
});

const getRequestById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, 'Invalid maintenance ID');
    }

    const maintenance = await Maintenance.findById(id);
    if (!maintenance) throw new ApiError(404, 'Maintenance request not found');

    if (maintenance.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        throw new ApiError(403, 'Access denied');
    }

    return res.status(200).json(
        new ApiResponse(200, maintenance, 'Maintenance request retrieved successfully')
    );
});

const updateRequestStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, 'Invalid maintenance ID');
    }

    const { status, adminNote } = req.body;

    const maintenance = await Maintenance.findById(id);
    if (!maintenance) throw new ApiError(404, 'Maintenance request not found');

    const validTransitions = {
        pending: ['in-progress'],
        'in-progress': ['resolved'],
        resolved: []
    };

    if (!validTransitions[maintenance.status]?.includes(status)) {
        throw new ApiError(400, `Cannot change status from ${maintenance.status} to ${status}`);
    }

    if (adminNote) maintenance.adminNote = adminNote;
    maintenance.status = status;
    await maintenance.save({ validateBeforeSave: false });

    return res.status(200).json(
        new ApiResponse(200, maintenance, 'Maintenance request updated successfully')
    );
});

module.exports = { createRequest, getUserRequests, getRequestById, updateRequestStatus };