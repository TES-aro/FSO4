const jwt = require('jsonwebtoken');

const getToken = request => {
	const authorization = request.get('authorization');
	if (authorization && authorization.startsWith('Bearer ')) {
		return authorization.replace('Bearer ', '');
	}
	return null
}

function tokenExctractor(req, res, next) {
	try{
		const token = getToken(req);
		const decodedToken = jwt.verify(token, process.env.SECRET);
		console.log(decodedToken)
		req.token = token;
		req.user = token.user ? decodedToken.id : null
		next();
	} catch {
		next();
	}
}

module.exports = { tokenExctractor };
