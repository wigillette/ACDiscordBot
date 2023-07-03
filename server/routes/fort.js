const controller = require('../controllers/fort');
const { authAPIToken } = require('../middleware');

module.exports = (app) => {
	app.use((req, res, next) => {
		res.header(
			'Access-Control-Allow-Headers',
			'x-access-token, Origin, Content-Type, Accept',
		);
		next();
	});

	// Here are our API endpoints:
	app.post('/api/defense/terminal', [authAPIToken.verifyApiToken], controller.terminal);
	app.post('/api/defense/results', [authAPIToken.verifyApiToken], controller.results);
	app.post('/api/defense/start', [authAPIToken.verifyApiToken], controller.start);
};