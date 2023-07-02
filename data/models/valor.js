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
		const currentStandards = await fetchAllValor();
		const index = rankIDs.indexOf(valor._id);
		if (index > -1 && valor._id < process.env.MAX_VALOR_RANK) {
			const previousRankIDs = rankIDs.slice(0, index);
			const nextRankIDs = rankIDs.slice(index + 1);
			const previousStandards = currentStandards.filter((standard) =>
				previousRankIDs.includes(standard._id),
			);
			const nextStandards = currentStandards.filter((standard) =>
				nextRankIDs.includes(standard._id),
			);

			const isValid = previousStandards.every((standard) => valor.amount > standard.amount) && nextStandards.every((standard) => valor.amount < standard.amount);

			if (isValid) {
				const existingStandard = currentStandards.find((standard) => standard._id === valor._id);

				if (existingStandard) {
					existingStandard.amount = valor.amount;
					const result = await existingStandard.save();
					toReturn = result._id; // Use _id instead of insertedId for update
				}
				else {
					const newValor = new Valor(valor);
					const result = await newValor.save();
					toReturn = result.insertedId;
				}
			}
			else {
				console.error('Invalid valor amount');
			}
		}
		else {
			console.error('Invalid rank ID');
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
 * @returns {Object} A list of valor-rank standards [{amount: Number, _id: Number}, ...]
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
