const BasiqApi = require('../gateway/BasiqApi');

const getCostStatistics = async (userId) => {
    // TODO refresh connections
    // fetch all transactions for this user
    const transactions = await BasiqApi.getTransactions(userId);
    // init stats object to be populated during later iteration over transactions
    const debits = {
        count: 0,
        total: 0,
        average: 0,
        categories: {},
    };

    // iterate over transactions and calculate count + $ total for all debits and each debit category
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
    // calculate average for all debits and each debit category separately and round all numbers
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