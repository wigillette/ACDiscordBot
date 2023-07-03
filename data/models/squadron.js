const VALID_SQUADRONS = require('../../shared/squadrons');
const { Schema, model } = require('mongoose');

// Database Variables
const squadronSchema = new Schema({
	_id: {
		type: String,
		enum: VALID_SQUADRONS,
		required: true,
	},
	points: {
		type: Number,
		required: true,
	},
	emblemAssetId: {
		type: Number,
		required: true,
	},
	leaderId: {
		type: Number,
		required: true,
	},
	desc: {
		type: String,
		required: true,
	},
});

const SquadronModel = model('Squadron', squadronSchema);

/**
 * Create Squadron
 * Initializes a squadron
 * @param {table} squadronInfo {_id: string, desc: string, leaderId: number, points: number, emblemAssetId: number}
 * @returns {number} number of changes
 */
const createSquadron = async (squadronInfo) => {
	try {
		const squadron = new SquadronModel(squadronInfo);
		const result = await squadron.save();
		return result._id;
	}
	catch (error) {
		console.error('Error creating squadron', error);
		throw error;
	}
};

/**
 * Fetches squadron info
 * @param {number} squadronName
 * @returns {table} squadronInfo: {_id: string, desc: string, leaderId: number, points: number, emblemAssetId: number}
 */
const getSquadron = async (squadronName) => {
	try {
		const squadronInfo = await SquadronModel.findOne({ _id: squadronName });
		return squadronInfo;
	}
	catch (error) {
		console.error('Error fetching squadron info: ', error);
		throw error;
	}
};

/**
 * Updates a squadron's info
 * @param {Object} squadronInfo {_id: string, desc: string, leaderId: number, points: number, emblemAssetId: number}
 * @returns {number} Number of changes
 */
const updateSquadron = async (squadronInfo) => {
	try {
		const result = await SquadronModel.updateOne({ _id: squadronInfo._id }, squadronInfo, { upsert: true });
		return result.modifiedCount;
	}
	catch (error) {
		console.error('Error updating squadron info', error);
		throw error;
	}
};

/**
 * Determines whether the user is a leader of a specific squadron
 * @param {number} squadronName The squadron name in the database
 * @param {number} robloxId The roblox ID of the specified player
 * @returns {boolean} whether the player is a leader of the specified squadron
 */
const isLeader = async (squadronName, robloxId) => {
	try {
		const squadronInfo = await getSquadron(squadronName);
		return squadronInfo && squadronInfo.leaderId && squadronInfo.leaderId == robloxId;
	}
	catch (error) {
		console.error('Error determining whether player is leader of squadron', error);
		throw error;
	}
};

module.exports = { createSquadron, getSquadron, updateSquadron, isLeader };
