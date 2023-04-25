const { isBoom } = require('@hapi/boom');

function errorHandler(err, req, res, next) {
	if (isBoom(err)) {
		return res.status(err.output.statusCode).send(err.output.payload.message);
	}

	return res.status(500).send('Internal server error');
}

module.exports = errorHandler;
