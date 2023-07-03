const EmbedBuilder = require('../embedBuilder.js');
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.setName('dm')
		.setDescription('Mass direct message an entire role')
		.addRoleOption(option =>
			option.setName('role')
				.setDescription('Mention the role')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('body')
				.setDescription('Enter the body of your message')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('title')
				.setDescription('Enter a title for your message')
				.setRequired(false)),
	async execute(interaction) {
		const role = interaction.options.getRole('role');
		const body = interaction.options.getString('body');
		const title = interaction.options.getString('title') || 'Avarian Reborn Alert';
		const membersWithRole = interaction.guild.roles.cache.get(role.id).members;

		membersWithRole.forEach(async (member) => {
			const embed = EmbedBuilder(title, body, interaction.user.displayAvatarURL(), [{ name: 'Author', value: interaction.user.toString(), inline: true }]);
			try {
				const user = await member.createDM();
				await user.send({ embeds: [embed] });
			}
			catch (error) {
				console.error(`Failed to send a direct message to ${member.user.tag}. Error: ${error}`);
			}
		});

		const resEmbed = EmbedBuilder('Avarian Alert Notification', `Alert successfully sent to users with the ${role} role!`);
		interaction.reply({ embeds: [resEmbed] });
	},
};