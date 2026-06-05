const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    images: [
        {
            url: { type: String, required: true },
            alt: { type: String }
        }
    ],
    description: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['furniture', 'appliance'], // Restrict to predefined categories
        trim: true
    },
    subcategory: {
        type: String,
        trim: true,
        enum: ['bed', 'sofa', 'table', 'fridge', 'washing_machine', 'tv'] // Example subcategories
    },
    monthlyRentalPrice: {
        type: Number,
        required: true,
        min: 0
    },
    securityDeposit: {
        type: Number,
        required: true,
        min: 0
    },
    minTenureMonths: {
        type: Number,
        required: true,
        min: 1
    },
    maxTenureMonths: {
        type: Number,
        required: true,
        min: 1,
        validate: {
            validator: function (value) {
                return value >= this.minTenureMonths;
            },
            message: 'maxTenureMonths must be greater than or equal to minTenureMonths'
        }
    },
    isAvailableForRent: {
        type: Boolean,
        default: true,
        required: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }


}, { timestamps: true }); // ✅ createdAt + updatedAt auto

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
