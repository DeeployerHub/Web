'use strict';

module.exports = function() {
    var router = express.Router();
    console.log('test');
    var controller = getController('account/main.js');

    // route to specified controllers
    router.get('/sign-in', controller.signIn);

    return router;
};
