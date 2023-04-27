const Boom = require('@hapi/boom');
/**
 * Validation does not work on path params for some reason, so we use this as a workaround
 */
const validatePathParams = function validatepathParams(validator) {
	return (req, res, next) => {
		const validationResult = validator.validate(req.params);
		if (validationResult.error) throw new Boom.badData(`Error validating path parameters. ${validationResult.error.message}`);
		next();
	};
};

module.exports = validatePathParams;
