const { Schema, model } = require('mongoose');
const noblox = require('noblox.js');

const valorSchema = new Schema({
	_id: { type: Number, required: true },
	amount: { type: Number, required: true },
});

const Valor = model('Valor', valorSchema);

/**
 * Set a rank's required valor amount
 * @param {Object} valor {_id: rankId, amount: number}
 * @returns {number} insertedId: number of changes
 */
const setValor = async (valor) => {
	try {
		const groupRanks = await noblox.getRoles(process.env.GROUP_ID);
		const rankIDs = groupRanks.map((role) => role.rank);
		let toReturn = -1;
		if (rankIDs.includes(valor._id)) {
			const newValor = new Valor(valor);
			const result = await newValor.save();
			toReturn = result.insertedId;
		}
		return toReturn;
	}
	catch (error) {
		console.error('Error setting valor amount', error);
		throw error;
	}
};

/**
 * Fetches the list of standards
 * @returns {Object} A list of valor-rank standards [{valor: Number, rank: Number}, ...]
 */
const fetchAllValor = async () => {
	try {
		const allStandards = await Valor.find();
		const sortedValor = allStandards.sort(() => {return { _id: 1 };}); // Sort in ascending order
		return sortedValor;
	}
	catch (e) {
		console.error(e);
		throw e;
	}
};


module.exports = { setValor, fetchAllValor };