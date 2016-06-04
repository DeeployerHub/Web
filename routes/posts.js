'use strict';

var router     = express.Router();
var controller = getController('posts')();
var middleware = getMiddleware('account')();

module.exports = function () {
    router.get('/:username/get-posts-json', middleware.signInCheck, function (req, res) {
        var username = req.params.username;

        return controller.getProfilePostsJson(req, res, username);
    });

    router.post('/compose', middleware.signInCheck, controller.compose);

    return router;
};
