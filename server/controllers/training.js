const EmbedBuilder = require('../../discord/embedBuilder');
const noblox = require('noblox.js');
const { client } = require('../../discord/bot');
const EVENT_CHANNEL_ID = '1125470734240727081';

/**
 * Training Start
 * Posts that a training has started in the events channel
 * @param {*} req
 * @param {*} res
 */
exports.start = async (req, res) => {
	try {
		const { hostId, locationId } = req.body;
		let resMessage = 'Failed to post training announcement';

		if (hostId && locationId) {
			const username = await noblox.getUsernameFromId(hostId);
			let headshotUrl = await noblox.getPlayerThumbnail(hostId, undefined, undefined, true, 'headshot');
			headshotUrl = headshotUrl[0].imageUrl;

			const fields = [{ name: 'Host', value: username, inline: true }];

			const embed = EmbedBuilder('Training Notification', `A [training](https://roblox.com/games/${locationId}) is currently occurring!`, headshotUrl, fields);
			const guild = client.guilds.cache.get(process.env.GUILD_ID);
			if (guild) {
				const channel = guild.channels.cache.find(element => element.id == EVENT_CHANNEL_ID);
				if (channel) {
					await channel.send(embed);
					resMessage = 'Successfully posted training notification!';
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
 * Training End
 * Posts that a training has ended in the events channel
 * @param {*} req participantList: [{name: username, id: userId}]
 * @param {*} res
 */
exports.end = async (req, res) => {
	try {
		const { hostId, locationId, participantList } = req.body;
		let resMessage = 'Failed to post training announcement';

		if (hostId && locationId && participantList) {
			const username = await noblox.getUsernameFromId(hostId);
			let headshotUrl = await noblox.getPlayerThumbnail(hostId, undefined, undefined, true, 'headshot');
			headshotUrl = headshotUrl[0].imageUrl;

			const fields = [{ name: 'Host', value: username, inline: true }, { name: 'Participants', value: participantList.map((participant) => `◦ [${participant.name}](https://www.roblox.com/users/${participant.id}/profile)`).join('\n') }];

			const embed = EmbedBuilder('Training Notification', `The [training](https://roblox.com/games/${locationId}) has ended!`, headshotUrl, fields);
			const guild = client.guilds.cache.get(process.env.GUILD_ID);
			if (guild) {
				const channel = guild.channels.cache.find(element => element.id == EVENT_CHANNEL_ID);
				if (channel) {
					await channel.send(embed);
					resMessage = 'Successfully posted training notification!';
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