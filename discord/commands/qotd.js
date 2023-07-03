const EmbedBuilder = require('../embedBuilder.js');
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
		.setName('qotd')
		.setDescription('Posts a question of the day')
		.addStringOption(option =>
			option.setName('question')
				.setDescription('Enter the question')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('option1')
				.setDescription('Enter option 1')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('option2')
				.setDescription('Enter option 2')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('option3')
				.setDescription('Enter option 3'))
		.addStringOption(option =>
			option.setName('option4')
				.setDescription('Enter option 4')),
	async execute(interaction) {
		const question = interaction.options.getString('question');
		let options = [interaction.options.getString('option1'), interaction.options.getString('option2'), interaction.options.getString('option3'), interaction.options.getString('option4')];
		options = options.filter(option => option !== null);
		options = options.map((option, i) => {return { name: `Option ${i + 1}`, value: option, inline: true };});
		const reactions = ['🇦', '🇧', '🇨', '🇩'];
		const embed = EmbedBuilder(`${new Date().toDateString()} Question of the Day`, question, interaction.user.displayAvatarURL(), options);

		await interaction.reply({ embeds: [embed] });
		const message = await interaction.followUp({
			content: '**Options:**',
		});

		for (let i = 0; i < options.length; i++) {
			await message.react(reactions[i]);
		}
	},
};