'use strict';

module.exports = function() {
    var router = express.Router();
    var controller = getController('console');

    // route to specified controllers
    router.get('/', getMiddleware('account.signInCheck'), controller.console);

    return router;
};
