const BasiqApi = require('../gateway/BasiqApi');

const createUser = async () => {
    return {};
};

const updateUser = async () => {
    return {};
};

const connectBanks = async () => {
    return {};
};

const deleteUser = async () => {
    return {};
};

const refreshConnections = async (userId) => BasiqApi.refreshConnections(userId);

module.exports = {
    getUsers: BasiqApi.getUsers,
    createUser,
    updateUser,
    connectBanks,
    deleteUser,
    refreshConnections,
};