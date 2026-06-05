const express = require('express');
const router = express.Router();
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('./product.controller');
const authMiddleware = require('../../middleware/auth.middleware');
// Public routes for retrieving products
router.get('/',       getAllProducts);
router.get('/:id',    getProductById);
// Only allow authenticated users to create, update, or delete products
router.post('/',       authMiddleware,   createProduct);
router.put('/:id',     authMiddleware,  updateProduct);
router.delete('/:id',  authMiddleware,  deleteProduct);
module.exports = router;