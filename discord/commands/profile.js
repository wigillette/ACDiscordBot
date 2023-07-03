const { getUserByRobloxId } = require('../../data/models/user');
const noblox = require('noblox.js');
const EmbedBuilder = require('../embedBuilder.js');
const { SlashCommandBuilder } = require('discord.js');
const { getLeaderboard } = require('../../data/models/leaderboard');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('profile')
		.setDescription('Fetch a user\'s profile')
		.addStringOption(option =>
			option.setName('username')
				.setDescription('Enter the user\'s username')
				.setRequired(true)),
	async execute(interaction) {
		const usernameField = interaction.options.getString('username');
		if (usernameField && usernameField.length > 0) {
			try {
				const userId = await noblox.getIdFromUsername(usernameField);
				const userTableInfo = getUserByRobloxId(userId);
				const robloxInfo = await noblox.getPlayerInfo({ userId: userId });
				const username = robloxInfo.username;
				const displayName = robloxInfo.displayName;
				const blurb = robloxInfo.blurb;
				const joinDate = robloxInfo.joinDate.toLocaleString();
				const oldNames = robloxInfo.oldNames.reverse();
				const avarianRank = await noblox.getRankNameInGroup(process.env.GROUP_ID, userId);
				const leaderboardStats = await getLeaderboard(userId);


				let headshotUrl = await noblox.getPlayerThumbnail(userId, undefined, undefined, true, 'bust');
				headshotUrl = headshotUrl[0].imageUrl;

				const fields = [
					{ name: 'Rank', value: avarianRank, inline: true },
					{ name: 'Valor', value: userTableInfo.valor ? userTableInfo.valor.toString() : '0', inline: true },
					{ name: 'Squadron', value: userTableInfo.squadronName || 'None', inline: true },
					{ name: 'Level', value: leaderboardStats.level ? leaderboardStats.level.toString() : '1', inline: true },
					{ name: 'Equipped Sword', value: leaderboardStats.equippedSword || 'Default', inline: true },
					{ name: 'Global Kills', value: leaderboardStats.kills ? leaderboardStats.kills.toString() : '0', inline: true },
					{ name: 'Global Deaths', value: leaderboardStats.deaths ? leaderboardStats.deaths.toString() : '0', inline: true },
					{ name: 'Terminal Captures', value: (leaderboardStats.captures && leaderboardStats.captures.terminal) ? leaderboardStats.captures.terminal.toString() : '0', inline: true },
					{ name: 'Gate Captures', value: (leaderboardStats.captures && leaderboardStats.captures.gate) ? leaderboardStats.captures.gate.toString() : '0', inline: true },
					{ name: 'Last Active', value: userTableInfo.lastActive ? userTableInfo.lastActive.toString() : 'N/A', inline: true },
					{ name: 'Blurb', value: blurb || 'None', inline: false },
				];
				const embed = EmbedBuilder(`${username} (${displayName}) Information`, `[Account](https://roblox.com/users/${userId}/profile) created on ${joinDate}.${oldNames.length > 0 ? `\n\n Formerly known as ${oldNames.join(', ')}.` : ''}`, headshotUrl, fields);

				await interaction.reply({ embeds: [embed] });
			}
			catch (e) {
				await interaction.reply({ embeds: [EmbedBuilder('Profile Notification', 'Failed to fetch user profile')] });
				console.error('Error fetching player info: ', e);
			}
		}
		else {
			await interaction.reply({ embeds: [EmbedBuilder('Profile Notification', 'Failed to fetch user profile')] });
			console.error('Invalid argument specified');
		}
	},
};