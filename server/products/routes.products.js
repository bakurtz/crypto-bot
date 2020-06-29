const ProductsController = require('./controllers/products.controller');
const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware');

exports.routesConfig = function (app) {
    app.post('/products/refreshProducts', [
        ValidationMiddleware.validJWTNeeded,
        ProductsController.refreshAvailableProducts
    ]);
    app.post('/products/updateProductConfig', [
        ValidationMiddleware.validJWTNeeded,
        ProductsController.updateProductConfig
    ]);
    app.get('/products/selectedProducts', [
        ValidationMiddleware.validJWTNeeded,
        ProductsController.getSelectedProducts
    ]);
};
