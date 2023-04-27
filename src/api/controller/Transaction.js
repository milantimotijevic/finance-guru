const Joi = require('joi');
const validatePathParams = require('../../util/validatePathParams');
const auth = require('../middleware/auth');
const TransactionService = require('../../service/Transaction');

const applyRoutes = (app) => {
    app.get(
        '/transaction/:userId/cost-statistics',
        auth(),
        validatePathParams(Joi.object().keys({
            userId: Joi.string().required(),
        })),
        async (req, res, next) => {
            try {
                const { userId } = req.params;
                const result = await TransactionService.getCostStatistics(userId);
                return res.json(result);
            } catch (err) {
                console.log(err);
                return next(err);
            }
        }
    );
};

module.exports = {
    applyRoutes,
};