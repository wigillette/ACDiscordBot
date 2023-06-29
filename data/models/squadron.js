const {getDB} = require('../db');

// Database Variables
const db=getDB();
const Squadron=db.collection('squadron'); // squadron table

/**
 * Create Squadron
 * Initializes a squadro
 * @param {table} squadronInfo {name: string, desc: string, leaderId: number, points: number, emblemAssetId: number}
 * @returns {number} number of changes
 */
const createSquadron = async (squadronInfo) => {
    try {
        const result = await Squadron.insertOne(squadronInfo);
        return result.insertedId;
    } catch (error) {
        console.error('Error creating squadron', error);
        throw error;
    }
}

// TO-DO: add getSquadron and a method to determine if a user is a leader of a squadron and a way to update squadrons
module.exports = {createSquadron}