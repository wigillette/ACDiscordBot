require('dotenv').config()
const { Client, GatewayIntentBits } = require('discord.js')
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });


const initBot = () => {
    // Defining the Discord bot listeners
    client.on('ready', () => console.log(`Logged in as ${client.user.tag}`));
    client.on('messageCreate', (message) => {
        
    })
    // Initialize
    client.login(process.env.BOT_TOKEN);
    return client;
}

module.exports = {initBot};