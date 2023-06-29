const {getDB} = require('../db');

// Database Variables
const db=getDB();
const User=db.collection('user'); // user table

// User table methods
/**
 * Create User
 * @param {table} user {robloxId: ... (UNIQUE), kills: number, deaths: number, captures: {gate: number, terminal: number}, valor: number, lastActive: MMDDYY, squadronID: number, level: number, experience: number}
 * @returns {number} insertedId: number of changes
 */
const createUser = async (user) => {
    try {
        const result = await User.insertOne(user);
        return result.insertedId;
    } catch (error) {
        console.error('Error creating user', error);
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
        const user = await User.findOne({robloxId: robloxId});
        return user;
    } catch (e) {
        console.error('Error getting user by ID:', error);
        throw error;
    }
}

/**
 * Update User
 * @param {number} robloxId A user's unique ROBLOX ID
 * @param {table} updateData An updated user table: {robloxId: ... (UNIQUE), kills: number, deaths: number, captures: {gate: number, terminal: number}, valor: number, lastActive: MMDDYY, squadronID: number, level: number, experience: number}
 * @returns {number} number of changes
 */
const updateUser = async (robloxId, updateData) => {
    try {
        const res = await User.updateOne({robloxId: robloxId}, {$set: updateData});
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
        const result = await User.deleteOne({_id: userId});
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