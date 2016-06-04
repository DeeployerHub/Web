'use strict';

var router     = express.Router();
var controller = getController('console')();
var middleware = getMiddleware('account')();

module.exports = function () {

    // route to specified controllers
    router.get('/', middleware.signInCheck, controller.console);

    return router;
};
