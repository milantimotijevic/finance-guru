const auth = require('../middleware/auth');
const TransactionService = require('../../service/Transaction');

const applyRoutes = (app) => {
    // fetch transaction statistics (spending averages) for a user
    app.get(
        '/transaction/:userId/statistics',
        auth(),
        async (req, res, next) => {
            try {
                const { userId } = req.params;
                const result = await TransactionService.getStatistics(userId);
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