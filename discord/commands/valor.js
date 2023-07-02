/* eslint-disable no-case-declarations */
const { getUserByRobloxId, updateUser } = require('../../data/models/user');
const { fetchAllValor, setValor } = require('../../data/models/valor');
const noblox = require('noblox.js');
const EmbedBuilder = require('../embedBuilder.js');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('valor')
		.setDescription('Commands used for adding and deducting a user\'s valor')
		.addSubcommand(command => command
			.setName('modify')
			.setDescription('Award or deduct valor from users')
			.addStringOption(option => option
				.setName('username_list')
				.setDescription('A list of usernames of who to change valor, separated by a space character.')
				.setRequired(true),
			)
			.addStringOption(option => option
				.setName('method')
				.setDescription('Choose whether to add or deduct valor')
				.setRequired(true)
				.addChoices({ name: 'Add', value: 'Add' }, { name: 'Deduct', value: 'Deduct' }),
			)
			.addStringOption(option => option
				.setName('amount')
				.setDescription('Choose the valor amount')
				.setRequired(true),
			),
		)
		.addSubcommand(command => command
			.setName('view_standards')
			.setDescription('View the valor rank standards'),
		),
	admin: true,
	async execute(interaction) {
		const query = interaction.options.getSubcommand();
		switch (query) {
		case 'modify':
			const usernameList = interaction.options.getString('username_list');
			const method = interaction.options.getString('method');
			const amount = interaction.options.getString('amount');
			const usernames = usernameList.split(' ');
			const userProfiles = usernames.map(async (name) => {
				let toReturn = null;
				try {
					const id = await noblox.getIdFromUsername(name);
					toReturn = id ? await getUserByRobloxId(id) : null;
				}
				catch (err) {
					console.error(err);
				}
				return toReturn;
			});

			let embeds = [];
			userProfiles.forEach((profilePromise) => {
				profilePromise.then(async (profile) => {
					if (profile) {
						const scalar = method == 'Add' ? 1 : -1;
						const oldValor = profile.valor;
						profile.valor += scalar * amount;
						updateUser(profile);
						// TO-DO: Update a user's rank based on their new valor
						const profileUsername = await noblox.getUsernameFromId(profile._id);
						const embed = EmbedBuilder(`${profileUsername} Valor Update Notification`, 'Successfully updated valor!', undefined, [{ name: 'Former Valor', value: oldValor, inline: true }, { name: 'New Valor', value: profile.valor, inline: true }]);
						embeds.push(embed);
					}
				}).catch((e) => {
					console.error(e);
					embeds.push(EmbedBuilder('Valor Update Notification', 'Failed to update a user\'s valor'));
				});
			});

			embeds = embeds.length == 0 ? [EmbedBuilder('Valor Update Notification', 'Failed to update valor due to an invalid username')] : embeds;
			await interaction.reply({ embeds: embeds });
			break;
		case 'view_standards':
			const standards = await fetchAllValor();
			const roleStandards = await standards.map(async (standard) => {return { role: await noblox.getRole(process.env.GROUP_ID, standard.rank), ...standard };});
			let toReply = 'Failed to fetch standards';
			const standardFields = roleStandards.map((standard) => {return { name: standard.role, value: standard.valor, inline: true };});
			const embed = EmbedBuilder('Avarian Reborn Valor Rank Standards', 'Below is a list of required valor amounts to attain each rank in AR.', undefined, standardFields);
			toReply = { embeds: [embed] };

			await interaction.reply(toReply);
			break;
		default:
			await interaction.reply('Unknown error');
			break;
		}

	},
};