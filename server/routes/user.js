const controller = require('../controllers/user');
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
	app.post('/api/user/squadron', [authAPIToken.verifyApiToken], controller.updateSquadron);
	app.get('/api/user', [authAPIToken.verifyApiToken], controller.fetch);
};