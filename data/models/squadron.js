const {getDB} = require('../db');
const Joi = require('joi');

// Database Variables
const db=getDB();
const Squadron=db.collection('squadron'); // squadron table

const squadronSchema = Joi.object({
    _id: Joi.number().integer().required(),
    points: Joi.number().integer().required(),
    emblemAssetId: Joi.number().integer().required(),
    leaderId: Joi.number().integer().required(),
    desc: Joi.string().required(),
    name: Joi.string().required()
})

/**
 * Create Squadron
 * Initializes a squadron
 * @param {table} squadronInfo {_id: number, name: string, desc: string, leaderId: number, points: number, emblemAssetId: number}
 * @returns {number} number of changes
 */
const createSquadron = async (squadronInfo) => {
    try {
        const { error, value } = squadronSchema.validate(squadronInfo);
        if (error) {
            throw new Error(`Invalid squadron object: ${error.message}`);
        }
        const result = await Squadron.insertOne(squadronInfo);
        return result.insertedId;
    } catch (error) {
        console.error('Error creating squadron', error);
        throw error;
    }
}

/**
 * Fetches squadron info
 * @param {number} squadronId
 * @returns {table} squadronInfo: {name: string, desc: string, leaderId: number, points: number, emblemAssetId: number}
 */
const getSquadron = async (squadronId) => {
    try {
        const paramSchema = Joi.number().integer().required();
        const {error, value} = paramSchema.validate(squadronId);
        if (error) {
            throw new Error(`Invalid squadron ID: ${error.message}`);
        }
        const res = await Squadron.findOne({_id: squadronId})
        
        return JSON.stringify(res)
    } catch (e) {
        console.error('Error fetching squadron info: ', e);
        throw e;
    }
}

/**
 * Updates a squadron's info
 * @param {table} squadronInfo {name: string, desc: string, leaderId: number, points: number, emblemAssetId: number} 
 * @returns {number} Number of changes
 */
const updateSquadron = async (squadronInfo) => {
    try {
        const { error, value } = squadronSchema.validate(squadronInfo);
        if (error) {
            throw new Error(`Invalid squadron object: ${error.message}`);
        }
        const res = await Squadron.updateOne({_id: squadronInfo._id}, {$set: squadronInfo});
        return res.modifiedCount;
    } catch (e) {
        console.error('Error updating squadron info', e)
        throw error;
    }
}

/**
 * Determines whether the user is a leader of a specific squadron
 * @param {number} squadronId The squadron ID in the database
 * @param {number} robloxId The roblox ID of the specified player
 * @returns {boolean} whether the player is a leader of the specified squadron 
 */
const isLeader = async (squadronId, robloxId) => {
    try {
        const paramSchema = Joi.object({squadronId: Joi.number().integer().required(), robloxId: Joi.number().integer().positive().required()});
        const {error, value} = paramSchema.validate({squadronId: squadronId, robloxId: robloxId});
        if (error) {
            throw new Error(`Invalid robloxId or squadronId: ${error.message}`);
        }
        const squadronInfo = getSquadron(squadronId);
        return squadronInfo && squadronInfo.leaderId && squadronInfo.leaderId == robloxId
    } catch (e) {
        console.error('Error determining whether player is leader of squadron', e);
        throw e;
    }
}

module.exports = {createSquadron, getSquadron, updateSquadron, isLeader}