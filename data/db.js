const mongoose = require('mongoose');

// Database URL
const connect = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
		console.log('Connected to Avarian Database');
	}
	catch (error) {
		console.error('Failed to connect to Avarian Database:', error);
	}
};

const closeConnection = async () => {
	try {
		await mongoose.connection.close();
		console.log('MongoDB connection closed');
	}
	catch (error) {
		console.error('Failed to close the MongoDB connection:', error);
	}
};

module.exports = { connect, closeConnection, mongoose };