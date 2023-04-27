const BasiqApi = require('../gateway/BasiqApi');

const connectBanks = async () => {
    return {};
};

const deleteUser = async () => {
    return {};
};

const refreshConnections = async (userId) => BasiqApi.refreshConnections(userId);

module.exports = {
    getUsers: BasiqApi.getUsers,
    createUser: BasiqApi.createUser,
    connectBanks,
    deleteUser,
    refreshConnections,
};