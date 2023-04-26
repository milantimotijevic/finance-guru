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
            const debitCategoryName = transaction.subClass ? transaction.subClass.code : 'other';
            if (!debits.categories[debitCategoryName]) {
                debits.categories[debitCategoryName] = {
                    title: transaction.subClass.title,
                    count: 0,
                    total: 0,
                    average: 0,
                };
            }

            debits.count += 1;
            debits.categories[debitCategoryName].count += 1;
            debits.total += Math.abs(transaction.amount);
            debits.categories[debitCategoryName].total += Math.abs(transaction.amount);
        }
    });

    debits.average = Math.round(debits.total / debits.count * 100) / 100;
    debits.total = Math.round(debits.total * 100) / 100;

    Object.keys(debits.categories).forEach(debitCategoryName => {
        const debitCategory = debits.categories[debitCategoryName];
        debitCategory.average = Math.round(debitCategory.total / debitCategory.count * 100) / 100;
        debitCategory.total = Math.round(debitCategory.total * 100) / 100;
    });

    return debits;
};

module.exports = {
    getCostStatistics,
};