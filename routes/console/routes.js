'use strict';

module.exports = function() {
    var router = express.Router();
    var controller = getController('console/main.js');

    // route to specified controllers
    router.get('/', getMiddleware('general.signInCheck'), controller.console);

    return router;
};
