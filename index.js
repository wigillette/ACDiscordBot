const { connect } = require('./database/db');
const { initBot } = require('./discord/bot');
const { initServer } = require('./server/app');
let client;

// Connect to the MongoDB database
connect().then(() => {
    initServer();
    client = initBot();
    // Start the Express server or initialize the Discord bot here
})
.catch((error) => {
    console.error('Error connecting to the database:', error);
});

process.on('SIGINT', () => {
    if (client) {
        client.close();
    }
    process.exit();
});