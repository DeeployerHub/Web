module.exports = ConsoleController;

var userRepos       = getRepos('users')();
var usersPostsRepos = getRepos('usersPosts')();

/**
 *  ConsoleController
 *
 * @returns {ConsoleController}
 * @constructor
 */
function ConsoleController () {
    'use strict';

    if (!(this instanceof ConsoleController)) {
        return new ConsoleController();
    }
}

/**
 * get console page
 *
 * @param req
 * @param res
 */
ConsoleController.prototype.console = function (req, res) {
    'use strict';

    userRepos.getUserInfo(req.user.email).then(function (userInfo) {
        res.render('console/pages/console', {
            socketRegion: 'console',
            user: userInfo
        });
    }, function (err) {
        console.error(err);

        errorPageRender(res, 400, 'Sorry, something went wrong. please try again');
    });
};

/**
 * get posts on console page
 *
 * @param req
 * @param res
 */
ConsoleController.prototype.getConsolePostsJson = function (req, res) {
    'use strict';

    var start   = req.query.start || 0;
    var length  = req.query.length || 10;
    var mapView = req.query.mapView || null;

    if (!mapView) {
        res.status(400).json({
            status: false,
            reason: [
                'no-map-view'
            ]
        });

        return;
    }

    userRepos.getUserInfo(req.user.email).then(function (userInfo) {
        usersPostsRepos.getConsolePosts(
            userInfo._id,
            mapView,
            start,
            length
        ).then(function (posts) {
            res.status(200).json({
                posts: posts || [],
                start: start,
                length: length
            });
        }, function (err) {
            console.error(err);

            res.status(400).json({
                status: false
            });
        });
    }, function (err) {
        console.error(err);

        res.status(400).json({
            status: false
        });
    });
};
