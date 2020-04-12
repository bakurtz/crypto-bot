const OrdersController = require('./controllers/orders.controller');
//const PermissionMiddleware = require('../common/middlewares/auth.permission.middleware');
//const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware');
const config = require('../common/config/env.config');

exports.routesConfig = function (router) {

    router.get('/order/getOrder/:orderId', [ //Database, not CB
        //ValidationMiddleware.validJWTNeeded,
        OrdersController.getById
    ]);

    router.get('/order/getAllOrders', [
        //ValidationMiddleware.validJWTNeeded,
        OrdersController.listAllOrders
    ]);

    router.get('/order/getOpenOrders', [
        //ValidationMiddleware.validJWTNeeded,
        OrdersController.listOpenOrders
    ]);    
    
    router.post('/order/addOrder', [
        //ValidationMiddleware.validJWTNeeded,
        OrdersController.addOrder
    ]);

    router.post('/order/updateOrder', [
        //ValidationMiddleware.validJWTNeeded,
        OrdersController.getById
    ]);
    
    router.post('/order/logFailedOrder', [
        //ValidationMiddleware.validJWTNeeded,
        OrdersController.getById
    ]);

    router.post('/order/archiveOrder/:orderId', [
        //ValidationMiddleware.validJWTNeeded,
        OrdersController.archiveOrder
    ]);

    router.post('/order/addFills/:orderId', [
        //ValidationMiddleware.validJWTNeeded,
        OrdersController.addFills
    ]);
};
