const { Client, GatewayIntentBits, Collection, ActivityType } = require('discord.js');
const EmbedBuilder = require('./embedBuilder');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const path = require('path');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers] });
const USER_CHANNEL = 'users';

const initBot = () => {
	client.commands = new Collection();
	// Defining the Discord bot listeners
	client.on('ready', () => {
		console.log(`Logged in as ${client.user.tag}`);
		client.user.setPresence({
			activities: [{ name: 'Avarian Reborn | Developed by Lusconox', type: ActivityType.Watching }],
			status: 'dnd',
		});
	});

	// Initialize Commands
	const commandsPath = path.join(__dirname, 'commands');
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	commandFiles.forEach((file) => {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		client.commands.set(command.data.name, command);
	});

	const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);
	const builtCommands = Array.from(client.commands.values()).map((lib) => lib.data);
	rest.put(Routes.applicationGuildCommands(process.env.BOT_CLIENT_ID, process.env.GUILD_ID), { body: builtCommands })
		.then(() => console.log('Successfully registered bot commands'))
		.catch(console.error);

	client.on('interactionCreate', async interaction => {
		if (interaction.isCommand()) {
			const command = client.commands.get(interaction.commandName);
			if (command) {
				try {
					command.execute(interaction);
				}
				catch (e) {
					console.error(e);
					await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
				}
			}
		}
	});

	client.on('guildMemberAdd', member => {
		const embed = EmbedBuilder('Join Notification', `${member.user} has joined ${member.guild}.`, member.user.avatarURL());
		const channel = client.channels.cache.find(element => element.name === USER_CHANNEL);
		channel.send({ embeds: [embed] });
	},
	);
	client.on('guildMemberRemove', member => {
		const embed = EmbedBuilder('Leave Notification', `${member.user} has left ${member.guild}.`, member.user.avatarURL());
		const channel = client.channels.cache.find(element => element.name === USER_CHANNEL);
		channel.send({ embeds: [embed] });
	},
	);


	// Login and start up
	client.login(process.env.BOT_TOKEN);
	return client;
};

module.exports = { initBot };