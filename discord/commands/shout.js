const noblox = require('noblox.js');
const EmbedBuilder = require('../embedBuilder.js');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shout')
		.setDescription('Post an announcement to the group and discord')
		.addStringOption(option =>
			option.setName('body')
				.setDescription('Enter the body for your announcement')
				.setRequired(true),
		)
		.addStringOption(option =>
			option.setName('title')
				.setDescription('Enter a title for your announcement')
				.setRequired(false),
		),
	async execute(interaction) {
		const shoutTitle = interaction.options.getString('title');
		const shoutBody = interaction.options.getString('body');
		const author = interaction.user;
		const authorAvatarURL = author.displayAvatarURL();
		const embed = EmbedBuilder(shoutTitle || 'Avarian Announcement', shoutBody, authorAvatarURL, [{ name: 'Author', value: author.toString(), inline: false }]);
		await noblox.shout(process.env.GROUP_ID, `${author.username}: ${shoutBody}`);
		interaction.reply({ content: `${interaction.guild.roles.everyone}`, embeds: [embed] });
	},
};