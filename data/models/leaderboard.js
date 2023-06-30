const {getDB} = require('../db');
const Joi = require('joi');

// Database Variables
const db=getDB();
const Leaderboard=db.collection('leaderboard'); // leaderboard table
const DEFAULT_LB = {kills: 0, deaths: 0, level: 1, exp: 0, equippedSword: 'default', captures: {gate: 0, terminal: 0}}

// Leaderboard Methods
// Schema
const leaderboardSchema = Joi.object({
    _id: Joi.number().integer().required(),
    kills: Joi.number().integer().required(),
    deaths: Joi.number().integer().required(),
    level: Joi.number().integer().required(),
    exp: Joi.number().integer().required(),
    equippedSword: Joi.string().required(),
    captures: Joi.object({
        gate: Joi.number().integer().required(), 
        terminal: Joi.number().integer().required()
    })
})


/**
 * Inserts an entry for a new user into the leaderboard with default stats
 * @param {number} robloxId The user's roblox ID
 * @returns The id of the row inserted
 */
const createLeaderboard = async (robloxId) => {
    try {
        const paramSchema = Joi.number().integer().positive().required();
        const {error, value} = paramSchema.validate(robloxId);
        if (error) {
            console.error(`Invalid robloxId: ${error.message}`);
        }
        const res = await Leaderboard.insertOne({_id: robloxId, ...DEFAULT_LB})
        return res.insertedId;
    } catch (e) {
        console.error('Failed to insert user\'s data into leaderboard', e);
        throw e;
    }
}

/**
 * Fetches a user's leaderboard stats
 * @param {*} robloxId The user's roblox ID
 * @returns The user's stats in form {_id: robloxId, kills: number, deaths: number, level: number, exp: number, equippedSword: string, captures: {gate: number, terminal: number}}
 */
const getLeaderboard = async (robloxId) => {
    try {
        const paramSchema = Joi.number().integer().positive().required();
        const {error, value} = paramSchema.validate(robloxId);
        if (error) {
            console.error(`Invalid robloxId: ${error.message}`);
        }
        const res = await Leaderboard.findOne({_id: robloxId});
        return res;
    } catch (e) {
        console.error(`Failed to fetch leaderboard stats for ${robloxId}`, e);
        throw e;
    }
}

/**
 * Updates leaderboard stats
 * @param {number} robloxId The user's roblox ID
 * @param {table} leaderboardData {kills: number, deaths: number, level: number, exp: number, equippedSword: string, captures: {gate: number, terminal: number}} 
 * @returns The number of changes made
 */
const updateLeaderboard = async (leaderboardData) => {
    try {
        const { error, value } = leaderboardSchema.validate(leaderboardData);
        if (error) {
            console.error(`Invalid leaderboard object: ${error.message}`);
        }
        const res = await Leaderboard.updateOne({_id: leaderboardData._id}, {$set: leaderboardData});
        return res.modifiedCount;
    } catch (e) {
        console.error('Error updating leaderboard', e)
        throw error;
    }
}

module.exports={createLeaderboard, getLeaderboard, updateLeaderboard}