'use strict';

module.exports = function() {
    var router = express.Router();
    var controller = getController('posts');

    router.get('/:username/get-posts-json', function(req, res) {
        var username = req.params.username;

        return controller.getProfilePostsJson(req, res, username);
    });


    router.post('/compose', getMiddleware('account.signInCheck'), controller.compose);
    
    return router;
};
