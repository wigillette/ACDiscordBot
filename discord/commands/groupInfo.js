const noblox = require('noblox.js');
const EmbedBuilder = require('../embedBuilder.js');
const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('group_info')
		.setDescription('Fetch information about a group')
		.addStringOption(option =>
			option.setName('name')
				.setDescription('Group name')
				.setRequired(true),
		),
	async execute(interaction) {
		try {
			const groupName = interaction.options.getString('name');
			const searchResults = await noblox.searchGroups(groupName, true, 10);
			const topResult = searchResults[0];
			if (topResult) {
				const topEmblem = await axios.get(`https://thumbnails.roblox.com/v1/groups/icons?size=420x420&format=Png&groupIds=${topResult.id}`);
				const allInfo = await noblox.getGroup(topResult.id);
				let otherResults = searchResults.slice(1, -1);
				otherResults = otherResults.map((result) => `◦ [${result.name}](https://www.roblox.com/groups/${result.id})`).join('\n');
				interaction.reply({ embeds: [EmbedBuilder('Group Information Notification', `Top Match: [${topResult.name}](https://roblox.com/groups/${topResult.id})`, (topEmblem && topEmblem.data && topEmblem.data.data) ? topEmblem.data.data[0].imageUrl : undefined, [
					{ name: 'Owner', value: `[${allInfo.owner.username} (${allInfo.owner.displayName})](https://roblox.com/users/${allInfo.owner.userId}/profile)`, inline: true },
					{ name: 'Member Count', value: topResult.memberCount.toString(), inline: true },
					{ name: 'Shout', value: (allInfo.shout && allInfo.shout.body.length > 0) ? allInfo.shout.body : 'Unavailable', inline: true },
					{ name: 'Creation Date', value: topResult.created.toString(), inline: true },
					{ name: 'Description', value: topResult.description.length > 0 ? topResult.description : 'Unavailable', inline: false },
					{ name: 'Other results:', value: otherResults.length > 0 ? otherResults : 'None', inline: false }],
				)],
				});
			}
			else {
				interaction.reply({ embeds: [EmbedBuilder('Group Information Notification', 'No groups matching the search query were found.')] });
			}
		}
		catch (e) {
			console.error(e);
			interaction.reply({ embeds: [EmbedBuilder('Group Information Notification', 'Unexpected error when searching for group')] });
		}
	},
};