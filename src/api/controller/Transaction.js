const auth = require('../middleware/auth');
const TransactionService = require('../../service/Transaction');

// TODO validation
const applyRoutes = (app) => {
    app.get(
        '/transaction/:userId/cost-statistics',
        auth(),
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