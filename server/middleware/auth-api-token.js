const catchError = (res) => res.status(403).json({ unauthorized: true });

const verifyApiToken = (req, res, next) => {
	const token = req.headers['x-access-token'];

	if (!token) {
		catchError(res);
	}
	else if (token == process.env.API_KEY) {
		next();
	}
	else {
		catchError(res);
	}
};

const authAPIToken = {
	verifyApiToken,
};

module.exports = authAPIToken;