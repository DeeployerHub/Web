'use strict';

var router     = express.Router();
var controller = getController('root')();
var middleware = getMiddleware('account')();

module.exports = function () {
    // route to specified controllers
    router.get('/', middleware.consoleCheck, controller.landingPage);

    // static pages
    router.get('/support', controller.staticSupport);
    router.get('/services-features', controller.staticServicesFeatures);
    router.get('/terms-and-conditions', controller.staticTermsAndConditions);

    return router;
};
