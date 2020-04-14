const OrdersController = require('./controllers/orders.controller');
//const PermissionMiddleware = require('../common/middlewares/auth.permission.middleware');
const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware');
const config = require('../common/config/env.config');

exports.routesConfig = function (router) {

    router.get('/order/id/:orderId', [ //Database, not CB
        ValidationMiddleware.validJWTNeeded,
        OrdersController.getById
    ]);

    router.get('/order/getAll', [
        ValidationMiddleware.validJWTNeeded,
        OrdersController.listAllOrders
    ]);

    router.get('/order/getOpen', [
        ValidationMiddleware.validJWTNeeded,
        OrdersController.listOpenOrders
    ]);    
    
    router.post('/order/add', [
        ValidationMiddleware.validJWTNeeded,
        OrdersController.addOrder
    ]);

    router.post('/order/update', [
        ValidationMiddleware.validJWTNeeded,
        OrdersController.updateById
    ]);
    
    router.post('/order/logFailed', [
        ValidationMiddleware.validJWTNeeded,
        OrdersController.logFailed
    ]);

    router.post('/order/archive/:orderId', [
        ValidationMiddleware.validJWTNeeded,    
        OrdersController.archiveOrder
    ]);

    router.post('/order/addFills/:orderId', [
        ValidationMiddleware.validJWTNeeded,
        OrdersController.addFills
    ]);
};
