const UsersController = require('./controllers/users.controller');
const PermissionMiddleware = require('../common/middlewares/auth.permission.middleware');
const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware');

exports.routesConfig = function (app) {
    app.post('/users', [
        ValidationMiddleware.noUsersExist,
        UsersController.insert
    ]);
    app.get('/users', [
        //ValidationMiddleware.validJWTNeeded,
        UsersController.list
    ]);
    app.get('/users/count', [
        //ValidationMiddleware.validJWTNeeded,
        UsersController.count
    ]);
    app.get('/users/:userId', [
        //ValidationMiddleware.validJWTNeeded,
        UsersController.getById
    ]);
    app.patch('/users/:userId', [
        //ValidationMiddleware.validJWTNeeded,
        UsersController.patchById
    ]);
    app.delete('/users/:userId', [
        //ValidationMiddleware.validJWTNeeded,
        UsersController.removeById
    ]);
};
