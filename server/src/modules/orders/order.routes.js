const express = require('express');
const router = express.Router();
const { authMiddleware, isAdmin } = require('../../middleware/auth.middleware');
const { createOrder, getUserOrders, getOrderById, updateOrderStatus, cancelOrder} = require('./order.controller');

router.get('/', authMiddleware, getUserOrders);
router.post('/', authMiddleware, createOrder);
router.get('/:id', authMiddleware, getOrderById);
router.patch('/:id', authMiddleware, isAdmin, updateOrderStatus);


module.exports = router;