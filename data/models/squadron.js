const {getDB} = require('../db');
const Joi = require('joi');
const VALID_SQUADRONS = require('../../shared/squadrons')

// Database Variables
const db=getDB();
const Squadron=db.collection('squadron'); // squadron table

const squadronSchema = Joi.object({
    _id: Joi.string().valid(...VALID_SQUADRONS).required(),
    points: Joi.number().integer().required(),
    emblemAssetId: Joi.number().integer().required(),
    leaderId: Joi.number().integer().required(),
    desc: Joi.string().required(),
})

/**
 * Create Squadron
 * Initializes a squadron
 * @param {table} squadronInfo {_id: string, desc: string, leaderId: number, points: number, emblemAssetId: number}
 * @returns {number} number of changes
 */
const createSquadron = async (squadronInfo) => {
    try {
        const { error, value } = squadronSchema.validate(squadronInfo);
        if (error) {
            console.error(`Invalid squadron object: ${error.message}`);
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
 * @returns {table} squadronInfo: {_id: string, desc: string, leaderId: number, points: number, emblemAssetId: number}
 */
const getSquadron = async (squadronName) => {
    try {
        const paramSchema = Joi.string().valid(...VALID_SQUADRONS).required();
        const {error, value} = paramSchema.validate(squadronName);
        if (error) {
            console.error(`Invalid squadron name: ${error.message}`);
        }
        const res = await Squadron.findOne({_id: squadronName})
        return res
    } catch (e) {
        console.error('Error fetching squadron info: ', e);
        throw e;
    }
}

/**
 * Updates a squadron's info
 * @param {table} squadronInfo {_id: string, desc: string, leaderId: number, points: number, emblemAssetId: number} 
 * @returns {number} Number of changes
 */
const updateSquadron = async (squadronInfo) => {
    try {
        const { error, value } = squadronSchema.validate(squadronInfo);
        if (error) {
            console.error(`Invalid squadron object: ${error.message}`);
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
 * @param {number} squadronName The squadron name in the database
 * @param {number} robloxId The roblox ID of the specified player
 * @returns {boolean} whether the player is a leader of the specified squadron 
 */
const isLeader = async (squadronName, robloxId) => {
    try {
        const paramSchema = Joi.object({squadronName: Joi.string().valid(...VALID_SQUADRONS).required(), robloxId: Joi.number().integer().positive().required()});
        const {error, value} = paramSchema.validate({squadronName: squadronName, robloxId: robloxId});
        if (error) {
            console.error(`Invalid robloxId or squadron name: ${error.message}`);
        }
        const squadronInfo = getSquadron(squadronName);
        return squadronInfo && squadronInfo.leaderId && squadronInfo.leaderId == robloxId
    } catch (e) {
        console.error('Error determining whether player is leader of squadron', e);
        throw e;
    }
}

module.exports = {createSquadron, getSquadron, updateSquadron, isLeader}