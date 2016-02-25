'use strict';

module.exports = function() {
    var router = express.Router();
    var controller = getController('account/main.js');

    // route to specified controllers
    router.get('/sign-in', controller.signIn);
    router.get('/sign-out', controller.signOut);

    return router;
};
