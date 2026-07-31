const jwt = require('jsonwebtoken');

const getToken = request => {
	const authorization = request.get('authorization');
	if (authorization && authorization.startsWith('Bearer ')) {
		return authorization.replace('Bearer ', '');
	}
	return null
}

const tokenExctractor = (req, res, next) => {
	const token = getToken(req);
	req.token = token;
	next();
}

module.exports = {tokenExctractor};
