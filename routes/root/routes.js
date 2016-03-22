module.exports = function() {
    'use strict';

    var router = express.Router();
    var controller = getController('root/main.js');

    // route to specified controllers
    router.get('/', getMiddleware('account.consoleCheck'), controller.landingPage);

    return router;
};
