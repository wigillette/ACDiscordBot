const { MongoClient } = require('mongodb');

// Database URL
const uri = `mongodb+srv://wgillette02:${process.env.DB_PASS}@avarian-server.oeqkrth.mongodb.net/`
let client;

const connect = async () => {
    try {
        client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        console.log('Connected to Avarian Database');
        return client
    } catch (e) {
        console.error('Failed to connect to Avarian Database: ', e);
    }
}

const getDB = () => client ? client.db(process.env.DB_NAME) : null;

module.exports = { connect, getDB }