const {getDB} = require('../db');
const Joi = require('joi');

// Database Variables
const db=getDB();
const Event=db.collection('event'); // leaderboard table
const validTypes=['Training','Raid','Defense']

// Event Methods
// Schema
const eventSchema = Joi.object({
    eventType: Joi.string().valid(...validTypes).required(),
    hostId: Joi.number().integer().required(),
    date: Joi.string().regex(/^\d{2}\/\d{2}\/\d{2}$/).date({format: 'MM/DD/YY'}).required(),
    notes: Joi.string(),
    result: Joi.boolean()
})

/**
 * Inserts an entry for a new event into the table
 * @param {table} eventInfo A table of event info {eventType: string, hostId: number, date: MM/DD/YY, notes: string, result: boolean}
 * @returns The id of the row inserted
 */
const createEvent = async (eventInfo) => {
    try {
        const {error, value} = eventSchema.validate(eventInfo);
        if (error) {
            throw new Error(`Invalid event Info: ${error.message}`);
        }
        const res = await Event.insertOne(eventInfo)
        return res.insertedId;
    } catch (e) {
        console.error('Failed to insert the event', e);
        throw e;
    }
}

module.exports = {createEvent}