const mongoose = require('mongoose');
const VALID_PLACE_TYPES = require('../../shared/placeTypes');

// Schema
const placeSchema = new mongoose.Schema({
	_id: {
		type: String,
		required: true,
	},
	placeType: {
		type: String,
		enum: VALID_PLACE_TYPES,
		required: true,
	},
	placeId: {
		type: Number,
		required: true,
	},
});

// Model
const Place = mongoose.model('Place', placeSchema);

/**
 * Inserts an entry for a new place into the table
 * @param {Object} placeInfo An object of place info {placeType: string, _id: string, placeId: number}
 * @returns {Promise<string>} The id of the row inserted
 */
const createPlace = async (placeInfo) => {
	try {
		const place = new Place(placeInfo);
		const result = await place.save();
		return result._id;
	}
	catch (error) {
		console.error('Failed to insert the event', error);
		throw error;
	}
};

/**
 * Fetches place info
 * @param {string} placeName A registered place name/id
 * @returns {table} placeInfo {placeType: string, _id: string, placeId: number}
 */
const getPlace = async (placeName) => {
	try {
		const placeInfo = await Place.findOne({ _id: placeName });
		return placeInfo;
	}
	catch (error) {
		console.error('Error fetching place info: ', error);
		throw error;
	}
};

/**
 * Fetches place info
 * @returns {table} placeInfo[] [{placeType: string, _id: string, placeId: number}, ...]
 */
const fetchAllPlaces = async () => {
	try {
		const placeInfo = await Place.find();
		return placeInfo;
	}
	catch (error) {
		console.error('Error fetching all places: ', error);
		throw error;
	}
};

/**
 * Unregister a place
 * @param {string} placeName A registered place name/id
 * @returns {number} deletedCount: Number of deleted documents
 */
const deletePlace = async (placeName) => {
	try {
		const result = await Place.deleteOne({ _id: placeName });
		return result.deletedCount;
	}
	catch (error) {
		console.error('Error deleting place', error);
		throw error;
	}
};

module.exports = { createPlace, getPlace, deletePlace, fetchAllPlaces };
