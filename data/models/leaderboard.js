const { Schema, model } = require('mongoose');

// Database Variables
const DEFAULT_LB = { kills: 0, deaths: 0, level: 1, exp: 0, equippedSword: 'default', captures: { gate: 0, terminal: 0 } };

// Leaderboard Schema
const leaderboardSchema = new Schema({
	_id: { type: Number, required: true },
	kills: { type: Number, required: true },
	deaths: { type: Number, required: true },
	level: { type: Number, required: true },
	exp: { type: Number, required: true },
	equippedSword: { type: String, required: true },
	captures: {
		gate: { type: Number, required: true },
		terminal: { type: Number, required: true },
	},
});

// Leaderboard Model
const LeaderboardModel = model('Leaderboard', leaderboardSchema);

/**
 * Inserts an entry for a new user into the leaderboard with default stats
 * @param {number} robloxId The user's roblox ID
 * @returns The id of the row inserted
 */
const createLeaderboard = async (robloxId) => {
	try {
		const paramSchema = Number.isInteger(robloxId) && robloxId > 0;
		if (!paramSchema) {
			console.error(`Invalid robloxId: ${robloxId}`);
			return null;
		}
		const res = await LeaderboardModel.create({ _id: robloxId, ...DEFAULT_LB });
		return res._id;
	}
	catch (e) {
		console.error('Failed to insert user\'s data into leaderboard', e);
		throw e;
	}
};

/**
 * Fetches a user's leaderboard stats
 * @param {number} robloxId The user's roblox ID
 * @returns The user's stats in form {_id: robloxId, kills: number, deaths: number, level: number, exp: number, equippedSword: string, captures: {gate: number, terminal: number}}
 */
const getLeaderboard = async (robloxId) => {
	try {
		const paramSchema = Number.isInteger(robloxId) && robloxId > 0;
		if (!paramSchema) {
			console.error(`Invalid robloxId: ${robloxId}`);
			return null;
		}
		const res = await LeaderboardModel.findOne({ _id: robloxId });
		return res;
	}
	catch (e) {
		console.error(`Failed to fetch leaderboard stats for ${robloxId}`, e);
		throw e;
	}
};

/**
 * Updates leaderboard stats
 * @param {table} leaderboardData {kills: number, deaths: number, level: number, exp: number, equippedSword: string, captures: {gate: number, terminal: number}}
 * @returns The number of changes made
 */
const updateLeaderboard = async (leaderboardData) => {
	try {
		const { _id, ...data } = leaderboardData;
		const result = await LeaderboardModel.updateOne({ _id }, data);
		return result.modifiedCount;
	}
	catch (e) {
		console.error('Error updating leaderboard', e);
		throw e;
	}
};

module.exports = { createLeaderboard, getLeaderboard, updateLeaderboard };
