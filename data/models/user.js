/* eslint-disable no-mixed-spaces-and-tabs */
const { Schema, model } = require('mongoose');
const VALID_SQUADRONS = require('../../shared/squadrons');

// User Schema
const userSchema = new Schema({
	_id: { type: Number, required: true },
	valor: { type: Number, required: true },
	lastActive: { type: String, required: true },
	squadronName: { type: String, enum: VALID_SQUADRONS, required: true, ref: 'Squadron' },
});

// User Model
const User = model('User', userSchema);

/**
 * Create User
 * @param {Object} user {_id: robloxId, valor: number, lastActive: MMDDYY, squadronName: string}
 * @returns {number} insertedId: number of changes
 */
const createUser = async (user) => {
	try {
		const newUser = new User(user);
		const result = await newUser.save();
		return result.insertedId;
	}
	catch (error) {
		console.error('Error creating user', error);
		throw error;
	}
};

/**
 * Get User by ROBLOX ID
 * @param {number} robloxId A user's unique ROBLOX ID
 * @returns {Object} user: The user document
 */
const getUserByRobloxId = async (robloxId) => {
	try {
		const user = await User.findOne({ _id: robloxId });
		return user;
	}
	catch (error) {
		console.error('Error getting user by ID:', error);
		throw error;
	}
};

/**
 * Update User or Create New User if None Exists
 * @param {Object} userData An updated user object: {_id: robloxId, valor: number, lastActive: MMDDYY, squadronName: string}
 * @returns {number} Number of changes
 */
const updateUser = async (userData) => {
	try {
		const result = await User.findOneAndUpdate(
			{ _id: userData._id },
			userData,
			{ upsert: true },
		);

		// If the user was created, result will have the `upserted` property
		if (result.upserted) {
			return 1; // Indicate that a new user was created
		}

		// If the user was updated, result will have the `modifiedCount` property
		if (result.modifiedCount) {
			return result.modifiedCount; // Return the number of modified documents
		}

		// If no changes were made, return 0
		return 0;
	}
	catch (error) {
		console.error('Error updating user', error);
		throw error;
	}
};


/**
 * Delete User
 * @param {number} robloxId A user's unique ROBLOX ID
 * @returns {number} deletedCount: Number of deleted documents
 */
const deleteUser = async (robloxId) => {
	try {
		const result = await User.deleteOne({ _id: robloxId });
		return result.deletedCount;
	}
	catch (error) {
		console.error('Error deleting user', error);
		throw error;
	}
};

module.exports = {
	createUser,
	getUserByRobloxId,
	updateUser,
	deleteUser,
};
