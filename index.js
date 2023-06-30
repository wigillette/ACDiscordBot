require('dotenv').config()
const { connect } = require('./data/db');
const { initBot } = require('./discord/bot');
const { initServer } = require('./server/app');
let client;

// Connect to the MongoDB database
connect().then((mongoClient) => {
    client = mongoClient
    initServer();
    initBot();
    // const Squadron = require('./data/models/squadron')
    // Squadron.createSquadron({_id: 1, name: 'Fanguards', desc: 'Avarian\'s Core Defense Squad', leaderId: 23823073, points: 0, emblemAssetId: 0})
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