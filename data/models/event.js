const mongoose = require('mongoose');
const VALID_EVENTS = require('../../shared/eventTypes');

// Schema
const eventSchema = new mongoose.Schema({
	eventType: {
		type: String,
		enum: VALID_EVENTS,
		required: true,
	},
	hostId: {
		type: Number,
		required: true,
	},
	date: {
		type: String,
		match: /^\d{2}\/\d{2}\/\d{2}$/,
		required: true,
	},
	notes: String,
	result: String,
});

// Model
const Event = mongoose.model('Event', eventSchema);

/**
 * Inserts an entry for a new event into the table
 * @param {Object} eventInfo An object of event info {eventType: string, hostId: number, date: MM/DD/YY, notes: string, result: boolean}
 * @returns {Promise<string>} The id of the row inserted
 */
const createEvent = async (eventInfo) => {
	try {
		const event = new Event(eventInfo);
		const result = await event.save();
		return result._id;
	}
	catch (error) {
		console.error('Failed to insert the event', error);
		throw error;
	}
};

module.exports = { createEvent };
