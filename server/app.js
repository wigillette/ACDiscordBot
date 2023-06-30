const express = require('express')
const app = express();

// Defining the routes
const initServer = () => {
    app.listen(process.env.PORT, () => console.log(`Server is listening on port ${process.env.PORT}`));
    app.get('/', (req, res) => res.send('Avarian Server Online'));
}

module.exports = {initServer};
