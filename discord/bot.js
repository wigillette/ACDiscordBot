const { Client, GatewayIntentBits, Collection } = require('discord.js')
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs')
const path = require('path')
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });



const initBot = () => {
    client.commands = new Collection();
    // Defining the Discord bot listeners
    client.on('ready', () => console.log(`Logged in as ${client.user.tag}`));
    
    // Initialize Commands
    const commandsPath = path.join(__dirname, 'commands');
    let commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    commandFiles.forEach((file) => {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        client.commands.set(command.data.name, command);
    })


    const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);
    const builtCommands = Array.from(client.commands.values()).map((lib) => lib.data)
    rest.put(Routes.applicationGuildCommands(process.env.BOT_CLIENT_ID, process.env.GUILD_ID), { body: builtCommands })
        .then(() => console.log('Successfully registered bot commands'))
        .catch(console.error)

    client.on('interactionCreate', async interaction => {
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (command) {
                try {
                    command.execute(interaction);
                } catch (e) {
                    console.error(e)
                    await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true});
                }
            }
        }
    })

    // Login and start up
    client.login(process.env.BOT_TOKEN);
    return client;
}

module.exports = {initBot};