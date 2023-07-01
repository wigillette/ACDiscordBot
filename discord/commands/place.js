/* eslint-disable no-case-declarations */
const EmbedBuilder = require('../embedBuilder.js');
const { SlashCommandBuilder } = require('discord.js');
const { createPlace, fetchAllPlaces, getPlace, deletePlace } = require('../../data/models/place.js');
const PLACE_TYPES = require('../../shared/placeTypes.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('place')
		.setDescription('Multiple commands related to registered places in Avarian Reborn')
		.addSubcommand(command => command
			.setName('register')
			.setDescription('Register a place with Avarian Reborn')
			.addStringOption(option => option
				.setName('name')
				.setDescription('Input a name for the place')
				.setRequired(true),
			)
			.addStringOption(option => option
				.setName('place_id')
				.setDescription('Enter the place ID')
				.setRequired(true),
			)
			.addStringOption(option => option
				.setName('type')
				.setDescription('Select the type of place')
				.setRequired(true)
				.addChoices(...PLACE_TYPES.map((place) => {return { name: place, value: place };})),
			),
		)
		.addSubcommand(command => command
			.setName('fetch')
			.setDescription('Retrieve information about a registered place')
			.addStringOption(option => option
				.setName('name')
				.setDescription('Input the registered place\'s name')
				.setRequired(true),
			),
		)
		.addSubcommand(command => command
			.setName('fetch_all')
			.setDescription('Retrieve a list of all registered places'),
		)
		.addSubcommand(command => command
			.setName('delete')
			.setDescription('Unregister a place')
			.addStringOption(option => option
				.setName('name')
				.setDescription('Input the registered place\'s name')
				.setRequired(true),
			),
		),
	admin: true,
	async execute(interaction) {
		const query = interaction.options.getSubcommand();
		let placeName;
		let fields;
		let embed;
		switch (query) {
		case 'register':
			placeName = interaction.options.getString('name');
			const placeId = interaction.options.getString('place_id');
			const placeType = interaction.options.getString('type');
			await createPlace({ _id: placeName, placeId: placeId, placeType: placeType });
			fields = [{ name: 'Place Type', value: placeType, inline: true }, { name: 'Registration Name', value: placeName, inline: true }];
			embed = EmbedBuilder('Place Notification', `Successfully registered [${placeName}](https://www.roblox.com/games/${placeId}) with Avarian Reborn!`, undefined, fields);
			await interaction.reply({ embeds: [embed] });
			break;
		case 'fetch':
			placeName = interaction.options.getString('name');
			const placeInfo = await getPlace(placeName);
			fields = [{ name: 'Place Type', value: placeInfo.placeType, inline: true }];
			embed = EmbedBuilder('Place Notification', `Here is information about [${placeInfo._id}](https://www.roblox.com/games/${placeInfo.placeId})`, undefined, fields);
			await interaction.reply({ embeds: [embed] });
			break;
		case 'fetch_all':
			const allInfo = await fetchAllPlaces();
			allInfo.forEach(async (placeInfo) => {
				fields = [{ name: 'Place Type', value: placeInfo.placeType, inline: true }];
				embed = EmbedBuilder('Place Notification', `Here is information about [${placeInfo._id}](https://www.roblox.com/games/${placeInfo.placeId})`, undefined, fields);
				await interaction.reply({ embeds: [embed] });
			});
			break;
		case 'delete':
			placeName = interaction.options.getString('name');
			await deletePlace(placeName);
			embed = EmbedBuilder('Place Notification', `Successfully unregistered ${placeName} from Avarian Reborn!`);
			await interaction.reply({ embeds: [embed] });
			break;
		default:
			await interaction.reply('Unexpected error occurred');
			break;
		}
	},
};