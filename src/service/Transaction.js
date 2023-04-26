const BasiqApi = require('../gateway/BasiqApi');

const getCostStatistics = async (userId) => {
    const transactions = await BasiqApi.getTransactions(userId);
    const debits = {
        count: 0,
        total: 0,
        average: 0,
        categories: {},
    };

    transactions.forEach(transaction => {
        if (transaction.direction === 'debit') {
            const debitCategory = transaction.subClass ? transaction.subClass.code : 'other';
            if (!debits.categories[debitCategory]) {
                debits.categories[debitCategory] = {
                    title: transaction.subClass.title,
                    count: 0,
                    total: 0,
                    average: 0,
                };
            }

            debits.count += 1;
            debits.categories[debitCategory].count += 1;
            debits.total = Math.round((debits.total + Math.abs(transaction.amount)) * 100) / 100;
            debits.categories[debitCategory].total = Math.round((debits.categories[debitCategory].total + Math.abs(transaction.amount)) * 100) / 100;
        }
    });



    debits.average = Math.round(debits.total / debits.count * 100) / 100;

    return debits;
};

module.exports = {
    getCostStatistics,
};