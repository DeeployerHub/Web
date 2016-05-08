'use strict';

module.exports = function() {
    var router = express.Router();
    var controller = getController('notifications');

    router.get('/get-json', getMiddleware('account.signInCheck'), controller.getJson);

    return router;
};
