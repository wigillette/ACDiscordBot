const { getSquadron } = require('../../data/models/squadron.js');
const noblox = require('noblox.js');
const EmbedBuilder = require('../embedBuilder.js');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('squadrons')
		.setDescription('Fetches information about each of the squadrons')
		.addStringOption(option =>
			option.setName('name')
				.setDescription('Squadron name')
				.setRequired(true)
				.addChoices({ name: 'Bloodhounds', value: 'Bloodhounds' }, { name: 'Fanguards', value: 'Fanguards' }, { name: 'Howlords', value: 'Howlords' })),
	admin: false,
	async execute(interaction) {
		const squadronName = interaction.options.getString('name');
		if (squadronName && squadronName.length > 0) {
			const squadronInfo = await getSquadron(squadronName);
			try {
				const leaderInfo = await noblox.getPlayerInfo({ userId: squadronInfo.leaderId });
				const username = leaderInfo.username;

				let headshotUrl = await noblox.getPlayerThumbnail(squadronInfo.leaderId, undefined, undefined, true, 'headshot');
				headshotUrl = headshotUrl[0].imageUrl;

				const fields = [{ name: 'Points', value: squadronInfo.points.toString(), inline: true }, { name: 'Leader', value: `[${username}](https://www.roblox.com/users/${squadronInfo.leaderId}/profile)`, inline: true }];
				const embed = EmbedBuilder(`${squadronInfo._id} Information`, squadronInfo.desc, headshotUrl, fields);

				await interaction.reply({ embeds: [embed] });
			}
			catch (e) {
				await interaction.reply('Unexpected error');
				console.error('Error fetching player info: ', e);
			}
		}
		else {
			await interaction.reply('Invalid argument. Missing squadron name.');
			console.error('Invalid argument specified');
		}
	},
};