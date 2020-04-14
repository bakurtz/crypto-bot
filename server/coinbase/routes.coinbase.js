const CoinbaseController = require('./controllers/coinbase.controller');
const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware');

exports.routesConfig = function (app) {
    
    app.post('/coinbase/placeOrder', [
        ValidationMiddleware.validJWTNeeded,
        CoinbaseController.placeOrder
    ]);

    app.get('/coinbase/getFills/:orderId', [
        ValidationMiddleware.validJWTNeeded,
        CoinbaseController.getFills
    ]);

    app.get('/coinbase/getMarketPrice', [
        ValidationMiddleware.validJWTNeeded,
        CoinbaseController.getMarketPrice
    ]);

    app.get('/coinbase/getAccountBalances', [
        ValidationMiddleware.validJWTNeeded,
        CoinbaseController.getAccountBalances
    ]);

    app.get('/coinbase/getOrder/:orderId', [
        ValidationMiddleware.validJWTNeeded,
        CoinbaseController.getOrder
    ])

    app.post('/coinbase/syncOrders', [
        ValidationMiddleware.validJWTNeeded,
        CoinbaseController.syncOrders
    ]);
};