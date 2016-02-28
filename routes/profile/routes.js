'use strict';

module.exports = function() {
    var router = express.Router();

    router.get('/', getMiddleware('general.signInCheck'), function(req, res) {
        res.send('user profile!');
    });

    return router;
};
