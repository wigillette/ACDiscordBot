const { Client, GatewayIntentBits } = require('discord.js')
const TOKEN = 'MTEyMzMzNDc5Mzk4NDIxNzI5OQ.GF7Kyz.gzBaXz_YS-N-n5VXd8Fe0zLacduPvMpMc_RWVk'
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => console.log(`Logged in as ${client.user.tag}`));
client.on('messageCreate', (message) => {
    if (message.content === '!hello') {
        message.channel.send('Hello!');
    }
})
client.login(TOKEN);

startBot();