const pack = require('../../../package.json');
const HealthService = require('../../service/Health');

const applyRoutes = (app) => {
    app.get(
        '/health',
        async (req, res, next) => {
            try {
                const BasiqApiHealth = await HealthService.getHealthCheck();
                return res.json({
                    service: pack.name,
                    server: 'up',
                    basiqApi: BasiqApiHealth,
                    version: pack.version,
                });
            } catch (err) {
                console.log(err);
                return next(err);
            }
        }
    )
};

module.exports = {
    applyRoutes,
};