const { getUserByRobloxId } = require('../../data/models/user');
const noblox = require('noblox.js');
const EmbedBuilder = require('../embedBuilder.js');
const { SlashCommandBuilder } = require('discord.js');

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

				let headshotUrl = await noblox.getPlayerThumbnail(userId, undefined, undefined, true, 'bust');
				headshotUrl = headshotUrl[0].imageUrl;

				const fields = [
					{ name: 'Rank', value: avarianRank, inline: true },
					{ name: 'Valor', value: userTableInfo.valor ? userTableInfo.valor.toString() : '0', inline: true },
					{ name: 'Squadron', value: userTableInfo.squadronName || 'None', inline: true },
					{ name: 'Last Active', value: userTableInfo.lastActive ? userTableInfo.lastActive.toString() : 'N/A', inline: true },
					{ name: 'Blurb', value: blurb || 'None', inline: false },
				];
				const embed = EmbedBuilder(`${username} (${displayName}) Information`, `[Account](https://roblox.com/users/${userId}/profile) created on ${joinDate}.\n\n Formerly known as ${oldNames.join(', ')}.`, headshotUrl, fields);

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