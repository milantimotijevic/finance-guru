const BasiqApi = require('../gateway/BasiqApi');

module.exports = {
    getUsers: BasiqApi.getUsers,
    createUser: BasiqApi.createUser,
    connectInstitution: BasiqApi.connectInstitution,
    deleteUser: BasiqApi.deleteUser,
    refreshConnections: BasiqApi.refreshConnections,
};