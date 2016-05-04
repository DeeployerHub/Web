'use strict';

module.exports = function() {
    var router = express.Router();
    var controller = getController('posts');

    router.get('/get-posts-json', getMiddleware('account.signInCheck'), controller.getProfilePostsJson);
    router.post('/compose', getMiddleware('account.signInCheck'), controller.compose);
    
    return router;
};
