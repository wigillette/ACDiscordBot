const EmbedBuilder = require('../../discord/embedBuilder');
const noblox = require('noblox.js');
const { client } = require('../../discord/bot');
const USER_LOG_CHANNEL_ID = '1125076119050276954';
const { getUserByRobloxId, updateUser } = require('../../data/models/user');
const { updateRank } = require('../../discord/commands/valor');
/**
 * Update Squadron
 * Updates a user's squadron
 * @param {*} req
 * @param {*} res
 */
exports.updateSquadron = async (req, res) => {
	try {
		const { userId, squadronName } = req.body;
		let resMessage = `Failed to update ${userId} to ${squadronName}`;

		if (userId && squadronName) {
			const currentStats = await getUserByRobloxId(userId);
			if (currentStats) {
				const numChanges = await updateUser({ _id: userId, valor: currentStats.valor, lastActive: Date.now().toDateString(), squadronName: squadronName });
				if (numChanges > 0) {
					await this.awardValor(userId, 1);
					const username = await noblox.getUsernameFromId(userId);
					let headshotUrl = await noblox.getPlayerThumbnail(userId, undefined, undefined, true, 'headshot');
					headshotUrl = headshotUrl[0].imageUrl;

					const embed = EmbedBuilder('Squadron Notification', `[${username}](https://roblox.com/users/${userId}/profile) has been assigned to ${squadronName}`, headshotUrl);
					const guild = client.guilds.cache.get(process.env.GUILD_ID);
					if (guild) {
						const channel = guild.channels.cache.find(element => element.id == USER_LOG_CHANNEL_ID);
						if (channel) {
							await channel.send(embed);
							resMessage = 'Successfully posted squadron notification!';
						}
					}
				}
			}
		}
		res.status(200).json({ message: resMessage });
	}
	catch (e) {
		console.error(e);
		res.status(500).json({ message: e.message });
	}
};

/**
 * Fetch a user's profile
 * @param {*} req
 * @param {*} res
 */
exports.fetch = async (req, res) => {
	try {
		const { userId } = req.body;
		const toReturn = { message:`Failed to fetch ${userId} profile`, profile: null };

		if (userId) {
			const userProfile = await getUserByRobloxId(userId);
			toReturn.message = `Successfully fetched ${userId} profile`;
			toReturn.profile = userProfile;
		}

		res.status(200).json(toReturn);
	}
	catch (e) {
		console.error(e);
		res.status(500).json({ message: e.message });
	}
};

/**
 * Award valor to a user
 * @param {number} userId The user's ID
 * @param {number} amount The amount to award
 */
exports.awardValor = async (userId, amount) => {
	try {
		if (userId && amount && amount > 0 && amount < 10) {
			const currentStats = await getUserByRobloxId(userId);
			const username = await noblox.getUsernameFromId(userId);
			let headshotUrl = await noblox.getPlayerThumbnail(userId, undefined, undefined, true, 'headshot');
			headshotUrl = headshotUrl[0].imageUrl;
			if (amount > 0 && currentStats && username) {
				currentStats.valor += amount;
				await updateUser({ _id: userId, valor: currentStats.valor, lastActive: Date.now().toDateString(), squadronName: currentStats.squadronName });
				const embed = await updateRank(userId, username, currentStats.valor, headshotUrl);
				const guild = client.guilds.cache.get(process.env.GUILD_ID);
				if (guild && embed) {
					const channel = guild.channels.cache.find(element => element.id == USER_LOG_CHANNEL_ID);
					if (channel) {
						await channel.send(embed);
					}
				}
			}
		}
	}
	catch (e) {
		console.error(e);
	}
};