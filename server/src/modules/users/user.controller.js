const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/ApiError');
const ApiResponse = require('../../utils/ApiResponse');
const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Rental = require('../../models/rental');

const getProfile = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new ApiResponse(200, req.user, 'Profile retrieved successfully')
    );
});

const updateProfile = asyncHandler(async (req, res) => {
    const allowedFields = ['name', 'phone', 'avatar', 'address'];
    const updates = {};
    allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
            updates[field] = req.body[field];
        }
    });

    if (Object.keys(updates).length === 0) {
        throw new ApiError(400, 'No valid fields provided for update');
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: updates },
        { new: true, runValidators: true }
    ).select('-password -refreshToken');

    if (!user) throw new ApiError(404, 'User not found');

    return res.status(200).json(
        new ApiResponse(200, user, 'Profile updated successfully')
    );
});

const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        throw new ApiError(400, 'Old password and new password are required');
    }

    if (oldPassword === newPassword) {
        throw new ApiError(400, 'New password must be different from old password');
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user) throw new ApiError(404, 'User not found');

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throw new ApiError(400, 'Old password is incorrect');

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save({ validateBeforeSave: false });

    return res.status(200).json(
        new ApiResponse(200, null, 'Password changed successfully')
    );
});

const getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, 'Invalid user ID');
    }

    const user = await User.findById(id).select('-password -refreshToken');
    if (!user) throw new ApiError(404, 'User not found');

    return res.status(200).json(
        new ApiResponse(200, user, 'User retrieved successfully')
    );
});

const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, 'Invalid user ID');
    }

    const allowedFields = ['role', 'isActive'];
    const updates = {};
    allowedFields.forEach((key) => {
        if (req.body[key] !== undefined) {
            updates[key] = req.body[key];
        }
    });

    if (Object.keys(updates).length === 0) {
        throw new ApiError(400, 'No valid fields provided for update');
    }

    const user = await User.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, runValidators: true }
    ).select('-password -refreshToken');

    if (!user) throw new ApiError(404, 'User not found');

    return res.status(200).json(
        new ApiResponse(200, user, 'User updated successfully')
    );
});


const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, 'Invalid user ID');
    }

    const user = await User.findById(id);
    if (!user) throw new ApiError(404, 'User not found');

    const activeRentals = await Rental.exists({ user: id, status: 'active' });
    if (activeRentals) throw new ApiError(400, 'Cannot delete user with active rentals');

    await user.deleteOne();

    return res.status(200).json(
        new ApiResponse(200, null, 'User deleted successfully')
    );
});

module.exports = { getProfile, updateProfile, changePassword, getUserById, updateUser, deleteUser };