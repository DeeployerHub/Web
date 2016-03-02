'use strict';

module.exports = function() {
    var router = express.Router();

    router.get('/', getMiddleware('account.signInCheck'), function(req, res) {
        res.send('user profile!');
    });

    return router;
};
