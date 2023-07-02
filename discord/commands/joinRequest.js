/* eslint-disable no-case-declarations */
const noblox = require('noblox.js');
const EmbedBuilder = require('../embedBuilder.js');
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
		.setName('join_request')
		.setDescription('Commands used for viewing, accepting, and declining join requests in the group')
		.addSubcommand(command => command
			.setName('view')
			.setDescription('View a list of the current join requests'),
		)
		.addSubcommand(command => command
			.setName('handle')
			.setDescription('Handle an existing join request')
			.addStringOption(option => option
				.setName('username')
				.setDescription('Enter the ROBLOX username of the user you wish to accept')
				.setRequired(true),
			)
			.addStringOption(option => option
				.setName('response')
				.setDescription('Decide whether to accept or deny the join request.')
				.setRequired(true)
				.addChoices({ name: 'Accept', value: 'Accept' }, { name: 'Decline', value: 'Decline' }),
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
			joinRequests = joinRequests.data.length == 0 ? 'No requests' : joinRequests.data.map((request) => `◦  [${request.requester.username}](https://www.roblox.com/users/${request.requester.userId}/profile)`).join('\n');
			const fields = [{ name: 'List', value: joinRequests, inline: false }];
			embed = EmbedBuilder('Join Request Notification', 'Here is a list of the current join requests in Avarian Reborn:', undefined, fields);
			await interaction.reply({ embeds: [embed] });
			break;
		case 'handle':
			username = interaction.options.getString('username');
			userId = await noblox.getIdFromUsername(username);
			const isAccepted = interaction.options.getString('response') === 'Accept';
			embed = EmbedBuilder('Join Request Notification', `Failed to accept ${username} into Avarian Reborn due to an invalid username or nonexisting request`);
			if (userId) {
				let headshotUrl = await noblox.getPlayerThumbnail(userId, undefined, undefined, true, 'headshot');
				headshotUrl = headshotUrl[0].imageUrl;
				noblox.handleJoinRequest(process.env.GROUP_ID, userId, isAccepted).then(async () => {
					embed = EmbedBuilder('Join Request Notification', `Successfully ${isAccepted ? 'accepted' : 'denied'} [${username}](https://www.roblox.com/users/${userId}/profile) into Avarian Reborn`, headshotUrl);
					await interaction.reply({ embeds: [embed] });
				}).catch(async (e) => {
					console.error(e);
					await interaction.reply({ embeds: [embed] });
				});
			}
			else {
				await interaction.reply({ embeds: [embed] });
			}
			break;
		default:
			break;
		}
	},
};