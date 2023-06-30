require('dotenv').config()
const { connect } = require('./data/db');
const noblox = require('noblox.js');

const { initBot } = require('./discord/bot');
const { initServer } = require('./server/app');

let client;

// Connect to the MongoDB database
connect().then((mongoClient) => {
    client = mongoClient
    // Login into Avarian_Automation
    const loginPromise = noblox.setCookie(process.env.AUTOMATION_COOKIE);
    loginPromise.then((user) => {
        console.log(`Logged in as ${user.UserName} [${user.UserID}]`);
        initServer(); // Initialize the web server
        initBot(); // Boot up the discord bot
    })
})
.catch((error) => {
    console.error('Error connecting to the database:', error);
});

process.on('SIGINT', () => {
    if (client) {
        client.close();
        console.log('Disconnected from MongoDB Database!')
    }
    process.exit();
});