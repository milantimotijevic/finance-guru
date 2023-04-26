const BasiqApi = require('../gateway/BasiqApi');

const getAllTransactions = async () => {
    return {};
};

const getStatistics = async () => {
    return BasiqApi.getToken();
};

module.exports = {
    getAllTransactions,
    getStatistics,
};