const Joi = require('joi');
const { createValidator } = require('express-joi-validation');
const validator = createValidator({});
const validatePathParams = require('../../util/validatePathParams');
const auth = require('../middleware/auth');
const UserService = require('../../service/User');

const applyRoutes = (app) => {
    // fetch all users
    app.get(
        '/user',
        auth(),
        async (req, res, next) => {
            try {
                const result = await UserService.getUsers();
                return res.json(result);
            } catch (err) {
                console.log(err);
                return next(err);
            }
        }
    );

    // create user
    app.post(
        '/user',
        validator.body(Joi.object().keys({
            email: Joi.string().email().required(),
            mobile: Joi.string().regex(/^\+6(?=\d{10}$)\d{10}$/).messages({'string.pattern.base': 'Must provide a proper Australian phone number'}).required(),
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
        })),
        async (req, res, next) => {
            try {
                const result = await UserService.createUser(req.body);
                return res.json(result);
            } catch (err) {
                console.log(err);
                return next(err);
            }
        }
    );
    
    // add institution connection to user
    app.put(
        '/user/:id/connect-institution',
        auth(),
        validatePathParams(Joi.object().keys({
            loginId: Joi.string().required(),
            password: Joi.string().required(),
            id: Joi.string().required(),
        })),

        async (req, res, next) => {
            try {
                return res.json({});
            } catch (err) {
                console.log(err);
                return next(err);
            }
        }
    );

    app.delete(
        '/user/:id',
        auth(),
        validatePathParams(Joi.object().keys({
            userId: Joi.string().guid().required(),
        })),
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