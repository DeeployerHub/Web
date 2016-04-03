module.exports = function() {
    'use strict';

    var router = express.Router();
    var controller = getController('root/main.js');

    // route to specified controllers
    router.get('/', getMiddleware('account.consoleCheck'), controller.landingPage);

    // static pages
    router.get('/support', controller.static.support);
    router.get('/services-features', controller.static.servicesFeatures);
    router.get('/terms-and-conditions', controller.static.termsAndConditions);

    return router;
};
