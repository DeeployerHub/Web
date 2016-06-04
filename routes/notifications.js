'use strict';

var router     = express.Router();
var controller = getController('notifications')();
var middleware = getMiddleware('account')();

module.exports = function () {
    router.get('/get-json', middleware.signInCheck, controller.getJson);

    return router;
};
