'use strict';

module.exports = function() {
    var router = express.Router();
    var controller = getController('notifications/main.js');

    router.get('/get-json', getMiddleware('account.signInCheck'), controller.getJson);

    return router;
};
