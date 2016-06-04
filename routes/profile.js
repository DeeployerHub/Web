'use strict';

var router     = express.Router();
var controller = getController('profile')();
var middleware = getMiddleware('account')();

module.exports = function () {
    // route for the signed in user
    router.get('/', middleware.signInCheck, function (req, res) {
        var page = 'posts';
        return controller.profile(req, res, page);
    });

    router.get('/posts', middleware.signInCheck, function (req, res) {
        var page = 'posts';
        return controller.profile(req, res, page);
    });

    router.get('/about', middleware.signInCheck, function (req, res) {
        var page = 'about';
        return controller.profile(req, res, page);
    });
    router.post('/about/update', middleware.signInCheck, controller.profileAboutUpdate);

    router.get('/followers', middleware.signInCheck, function (req, res) {
        var page = 'followers';
        return controller.profile(req, res, page);
    });

    router.post('/relation', middleware.signInCheck, controller.relation);

    router.post(
        '/avatar-upload',
        middleware.signInCheck,
        controller.profileAvatarUpload
    );
    router.post(
        '/cover-upload',
        middleware.signInCheck,
        controller.profileCoverUpload
    );
    // route for targeted username 
    router.get('/:username', middleware.signInCheck, function (req, res) {
        var username = req.params.username;
        var page     = 'posts';
        return controller.profile(req, res, page, username);
    });

    router.get('/:username/posts', middleware.signInCheck, function (req, res) {
        var username = req.params.username;
        var page     = 'posts';
        return controller.profile(req, res, page, username);
    });

    router.get('/:username/about', middleware.signInCheck, function (req, res) {
        var username = req.params.username;
        var page     = 'about';
        return controller.profile(req, res, page, username);
    });

    router.get('/:username/followers', middleware.signInCheck, function (req, res) {
        var username = req.params.username;
        var page     = 'followers';
        return controller.profile(req, res, page, username);
    });

    router.get('/:username/followers/get-json', middleware.signInCheck, function (req, res) {
        var username = req.params.username;
        return controller.getFollowers(req, res, username);
    });

    return router;
};
