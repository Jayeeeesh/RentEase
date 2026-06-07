const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/ApiError');
const ApiResponse = require('../../utils/ApiResponse');
const Product = require('../../models/product');
const mongoose = require('mongoose');


const getAllProducts = asyncHandler(async (req, res) => {
    const { category, subcategory, city, isAvailableForRent, page = 1, limit = 10 } = req.query;
    let filter = {};
    if (category) {
        filter.category = category;
    }
    if (subcategory) {
        filter.subcategory = subcategory;
    }
    if (city) {
        filter.city = city;
    }
    if (isAvailableForRent) {
        filter.isAvailableForRent = isAvailableForRent === 'true'; // Convert string to boolean    
    }

    const total = await Product.countDocuments(filter);
    if (!total) throw new ApiError(404, 'No products found');

    const products = await Product.find(filter)
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    return res.status(200).json(
        new ApiResponse(200, {
            products,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        }, 'Products retrieved successfully')
    );
});

const getProductById = asyncHandler(async (req, res) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, 'Invalid product ID');
    }
    const product = await Product.findById(id);
    if (!product) {
        throw new ApiError(404, 'Product not found');
    }
    return res.status(200).json(
        new ApiResponse(200, product, 'Product retrieved successfully')
    );
});


const createProduct = asyncHandler(async (req, res) => {
    // Only allow admins to create products
    if (req.user.role !== 'admin') {
        throw new ApiError(403, 'Access denied. Admins only.');
    } // Owner is set to the authenticated user creating the product

    const { name, images, description, category, subcategory, monthlyRentalPrice, securityDeposit, minTenureMonths, maxTenureMonths, city, quantity } = req.body;

    const product = await Product.create({
        name,
        images,
        description,
        category,
        subcategory,
        monthlyRentalPrice,
        securityDeposit,
        minTenureMonths,
        maxTenureMonths,
        city,
        quantity,
        owner: req.user._id // Set owner to the authenticated user's ID
    });

    return res.status(201).json(
        new ApiResponse(201, product, 'Product created successfully')
    );
});

const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    // Validate product ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, 'Invalid product ID');
    }

    // Only allow the owner or admins to update the product
    if (req.user.role !== 'admin') {
        throw new ApiError(403, 'Access denied. Owners or admins only.');
    }

    const allowedFields = ['name', 'images', 'description', 'monthlyRentalPrice',
        'securityDeposit', 'minTenureMonths', 'maxTenureMonths',
        'city', 'quantity', 'isAvailableForRent', 'subcategory'];

    const updates = {};
    allowedFields.forEach((key) => {
        if (req.body[key] !== undefined) {
            updates[key] = req.body[key];
        }
    });

    const product = await Product.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, runValidators: true }
    );

    if (!product) throw new ApiError(404, 'Product not found');

    return res.status(200).json(
        new ApiResponse(200, product, 'Product updated successfully')
    );
});

const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    // Validate product ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, 'Invalid product ID');
    }

    // Only allow the owner or admins to delete the product
    if (req.user.role !== 'admin') {
        throw new ApiError(403, 'Access denied. Owners or admins only.');
    }

    const product = await Product.findById(id);
    if (!product) throw new ApiError(404, 'Product not found');

    // Check if product has active rentals before deleting
    //  Cannot delete product with active rentals
     const activeRentals = await Rental.exists({ product: id, status: 'active' });
     if (activeRentals) throw new ApiError(400, 'Cannot delete product with active rentals');

    await product.deleteOne();

    return res.status(200).json(
        new ApiResponse(200, null, 'Product deleted successfully')
    );
});
module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};

