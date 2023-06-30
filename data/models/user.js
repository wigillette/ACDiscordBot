const {getDB} = require('../db');
const Joi = require('joi');
// Database Variables
const db=getDB();
const User=db.collection('user'); // user table
const VALID_SQUADRONS = require('../../shared/squadrons')

// User table methods
// Schema
const userSchema = Joi.object({
    _id: Joi.number().integer().required(),
    valor: Joi.number().integer().required(),
    lastActive: Joi.string().regex(/^\d{2}\/\d{2}\/\d{2}$/).date({format: 'MM/DD/YY'}),
    squadronName: Joi.string().valid(...VALID_SQUADRONS).required()
})

/**
 * Create User
 * @param {table} user {_id: robloxId, valor: number, lastActive: MMDDYY, squadronName: string}
 * @returns {number} insertedId: number of changes
 */
const createUser = async (user) => {
    try {
        const { error, value } = userSchema.validate(user);
        if (error) {
            console.error(`Invalid user object: ${error.message}`);
        }
        const result = await User.insertOne(user);
        return result.insertedId;
    } catch (e) {
        console.error('Error creating user', e);
        throw error;
    }
}

/**
 * Get User by ROBLOX ID
 * @param {number} robloxId A user's unique ROBLOX ID
 * @returns {table} user: The user table
 */
const getUserByRobloxId = async (robloxId) => {
    try {
        const paramSchema = Joi.number().integer().positive().required();
        const {error, value} = paramSchema.validate(robloxId);
        if (error) {
            console.error(`Invalid robloxId: ${error.message}`);
        }
        const user = await User.findOne({_id: robloxId});
        return user;
    } catch (e) {
        console.error('Error getting user by ID:', e);
        throw error;
    }
}

/**
 * Update User
 * @param {table} updateData An updated user table:{_id: robloxId, valor: number, lastActive: MMDDYY, squadronName: string}
 * @returns {number} number of changes
 */
const updateUser = async (userData) => {
    try {
        const { error, value } = userSchema.validate(userData);
        if (error) {
            console.error(`Invalid user object: ${error.message}`);
        }
        const res = await User.updateOne({_id: userData._id}, {$set: userData});
        return res.modifiedCount;
    } catch (e) {
        console.error('Error updating user', e)
        throw error;
    }
}

/**
 * Delete User
 * @param {number} robloxId A user's unique ROBLOX ID
 * @returns deletedCount: number deleted
 */
const deleteUser = async (robloxId) => {
    try {
        const paramSchema = Joi.number().integer().positive().required();
        const {error, value} = paramSchema.validate(robloxId);
        if (error) {
            console.error(`Invalid robloxId: ${error.message}`);
        }
        const result = await User.deleteOne({_id: robloxId});
        return result.deletedCount;
    } catch (e) {
        console.error('Error deleting user', e);
        throw error;
    }
}

module.exports = {
    createUser,
    getUserByRobloxId,
    updateUser,
    deleteUser
}

module.exports=User;