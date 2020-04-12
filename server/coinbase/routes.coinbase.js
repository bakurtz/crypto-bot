const CoinbaseController = require('./controllers/coinbase.controller');
//const PermissionMiddleware = require('../common/middlewares/auth.permission.middleware');
const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware');
const config = require('../common/config/env.config');

exports.routesConfig = function (app) {
    
    app.post('/coinbase/placeOrder', [
        //ValidationMiddleware.validJWTNeeded,
        OrdersController.placeOrder
    ]);

    app.get('/coinbase/getFills', [
        //ValidationMiddleware.validJWTNeeded,
        UsersController.getFills
    ]);

    app.get('/coinbase/getMarketPrice', [
        //ValidationMiddleware.validJWTNeeded,
        UsersController.getMarketPrice
    ]);

    app.get('/coinbase/getAccountBalances', [
        //ValidationMiddleware.validJWTNeeded,
        UsersController.getAccountBalances
    ]);

    app.post('/coinbase/syncOrders', [
        //ValidationMiddleware.validJWTNeeded,
        UsersController.syncOrders
    ])
};