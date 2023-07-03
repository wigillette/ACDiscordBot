const controller = require('../controllers/training');
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
	app.post('/api/training/start', [authAPIToken.verifyApiToken], controller.start);
	app.post('/api/training/end', [authAPIToken.verifyApiToken], controller.end);
};