const BasiqApi = require('../gateway/BasiqApi');

const getStatistics = async (userId) => {
    return BasiqApi.getTransactions(userId);
};

module.exports = {
    getStatistics,
};