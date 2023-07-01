/* eslint-disable no-case-declarations */
const noblox = require('noblox.js');
const EmbedBuilder = require('../embedBuilder.js');
const { SlashCommandBuilder } = require('discord.js');
const EVENT_TYPES = require('../../shared/eventTypes.js');
const { createEvent } = require('../../data/models/event.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('event')
		.setDescription('Multiple functions related to planning and debriefing events')
		.addSubcommand(command => command
			.setName('debrief')
			.setDescription('Debrief a completed event')
			.addStringOption(option => option
				.setName('host')
				.setDescription('Enter the host\'s ROBLOX username')
				.setRequired(true),
			)
			.addStringOption(option => option
				.setName('event_type')
				.setDescription('Select an event type')
				.setRequired(true)
				.addChoices(...EVENT_TYPES.map((place) => {return { name: place, value: place };})),
			)
			.addStringOption(option => option
				.setName('notes')
				.setDescription('Enter any debrief notes in this section')
				.setRequired(true),
			)
			.addStringOption(option => option
				.setName('result')
				.setDescription('Enter the result of your raid/defense if applicable')
				.setRequired(false)
				.addChoices({ name: 'Win', value: 'Win' }, { name: 'Loss', value: 'Loss' }, { name: 'Void', value: 'Void' }),
			),
		)
		.addSubcommand(command => command
			.setName('plan')
			.setDescription('Plan an event')
			.addStringOption(option => option
				.setName('host')
				.setDescription('Enter the host\'s ROBLOX username')
				.setRequired(true),
			)
			.addStringOption(option => option
				.setName('event_type')
				.setDescription('Select an event type')
				.setRequired(true)
				.addChoices(...EVENT_TYPES.map((place) => {return { name: place, value: place };})),
			)
			.addStringOption(option => option
				.setName('time_date')
				.setDescription('Enter the date and time of the event.')
				.setRequired(true),
			)
			.addStringOption(option => option
				.setName('location')
				.setDescription('Enter the location\'s place ID.')
				.setRequired(true),
			)
			.addStringOption(option => option
				.setName('notes')
				.setDescription('Enter any informational notes prior to the event')
				.setRequired(false),
			),
		),
	admin: true,
	async execute(interaction) {
		const query = interaction.options.getSubcommand();
		const eventType = interaction.options.getString('event_type');
		const notes = interaction.options.getString('notes');
		const host = interaction.options.getString('host');
		const hostId = await noblox.getIdFromUsername(host);
		let headshotUrl = await noblox.getPlayerThumbnail(hostId, undefined, undefined, true, 'headshot');
		headshotUrl = headshotUrl[0].imageUrl;
		let date;
		let fields;
		let embed;
		let toReply = 'Failed to plan the event due to invalid parameters';

		switch (query) {
		case 'debrief':
			const result = interaction.options.getString('result');
			date = new Date();
			date = date.toLocaleDateString('en-US', {
				month: '2-digit',
				day: '2-digit',
				year: '2-digit',
			});
			if (hostId && headshotUrl) {
				fields = [{ name: 'Host', value: `[${host}](https://www.roblox.com/users/${hostId}/profile)`, inline: true }, { name: 'Result', value: result || 'N/A', inline: true }, { name: 'Debrief Notes', value: notes, inline: false }];
				await createEvent({ eventType: eventType, hostId: hostId, date: date, notes: notes, result: result || 'N/A' });
				embed = EmbedBuilder('Event Notification', `Successfully logged an Avarian Reborn ${eventType} on ${date}!`, headshotUrl, fields);
				toReply = { embeds: [embed] };
			}
			await interaction.reply(toReply);
			break;
		case 'plan':
			date = interaction.options.getString('time_date');
			const locationID = interaction.options.getString('location');
			if (parseInt(locationID) && hostId && headshotUrl) {
				fields = [{ name: 'Event', value: eventType, inline: true }, { name: 'Host', value: `[${host}](https://www.roblox.com/users/${hostId}/profile)`, inline: true }, { name: 'Location', value: `https://www.roblox.com/games/${locationID}`, inline: false }, { name: 'Pre-Event Notes', value: notes, inline: false }];
				embed = EmbedBuilder('Event Notification', `Successfully logged an Avarian Reborn ${eventType} on ${date}!`, headshotUrl, fields);
				toReply = { embeds: [embed] };
			}
			await interaction.reply(toReply);
			break;
		default:
			break;
		}
	},
};