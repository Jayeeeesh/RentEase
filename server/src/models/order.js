const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            name: { type: String, required: true },      // snapshot at order time
            quantity: { type: Number, required: true, min: 1 },
            price: { type: Number, required: true, min: 0 } // snapshot at order time
        }
    ],
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    }
}, { timestamps: true }); // ✅ createdAt + updatedAt auto

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;