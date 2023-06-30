const { Client, GatewayIntentBits } = require('discord.js')
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs')
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

const initBot = () => {
    // Defining the Discord bot listeners
    client.on('ready', () => console.log(`Logged in as ${client.user.tag}`));
    
    // Initialize Commands
    const builtCommands = require('./commandBuilder');
    const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);
    rest.put(Routes.applicationGuildCommands(process.env.BOT_CLIENT_ID, process.env.GUILD_ID), { body: builtCommands })
        .then(() => console.log('Successfully registered bot commands'))
        .catch(console.error)

    client.on('interactionCreate', interaction => {
        if (interaction.isCommand()) {
            const { commandName } = interaction;
            const commandFile = `discord/commands/${commandName}.js`

            if (fs.existsSync(commandFile)) {
                const commandModule = require(`./commands/${commandName}.js`);
                console.log('Found command')
                commandModule.callback(interaction);
            }
        }
    })

    // Login and start up
    client.login(process.env.BOT_TOKEN);
    return client;
}

module.exports = {initBot};