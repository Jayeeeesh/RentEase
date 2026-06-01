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
    price: {
        type: Number,
        required: true,
        min: 0
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    category: { 
        type: String, 
        required: true, 
        trim: true 
    }
}, { timestamps: true }); // ✅ createdAt + updatedAt auto

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
