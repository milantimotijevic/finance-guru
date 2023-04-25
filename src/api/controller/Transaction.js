const auth = require('../middleware/auth');
const TransactionService = require('../../service/Transaction');

const applyRoutes = (app) => {
    // fetch all transactions for a user
    app.get(
        '/transaction/:userId',
        auth(),
        async (req, res, next) => {
            try {
                const result = await TransactionService.getAllTransactions();
                return res.json(result);
            } catch (err) {
                console.log(err);
                return next(err);
            }
        }
    );

    // fetch transaction statistics (spending averages) for a user
    app.get(
        '/transaction/:userId/stats',
        auth(),
        async (req, res, next) => {
            try {
                const result = await TransactionService.getStatistics();
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