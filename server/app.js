const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');

// Route Modules
const fort = require('./routes/fort');
const training = require('./routes/training');
const user = require('./routes/user');

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

user(app);
fort(app);
training(app);

// Defining the routes
const initServer = () => {
	app.listen(PORT, () => console.log(`Server is listening on port ${process.env.PORT}`));
	app.get('/', (req, res) => res.send('Avarian Server Online'));
};

module.exports = { initServer };
