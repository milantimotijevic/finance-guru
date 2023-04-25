const auth = require('../middleware/auth');
const UserService = require('../../service/User');

const applyRoutes = (app) => {
    // fetch all users
    app.get(
        '/user',
        auth(),
        async (req, res, next) => {
            try {
                return res.json([]);
            } catch (err) {
                console.log(err);
                return next(err);
            }
        }
    );

    // create user
    app.post(
        '/user',
        auth(),
        async (req, res, next) => {
            try {
                return res.json({});
            } catch (err) {
                console.log(err);
                return next(err);
            }
        }
    );

    // update basic user information
    app.put(
        '/user/:id',
        auth(),
        async (req, res, next) => {
            try {
                return res.json({});
            } catch (err) {
                console.log(err);
                return next(err);
            }
        }
    );
    
    // add bank connection to user
    app.put(
        '/user/:id/connect-banks',
        auth(),
        async (req, res, next) => {
            try {
                return res.json({});
            } catch (err) {
                console.log(err);
                return next(err);
            }
        }
    );

    // delete user
    app.delete(
        '/user/:id',
        auth(),
        async (req, res, next) => {
            try {
                return res.json({});
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