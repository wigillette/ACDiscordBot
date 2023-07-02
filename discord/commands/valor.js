/* eslint-disable no-case-declarations */
const { getUserByRobloxId, updateUser } = require('../../data/models/user');
const { fetchAllValor, setValor } = require('../../data/models/valor');
const noblox = require('noblox.js');
const EmbedBuilder = require('../embedBuilder.js');
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
		.setName('valor')
		.setDescription('Commands used for adding and deducting a user\'s valor')
		.addSubcommand((command) =>
			command
				.setName('modify')
				.setDescription('Award or deduct valor from users')
				.addStringOption((option) =>
					option
						.setName('username_list')
						.setDescription('A list of usernames of who to change valor, separated by a space character.')
						.setRequired(true),
				)
				.addStringOption((option) =>
					option
						.setName('method')
						.setDescription('Choose whether to add or deduct valor')
						.setRequired(true)
						.addChoices({ name: 'Add', value: 'Add' }, { name: 'Deduct', value: 'Deduct' }),
				)
				.addStringOption((option) =>
					option.setName('amount').setDescription('Choose the valor amount').setRequired(true),
				),
		)
		.addSubcommand(command => command
			.setName('view_standards')
			.setDescription('View the valor rank standards'),
		)
		.addSubcommand((command) =>
			command
				.setName('set_standard')
				.setDescription('Allows users to change a rank\'s valor standards')
				.addStringOption((option) =>
					option.setName('rank_id').setDescription('Input the rank ID of the rank you wish to change').setRequired(true),
				)
				.addStringOption((option) =>
					option.setName('value').setDescription('The new value of the standard').setRequired(true),
				),
		),
	async updateRank(userId, username, currentValor, headshotUrl) {
		const formerRank = await noblox.getRankInGroup(process.env.GROUP_ID, userId);

		if (formerRank <= process.env.MAX_VALOR_RANK) {
			const standards = await fetchAllValor();
			const formerRole = await noblox.getRankNameInGroup(process.env.GROUP_ID, userId);
			let newRank = formerRank;
			standards.forEach((standard) => {
				if (currentValor >= standard.amount) {
					newRank = standard._id;
				}
			});

			if (newRank != formerRank) {
				const newRole = await noblox.getRole(process.env.GROUP_ID, newRank);
				noblox.setRank(process.env.GROUP_ID, userId, newRank);
				return EmbedBuilder('Rank Update Notification',
					`A rank change has occurred for [${username}](https://roblox.com/users/${userId}/profile) based on their current valor!`,
					headshotUrl,
					[{ name: 'Former Rank', value: formerRole, inline: true }, { name: 'New Rank', value: newRole.name, inline: true }]);
			}
		}
	},
	async execute(interaction) {
		const query = interaction.options.getSubcommand();

		switch (query) {
		case 'modify':
			const usernameList = interaction.options.getString('username_list');
			const method = interaction.options.getString('method');
			const amount = interaction.options.getString('amount');
			const usernames = usernameList.split(' ');

			if (amount > 0) {
				const embeds = await Promise.all(
					usernames.map(async (name) => {
						try {
							const id = await noblox.getIdFromUsername(name);
							const profile = id ? await getUserByRobloxId(id) : null;

							if (profile && profile.valor !== undefined) {
								const scalar = method === 'Add' ? 1 : -1;
								const oldValor = profile.valor;
								profile.valor += scalar * amount;
								updateUser(profile);
								const profileUsername = await noblox.getUsernameFromId(profile._id);
								let headshotUrl = await noblox.getPlayerThumbnail(id, undefined, undefined, true, 'headshot');
								headshotUrl = headshotUrl[0].imageUrl;
								const rankEmbed = await this.updateRank(id, profileUsername, profile.valor, headshotUrl);
								const valorEmbed = EmbedBuilder('Valor Update Notification', `Successfully updated valor for [${profileUsername}](https://roblox.com/users/${id}/profile)!`, headshotUrl, [
									{ name: 'Former Valor', value: oldValor.toString(), inline: true },
									{ name: 'New Valor', value: profile.valor.toString(), inline: true },
								]);
								return rankEmbed ? [valorEmbed, rankEmbed] : valorEmbed;
							}
						}
						catch (err) {
							console.error(err);
						}

						return EmbedBuilder('Valor Update Notification', `Failed to update ${name}'s valor due to an invalid profile!`);
					}),
				);
				await interaction.reply({ embeds: embeds.length > 0 ? embeds.flat() : [EmbedBuilder('Valor Update Notification', 'Failed to update valor due to an invalid username')] });
			}
			else {
				await interaction.reply({ embeds: [EmbedBuilder('Valor Notification', 'Valor amount must be positive')] });
			}
			break;

		case 'view_standards':
			const standards = await fetchAllValor();
			const roleStandards = await Promise.all(
				standards.map(async (standard) => {
					const role = await noblox.getRole(process.env.GROUP_ID, standard._id);
					return { role, ...standard };
				}),
			);

			const standardFields = roleStandards.map((standard) => ({
				name: `${standard._doc._id} | ${standard.role.name}`,
				value: standard._doc.amount.toString(),
				inline: true,
			}));

			const embed = EmbedBuilder(
				'Avarian Reborn Valor Rank Standards',
				'Below is a list of required valor amounts to attain each rank in AR.',
				undefined,
				standardFields,
			);
			await interaction.reply({ embeds: [embed] });
			break;

		case 'set_standard':
			const rankId = interaction.options.getString('rank_id');
			const value = interaction.options.getString('value');
			const insertedId = await setValor({ _id: Number(rankId), amount: Number(value) });
			const toReturn = insertedId !== -1
				? EmbedBuilder('Standard Update Notification', `Successfully updated rank ${rankId}'s required valor to ${value}!`)
				: EmbedBuilder('Standard Update Notification', 'Failed to update standard due to an invalid rankId or amount');
			await interaction.reply({ embeds: [toReturn] });
			break;

		default:
			await interaction.reply('Unknown error');
			break;
		}
	},
};
