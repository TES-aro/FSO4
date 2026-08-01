const jwt = require('jsonwebtoken');

const getToken = request => {
	const authorization = request.get('authorization');
	if (authorization && authorization.startsWith('Bearer ')) {
		return authorization.replace('Bearer ', '');
	}
	return null
}

function tokenExctractor(req, res, next) {
	console.log("_-_in token middleware")
	const token = getToken(req);
	req.token = token;
	next();
}

module.exports = { tokenExctractor };
