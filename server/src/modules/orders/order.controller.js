const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/ApiError');
const ApiResponse = require('../../utils/ApiResponse');
const Order = require('../../models/order');
const mongoose = require('mongoose');

const createOrder = asyncHandler(async (req, res) => {
    const { products } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
        throw new ApiError(
            400,
            'At least one product is required'
        );
    }

    const totalPrice = products.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const order = await Order.create({
        userId: req.user._id,
        products,
        totalPrice,
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            order,
            'Order created successfully'
        )
    );
});

const getUserOrders = asyncHandler(async (req, res) => {
    const { status, page = 1, limit = 10 } = req.query;

    const filter = { userId: req.user._id };  // userId — model field naam
    if (status) filter.status = status;

    const total = await Order.countDocuments(filter);

    if (!total) {
        return res.status(200).json(
            new ApiResponse(200, { orders: [], pagination: { total: 0, page: 1, limit: parseInt(limit), totalPages: 0 } }, 'No orders found')
        );
    }

    const orders = await Order.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    return res.status(200).json(
        new ApiResponse(200, {
            orders,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        }, 'Orders retrieved successfully')
    );
});

const getOrderById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, 'Invalid order ID');
    }

    const order = await Order.findById(id);
    if (!order) throw new ApiError(404, 'Order not found');

    if (order.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        throw new ApiError(403, 'Access denied');
    }

    return res.status(200).json(
        new ApiResponse(200, order, 'Order retrieved successfully')
    );
});

const updateOrderStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, 'Invalid order ID');
    }

    const { status } = req.body;
    const order = await Order.findById(id);
    if (!order) throw new ApiError(404, 'Order not found');

    const validTransitions = {
        pending: ['processing', 'cancelled'],
        processing: ['shipped', 'cancelled'],
        shipped: ['delivered'],
        delivered: [],
        cancelled: []
    };

    if (!validTransitions[order.status]?.includes(status)) {
        throw new ApiError(400, `Cannot change status from ${order.status} to ${status}`);
    }

    order.status = status;
    await order.save({ validateBeforeSave: false });

    return res.status(200).json(
        new ApiResponse(200, order, 'Order status updated successfully')
    );
});

const cancelOrder = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, 'Invalid order ID');
    }

    const order = await Order.findById(id);
    if (!order) throw new ApiError(404, 'Order not found');

    if (order.userId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, 'Access denied');
    }

    if (order.status !== 'pending') {
        throw new ApiError(400, `Cannot cancel a ${order.status} order`);
    }

    order.status = 'cancelled';
    await order.save({ validateBeforeSave: false });

    return res.status(200).json(
        new ApiResponse(200, order, 'Order cancelled successfully')
    );
});


module.exports = { createOrder, getUserOrders, getOrderById, updateOrderStatus, cancelOrder };