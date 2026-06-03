const mongoose = require('mongoose');

/*
 * User Schema Definition
 * Defines the structure for user documents in MongoDB
 */
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        select: false // Never returned in queries
    },
    role: {
        type: String,
        enum: ['customer', 'admin'],
        default: 'customer'
    },
    refreshToken: {
        type: String,
        select: false
    },
    phone: {
        type: String,
        trim: true
    },
    avatar: {
        type: String,
    },
    address: {
        street: String,
        city: String,
        state: String,
        pincode: String,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;          
