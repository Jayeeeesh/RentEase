const mongoose = require('mongoose');

/*
 * Rental Schema Definition
 * Defines the structure for rental documents in MongoDB
 */
const rentalSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    deliveryAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        country: { type: String, required: true }
    },
    tenureMonths: {
        type: Number,
        required: true,
        min: 1
    },
    securityDeposit: {
        type: Number,
        required: true,
        min: 0
    },
    endDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (val) {
                return val > this.startDate;
            },
            message: 'endDate must be after startDate'
        }
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'completed', 'cancelled'],
        default: 'pending'
    }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Indexes for efficient querying
rentalSchema.index({ user: 1 });
rentalSchema.index({ product: 1 });
rentalSchema.index({ status: 1 });
rentalSchema.index({ startDate: 1, endDate: 1 });


// Create Rental model from the schema
const Rental = mongoose.model('Rental', rentalSchema);

// Export the Rental model for use in other parts of the application
module.exports = Rental;    