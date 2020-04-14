const ProfileController = require('./controllers/profile.controller');
const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware')

exports.routesConfig = function (app) {

    app.get('/profile/getLogs', [
        ValidationMiddleware.validJWTNeeded,
        ProfileController.listLogs
    ]);

    app.get('/profile/getConfig', [
        ValidationMiddleware.validJWTNeeded,
        ProfileController.getConfig
    ]);
    
    app.post('/profile/saveConfig', [
        ValidationMiddleware.validJWTNeeded,
        ProfileController.saveConfig
    ]);
};
