const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rentalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rental',
        required: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        minlength: [10, 'Description must be at least 10 characters'],
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'resolved'],
        default: 'pending'
    },
    adminNote: {
        type: String,
        trim: true,
        maxlength: [300, 'Admin note cannot exceed 300 characters']
    },
    resolvedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true });

// Auto-set resolvedAt when status becomes resolved
maintenanceSchema.pre('save', function (next) {
    if (this.isModified('status') && this.status === 'resolved') {
        this.resolvedAt = new Date();
    }
    next();
});

const Maintenance = mongoose.model('Maintenance', maintenanceSchema);
module.exports = Maintenance;