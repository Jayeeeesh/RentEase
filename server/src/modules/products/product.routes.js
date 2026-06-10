const express = require('express');
const router = express.Router();
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('./product.controller');
const { authMiddleware } = require('../../middleware/auth.middleware');
const { createProductSchema, updateProductSchema } = require('./product.validation');
const validate = require('../../middleware/validate.middleware');
// Public routes for retrieving products
router.get('/',    getAllProducts);
router.get('/:id', getProductById);
// Only allow authenticated users to create, update, or delete products
router.post('/',     authMiddleware,  validate(createProductSchema), createProduct);
router.put('/:id',    authMiddleware, validate(updateProductSchema), updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);
module.exports = router;