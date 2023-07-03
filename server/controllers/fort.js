const EmbedBuilder = require('../../discord/embedBuilder');
const noblox = require('noblox.js');
const axios = require('axios');
const { client } = require('../../discord/bot');
const { awardValor } = require('./user');
const TERM_CHANNEL_ID = '1125461030802309181';
const EVENT_CHANNEL_ID = '1125470734240727081';
const RES_CHANNEL_ID = '1125463082387374171';
/**
 * Terminal Requests
 * Posts raid updates on the discord channel
 * @param {*} req
 * @param {*} res
 */
exports.terminal = async (req, res) => {
	try {
		const { owner, currentPoints, winPoints, timeRemaining, hostileId, locationId } = req.body;
		let resMessage = 'Failed to post terminal status update';

		if (owner && currentPoints && winPoints && timeRemaining && hostileId) {
			const groupInfo = await noblox.getGroup(hostileId);
			const hostileEmblem = await axios.get(`https://thumbnails.roblox.com/v1/groups/icons?size=420x420&format=Png&groupIds=${hostileId}`);

			const fields = [{ name: 'Owner', value: owner, inline: true }, { name: 'Progress', value: `${currentPoints}/${winPoints}`, inline: true }, { name: 'Time Remaining', value: timeRemaining.toString(), inline: true }];

			const embed = EmbedBuilder('Terminal Status Update', `[${groupInfo.name} vs. Avarian Reborn](https://roblox.com/games/${locationId})`, hostileEmblem, fields);
			const guild = client.guilds.cache.get(process.env.GUILD_ID);
			if (guild) {
				const channel = guild.channels.cache.find(element => element.id == TERM_CHANNEL_ID);
				if (channel) {
					await channel.send(embed);
					resMessage = 'Successfully posted terminal status update!';
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
 * Defense Start
 * Posts a defense start notification
 * @param {*} req
 * @param {*} res
 */
exports.start = async (req, res) => {
	try {
		const { hostileId, locationId } = req.body;
		let resMessage = 'Failed to post defense notification';

		if (locationId && hostileId) {
			const groupInfo = await noblox.getGroup(hostileId);
			const hostileEmblem = await axios.get(`https://thumbnails.roblox.com/v1/groups/icons?size=420x420&format=Png&groupIds=${hostileId}`);
			const embed = EmbedBuilder('Defense Notification', `A defense from [${groupInfo.name} ](https://roblox.com/games/${locationId}) is occurring!`, hostileEmblem);
			const guild = client.guilds.cache.get(process.env.GUILD_ID);
			if (guild) {
				const channel = guild.channels.cache.find(element => element.id == EVENT_CHANNEL_ID);
				if (channel) {
					await channel.send(embed);
					resMessage = 'Successfully posted terminal status update!';
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
 * Post raid/defense results
 * @param {*} req userStats: { userId, kills: number, deaths: number, participationTime: number, valorAwarded: number }
 * @param {*} res
 */
exports.results = async (req, res) => {
	try {
		const { victor, hostileId, locationId, userStats } = req.body;
		let resMessage = 'Failed to post result message';

		if (victor && hostileId && userStats && locationId) {
			const groupInfo = await noblox.getGroup(hostileId);
			const hostileEmblem = await axios.get(`https://thumbnails.roblox.com/v1/groups/icons?size=420x420&format=Png&groupIds=${hostileId}`);
			let fields = [{ name: 'Winner', value: victor, inline: true }];
			const embeds = [EmbedBuilder('Defense Result Notification', `[${groupInfo.name} vs. Avarian Reborn](https://roblox.com/games/${locationId})`, hostileEmblem, fields)];

			userStats.forEach(async (stat) => {
				const username = noblox.getUsernameFromId(stat.userId);
				let headshotUrl = await noblox.getPlayerThumbnail(stat.userId, undefined, undefined, true, 'headshot');
				headshotUrl = headshotUrl[0].imageUrl;
				fields = [{ name: 'Kills', value: stat.kills.toString(), inline: true }, { name: 'Deaths', value: stat.deaths.toString(), inline: true }, { name: 'Participation Time', value: stat.participationTime, inline: true }, { name: 'Valor Awarded', value: stat.valorAwarded, inline: true }];
				embeds.push(EmbedBuilder('User Result Notification', `[${username}](https://roblox.com/users/${userStats.userId}/profile)`, headshotUrl, fields));
				await awardValor(stat.userId, stat.valorAwarded);
			});

			const guild = client.guilds.cache.get(process.env.GUILD_ID);
			if (guild) {
				const channel = guild.channels.cache.find(element => element.id == RES_CHANNEL_ID);
				if (channel) {
					await channel.send({ embeds: embeds });
					resMessage = 'Successfully posted result message!';
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