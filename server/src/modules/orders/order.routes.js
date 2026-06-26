const express = require('express');
const router = express.Router();
const { authMiddleware, isAdmin } = require('../../middleware/auth.middleware');
const { createOrder, getUserOrders, getOrderById, updateOrderStatus, cancelOrder} = require('./order.controller');
const validate = require('../../middleware/validate.middleware');
const { createOrderSchema, updateOrderStatusSchema } = require('./order.validation')

router.get('/', authMiddleware, getUserOrders);
router.post('/', authMiddleware, validate(createOrderSchema), createOrder);
router.get('/:id', authMiddleware, getOrderById);
router.patch('/:id/cancel', authMiddleware, cancelOrder);
router.patch('/:id', authMiddleware, isAdmin, validate(updateOrderStatusSchema), updateOrderStatus)


module.exports = router;