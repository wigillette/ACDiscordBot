require('dotenv').config();
const { connect, closeConnection } = require('./data/db');
const noblox = require('noblox.js');

const { initBot } = require('./discord/bot');
const { initServer } = require('./server/app');
const { createUser } = require ('./data/models/user');


// Connect to the MongoDB database
connect().then(() => {
	// Login into Avarian_Automation
	const loginPromise = noblox.setCookie(process.env.AUTOMATION_COOKIE);
	loginPromise.then((user) => {
		const currentUserPromise = noblox.getCurrentUser();
		currentUserPromise.then(() => {
			console.log(`Logged in as ${user.UserName} [${user.UserID}]`);
			initServer(); // Initialize the web server
			initBot(); // Boot up the discord bot
			// createUser({ _id: 14320013, valor: 0, lastActive: '07/02/23', squadronName: 'Howlords' });
		});
	});
}).catch((e) => {
	console.error('Error connecting to the database:', e);
});

process.on('SIGINT', () => {
	closeConnection();
	process.exit();
});