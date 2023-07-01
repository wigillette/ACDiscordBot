/* eslint-disable no-case-declarations */
const noblox = require('noblox.js');
const EmbedBuilder = require('../embedBuilder.js');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('join_request')
		.setDescription('Commands used for viewing, accepting, and declining join requests in the group')
		.addSubcommand(command => command
			.setName('view')
			.setDescription('View a list of the current join requests'),
		)
		.addSubcommand(command => command
			.setName('accept')
			.setDescription('Accept an existing join request')
			.addStringOption(option => option
				.setName('username')
				.setDescription('Enter the ROBLOX username of the user you wish to accept')
				.setRequired(true),
			),
		)
		.addSubcommand(command => command
			.setName('deny')
			.setDescription('Deny an existing join request')
			.addStringOption(option => option
				.setName('username')
				.setDescription('Enter the ROBLOX username of the user you wish to deny')
				.setRequired(true),
			),
		),
	admin: true,
	async execute(interaction) {
		const query = interaction.options.getSubcommand();
		let username;
		let userId;
		let embed;
		switch (query) {
		case 'view':
			let joinRequests = await noblox.getJoinRequests(process.env.GROUP_ID, 'Asc');
			joinRequests = joinRequests.data.length == 0 ? 'No requests' : joinRequests.data.map((request) => `◦  [${request.requester.username}](https://www.roblox.com/users/${request.requester.userId}/profile)\n`);
			const fields = [{ name: 'List', value: joinRequests, inline: false }];
			embed = EmbedBuilder('Join Request Notification', 'Here is a list of the current join requests in Avarian Reborn:', undefined, fields);
			await interaction.reply({ embeds: [embed] });
			break;
		case 'accept':
			username = interaction.options.getString('username');
			userId = await noblox.getIdFromUsername(username);
			embed = EmbedBuilder('Join Request Notification', `Failed to accept ${username} into Avarian Reborn`);
			if (userId) {
				noblox.handleJoinRequest(process.env.GROUP_ID, userId, true).then(() => {
					embed = EmbedBuilder('Join Request Notification', `Successfully accepted ${username} into Avarian Reborn`);
				}).catch((e) => {
					console.error(e);
				});
			}
			await interaction.reply({ embeds: [embed] });
			break;
		case 'deny': // TO-DO: condense accept/deny into one function
			username = interaction.options.getString('username');
			userId = await noblox.getIdFromUsername(username);
			embed = EmbedBuilder('Join Request Notification', `Failed to deny ${username}'s request into Avarian Reborn`);
			if (userId) {
				noblox.handleJoinRequest(process.env.GROUP_ID, userId, false).then(() => {
					embed = EmbedBuilder('Join Request Notification', `Successfully denied ${username}'s request into Avarian Reborn`);
				}).catch((e) => {
					console.error(e);
				});
			}
			await interaction.reply({ embeds: [embed] });
			break;
		default:
			break;
		}
	},
};